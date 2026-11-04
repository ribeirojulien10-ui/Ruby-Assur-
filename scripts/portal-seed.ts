/**
 * Initialise l'environnement LOCAL du portail : compte administrateur de développement,
 * modèles de checklists et dossiers de DÉMONSTRATION entièrement fictifs.
 *
 *   npm run portal:seed            -> crée ce qui manque
 *   npm run portal:seed -- --reset-demo  -> supprime puis recrée les dossiers de démonstration
 *
 * Refuse de s'exécuter en production. Aucune donnée réelle, aucun e-mail envoyé.
 */
import fs from "node:fs";
import path from "node:path";
import { randomBytes, randomInt } from "node:crypto";
import { crc32, deflateSync } from "node:zlib";
import { Readable } from "node:stream";

for (const f of [".env.development.local", ".env.local"]) if (fs.existsSync(f)) process.loadEnvFile(f);

import { buildAuth, authReady } from "../lib/auth";
import { dataDir } from "../lib/portal/config";
import { defaultContext } from "../lib/portal/context";
import { get, all } from "../lib/portal/db";
import {
  closeRequest,
  createRequest,
  deleteRequestPermanently,
  resetDefaultTemplates,
  listTemplates,
  reviewItem,
  type TemplateItemInput,
} from "../lib/portal/admin";
import { completeUpload, createUploadIntent, receiveUpload, submitRequest, saveAnswers } from "../lib/portal/client";
import type { AdminSession } from "../lib/portal/types";

if (process.env.NODE_ENV === "production") throw new Error("Refus : script réservé au développement local.");

const ADMIN_EMAIL = (process.env.PORTAL_ADMIN_EMAILS ?? "julien@ruby-assur.test").split(",")[0].trim();
const seedAdmin: AdminSession = { userId: "seed-script", email: ADMIN_EMAIL };

// ── Fichiers fictifs valides ──────────────────────────────────────────────
function fakePdf(title: string): Buffer {
  const text = `FICTIF - ${title} - DEMONSTRATION LOCALE RUBY ASSUR`.replace(/[()\\]/g, "");
  const stream = `BT /F1 16 Tf 50 740 Td (${text}) Tj ET\nBT /F1 11 Tf 50 710 Td (Document genere automatiquement. Aucune donnee reelle.) Tj ET`;
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let out = "%PDF-1.4\n";
  const offsets: number[] = [];
  objs.forEach((o, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, "latin1");
}

function fakePng(): Buffer {
  const w = 240, h = 150;
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const o = y * (w * 3 + 1) + 1 + x * 3;
      const border = x < 6 || y < 6 || x >= w - 6 || y >= h - 6;
      raw[o] = border ? 201 : 246; raw[o + 1] = border ? 162 : 241; raw[o + 2] = border ? 75 : 231;
    }
  }
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

const ctx = defaultContext();
const getItemsOf = (id: string) => all<{ id: string; label: string; required: number }>(ctx.db, "SELECT id, label, required FROM request_items WHERE request_id = ? ORDER BY sort", id);

async function put(token: string, itemId: string, name: string, content: Buffer) {
  const intent = createUploadIntent(ctx, token, { itemId, fileName: name, size: content.length });
  await receiveUpload(ctx, intent.uploadToken, Readable.toWeb(Readable.from([content])) as ReadableStream<Uint8Array>);
  await completeUpload(ctx, token, intent.uploadId);
}

const ref = (slug: string): TemplateItemInput[] => {
  const t = listTemplates(ctx, seedAdmin).find((x) => x.insuranceSlug === slug)!;
  return t.items.map((i) => ({ label: i.label, instructions: i.instructions, required: i.required, formats: i.formats }));
};

const links: string[] = [];
const note = (label: string, token: string) => links.push(`${label}\n  ${ctx.baseUrl}/documents/${token}\n`);

/** Un dossier de démonstration PAR modèle de documents (pour comparer ce que voit le client et Julien). */
async function seedProducts() {
  const old = all<{ id: string }>(ctx.db, "SELECT r.id FROM requests r JOIN clients c ON c.id = r.client_id WHERE c.full_name LIKE 'Démo — Test %'");
  for (const { id } of old) await deleteRequestPermanently(ctx, seedAdmin, id);
  ctx.db.exec("DELETE FROM clients WHERE full_name LIKE 'Démo — Test %'");
  const out: string[] = [];
  for (const t of listTemplates(ctx, seedAdmin)) {
    const r = createRequest(ctx, seedAdmin, {
      isDemo: true,
      newClient: { fullName: `Démo — Test ${t.name}`, email: "test.produit@example.invalid", phone: "0600000000" },
      insuranceSlug: t.insuranceSlug,
      title: t.name,
      instructions: t.instructions || undefined,
      items: t.items.map((i) => ({ label: i.label, instructions: i.instructions, required: i.required, formats: i.formats })),
    });
    // un seul document déposé (le premier) : permet de voir l'état « Reçu » à côté des « À fournir »
    const first = getItemsOf(r.id)[0];
    await put(r.token, first.id, "document-fictif.pdf", fakePdf(first.label));
    out.push(`${t.name}\n  ${ctx.baseUrl}/documents/${r.token}\n`);
  }
  fs.writeFileSync(path.join(dataDir(), "demo-links-produits.txt"), `UN DOSSIER FICTIF PAR PRODUIT\n\n${out.join("\n")}`, { mode: 0o600 });
  console.log(`✔ ${out.length} dossiers de test (un par produit). Liens : ${path.join(dataDir(), "demo-links-produits.txt")}`);
}

async function main() {
  const reset = process.argv.includes("--reset-demo");
  await authReady();
  if (process.argv.includes("--products")) {
    resetDefaultTemplates(ctx);
    await seedProducts();
    return;
  }

  // 1) Compte administrateur local
  const exists = get<{ id: string }>(ctx.db, 'SELECT id FROM "user" WHERE email = ?', ADMIN_EMAIL);
  const credFile = path.join(dataDir(), "dev-credentials.txt");
  if (!exists) {
    const password = randomBytes(15).toString("base64url");
    const auth = buildAuth({ allowSignUp: true });
    await auth.api.signUpEmail({ body: { email: ADMIN_EMAIL, password, name: "Julien (compte de développement local)" } });
    fs.writeFileSync(credFile, `E-mail : ${ADMIN_EMAIL}\nMot de passe : ${password}\n\nCompte de DÉVELOPPEMENT LOCAL uniquement (non utilisé en production).\n`, { mode: 0o600 });
    console.log(`✔ Compte administrateur local créé (${ADMIN_EMAIL}). Identifiants : ${credFile}`);
  } else console.log(`• Compte administrateur déjà présent (${ADMIN_EMAIL}).`);

  // 2) Modèles
  resetDefaultTemplates(ctx); // aligne les modèles initiaux sur lib/portal/default-templates.ts
  console.log(`✔ Modèles de checklists : ${listTemplates(ctx, seedAdmin).length}`);

  // 3) Dossiers de démonstration
  const demoIds = all<{ id: string }>(ctx.db, "SELECT id FROM requests WHERE is_demo = 1");
  if (demoIds.length && !reset) {
    console.log(`• ${demoIds.length} dossiers de démonstration déjà présents (utilisez --reset-demo pour les recréer).`);
    return;
  }
  for (const { id } of demoIds) await deleteRequestPermanently(ctx, seedAdmin, id);
  ctx.db.exec("DELETE FROM clients WHERE is_demo = 1");

  const demo = { isDemo: true };

  // A. Auto : 3 pièces attendues, 2 transmises (incomplet)
  const a = createRequest(ctx, seedAdmin, {
    ...demo, newClient: { fullName: "Démo — Camille Exemple", email: "camille.exemple@example.invalid", phone: "0600000001" },
    insuranceSlug: "assurance-auto-moto", items: ref("assurance-auto-moto").slice(0, 3), instructions: "Dossier de démonstration (fictif).",
  });
  let it = getItemsOf(a.id);
  await put(a.token, it[0].id, "permis-fictif.pdf", fakePdf("Permis de conduire"));
  await put(a.token, it[1].id, "carte-grise-fictive.png", fakePng());
  note("A. Auto — 2 pièces sur 3 reçues (incomplet) — Camille Exemple", a.token);

  // B. Décennale : toutes les pièces obligatoires déposées + confirmé (à vérifier)
  const b = createRequest(ctx, seedAdmin, {
    ...demo, newClient: { fullName: "Démo — Atelier Fictif SARL", email: "atelier.fictif@example.invalid", phone: "0600000002" },
    insuranceSlug: "assurance-decennale", items: ref("assurance-decennale"),
  });
  it = getItemsOf(b.id);
  for (const i of it.filter((x) => x.required)) await put(b.token, i.id, `${i.label.split(" ")[0].toLowerCase()}-fictif.pdf`, fakePdf(i.label));
  submitRequest(ctx, b.token);
  note("B. Décennale — complet en pièces, confirmé par le client (à vérifier) — Atelier Fictif SARL", b.token);

  // C. Auto : une pièce refusée (à remplacer)
  const c = createRequest(ctx, seedAdmin, {
    ...demo, newClient: { fullName: "Démo — Lucas Modèle", email: "lucas.modele@example.invalid", phone: "0600000003" },
    insuranceSlug: "assurance-auto-moto", items: ref("assurance-auto-moto").slice(0, 3),
  });
  it = getItemsOf(c.id);
  for (const i of it) await put(c.token, i.id, `${i.label.split(" ")[0].toLowerCase()}-fictif.pdf`, fakePdf(i.label));
  submitRequest(ctx, c.token);
  reviewItem(ctx, seedAdmin, it[0].id, "validate");
  reviewItem(ctx, seedAdmin, it[2].id, "replace", { reason: "illisible", note: "La photo est floue, merci de la reprendre." });
  note("C. Auto — une pièce à remplacer — Lucas Modèle", c.token);

  // D. Lien expiré
  const d = createRequest(ctx, seedAdmin, {
    ...demo, newClient: { fullName: "Démo — Nora Expirée", email: "nora.expiree@example.invalid" },
    insuranceSlug: "assurance-emprunteur", items: ref("assurance-emprunteur"),
  });
  ctx.db.prepare("UPDATE requests SET expires_at = ? WHERE id = ?").run(new Date(Date.now() - 3 * 86_400_000).toISOString(), d.id);
  note("D. Emprunteur — LIEN EXPIRÉ — Nora Expirée", d.token);

  // E. Dossier terminé
  const e = createRequest(ctx, seedAdmin, {
    ...demo, newClient: { fullName: "Démo — Paul Terminé", email: "paul.termine@example.invalid" },
    insuranceSlug: "rc-pro", items: ref("rc-pro"),
  });
  it = getItemsOf(e.id);
  for (const i of it.filter((x) => x.required)) await put(e.token, i.id, "kbis-fictif.pdf", fakePdf(i.label));
  submitRequest(ctx, e.token);
  for (const i of it.filter((x) => x.required)) reviewItem(ctx, seedAdmin, i.id, "validate");
  closeRequest(ctx, seedAdmin, e.id);
  note("E. RC Pro — dossier terminé (clôturé) — Paul Terminé", e.token);

  // F. Dossier vierge à compléter soi-même (pour tester le parcours client de bout en bout)
  const f = createRequest(ctx, seedAdmin, {
    ...demo, newClient: { fullName: "Démo — Inès Témoin", email: "ines.temoin@example.invalid", phone: "0600000004" },
    insuranceSlug: "assurance-auto-moto", items: ref("assurance-auto-moto").slice(0, 3),
  });
  note("F. Auto — dossier vierge (aucun fichier) — Inès Témoin : à utiliser pour tester le dépôt", f.token);

  // G. Questions conditionnelles
  const g = createRequest(ctx, seedAdmin, {
    ...demo, newClient: { fullName: "Démo — Hugo Conditionnel", email: "hugo.conditionnel@example.invalid" },
    insuranceSlug: "assurance-auto-moto",
    questions: [{ key: "deja_assure", label: "Êtes-vous déjà assuré pour ce véhicule ?" }],
    items: [
      { label: "Permis de conduire", required: true },
      { label: "Carte grise du véhicule", required: true },
      { label: "Relevé d'informations", required: true, conditionQuestion: "deja_assure", conditionEquals: "yes", instructions: "Exemple de pièce conditionnelle (démonstration)." },
    ],
  });
  note("G. Auto — pièce conditionnelle selon une question (démonstration) — Hugo Conditionnel", g.token);

  const out = path.join(dataDir(), "demo-links.txt");
  fs.writeFileSync(out, `LIENS DE DÉMONSTRATION (fictifs, locaux)\n\n${links.join("\n")}`, { mode: 0o600 });
  console.log(`✔ 7 dossiers de démonstration créés. Liens : ${out}`);
}

main().catch((e) => {
  console.error("Échec :", e);
  process.exit(1);
});
