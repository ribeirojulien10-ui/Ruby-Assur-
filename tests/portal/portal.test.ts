import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  addItem,
  closeRequest,
  dashboard,
  deleteRequestPermanently,
  getActiveLink,
  getRequestDetail,
  listRequests,
  openFileForAdmin,
  prepareReminder,
  purgeClosedRequests,
  regenerateLink,
  reviewItem,
  revokeLink,
  setLinkExpiry,
  listTemplates,
} from "@/lib/portal/admin";
import {
  cleanupExpiredUploads,
  completeUpload,
  createUploadIntent,
  deleteClientFile,
  getClientView,
  receiveUpload,
  resolveToken,
  saveAnswers,
  submitRequest,
} from "@/lib/portal/client";
import { hashToken, newToken } from "@/lib/portal/ids";
import { rateLimit, resetRateLimits } from "@/lib/portal/ratelimit";
import { admin, cleanup, fakePdf, fakePng, itemsOf, makeCtx, newRequest, toStream, upload, type TestCtx } from "./helpers";

let ctx: TestCtx;
beforeEach(() => {
  ctx = makeCtx();
  resetRateLimits();
});
afterEach(() => cleanup(ctx));

const code = async (p: Promise<unknown> | (() => unknown)) => {
  try {
    await (typeof p === "function" ? p() : p);
    return "no-error";
  } catch (e) {
    return (e as { code?: string }).code ?? "other";
  }
};

describe("Liens clients", () => {
  it("un lien valide donne accès à la demande", () => {
    const { token } = newRequest(ctx);
    expect(resolveToken(ctx, token).state).toBe("ok");
    const v = getClientView(ctx, token);
    expect(v.firstName).toBe("Client");
    expect(v.items).toHaveLength(4);
  });

  it("un lien expiré est refusé", async () => {
    const { token } = newRequest(ctx, { linkTtlDays: 7 });
    ctx.advance(8 * 86_400_000);
    expect(resolveToken(ctx, token).state).toBe("expired");
    await expect(code(() => getClientView(ctx, token))).resolves.toBe("expired_link");
  });

  it("un lien révoqué est refusé", () => {
    const { id, token } = newRequest(ctx);
    revokeLink(ctx, admin, id);
    expect(resolveToken(ctx, token).state).toBe("revoked");
  });

  it("une demande inexistante ou un jeton mal formé est refusé (sans fuite d'information)", () => {
    expect(resolveToken(ctx, newToken()).state).toBe("invalid");
    expect(resolveToken(ctx, "abc").state).toBe("invalid");
    expect(resolveToken(ctx, "../../etc/passwd").state).toBe("invalid");
  });

  it("régénérer le lien invalide l'ancien", () => {
    const { id, token } = newRequest(ctx);
    const fresh = regenerateLink(ctx, admin, id);
    expect(resolveToken(ctx, token).state).toBe("invalid");
    expect(resolveToken(ctx, fresh).state).toBe("ok");
  });

  it("prolonger la durée réactive un lien expiré", () => {
    const { id, token } = newRequest(ctx, { linkTtlDays: 7 });
    ctx.advance(8 * 86_400_000);
    setLinkExpiry(ctx, admin, id, 30);
    expect(resolveToken(ctx, token).state).toBe("ok");
  });

  it("le jeton n'est jamais stocké en clair et n'est pas exposé à l'interface", () => {
    const { id, token } = newRequest(ctx);
    const row = ctx.db.prepare("SELECT token_hash, token_enc FROM requests WHERE id = ?").get(id) as { token_hash: string; token_enc: string };
    expect(row.token_hash).toBe(hashToken(token));
    expect(row.token_hash).not.toContain(token);
    expect(row.token_enc).not.toContain(token);
    expect(JSON.stringify(getRequestDetail(ctx, admin, id))).not.toContain(token);
    expect(getActiveLink(ctx, admin, id)).toBe(`http://test.local/documents/${token}`);
  });

  it("les jetons ont une entropie suffisante et sont uniques", () => {
    const set = new Set(Array.from({ length: 500 }, () => newToken()));
    expect(set.size).toBe(500);
    expect([...set][0]).toHaveLength(43);
  });
});

describe("Autorisations administrateur", () => {
  it("toute opération administrateur sans session est refusée", async () => {
    const { id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    expect(await code(() => listRequests(ctx, null))).toBe("unauthorized");
    expect(await code(() => dashboard(ctx, null))).toBe("unauthorized");
    expect(await code(() => getRequestDetail(ctx, null, id))).toBe("unauthorized");
    expect(await code(() => reviewItem(ctx, null, item.id, "validate"))).toBe("unauthorized");
    expect(await code(() => closeRequest(ctx, null, id))).toBe("unauthorized");
    expect(await code(() => regenerateLink(ctx, null, id))).toBe("unauthorized");
    expect(await code(() => openFileForAdmin(ctx, null, "x"))).toBe("unauthorized");
    expect(await code(() => listTemplates(ctx, null))).toBe("unauthorized");
    expect(await code(() => deleteRequestPermanently(ctx, null, id))).toBe("unauthorized");
    expect(await code(() => listRequests(ctx, { userId: "", email: "" }))).toBe("unauthorized");
  });
});

describe("Isolation entre clients", () => {
  it("un client ne peut pas utiliser son lien sur la pièce ou le fichier d'un autre client", async () => {
    const a = newRequest(ctx, { newClient: { fullName: "Client Fictif A" } });
    const b = newRequest(ctx, { newClient: { fullName: "Client Fictif B" } });
    const itemB = itemsOf(ctx, b.id)[0];
    // A tente d'envoyer sur une pièce de B
    expect(await code(() => createUploadIntent(ctx, a.token, { itemId: itemB.id, fileName: "x.pdf", size: 10 }))).toBe("not_found");
    // B dépose un fichier ; A tente de le supprimer
    await upload(ctx, b.token, itemB.id, "permis.pdf", fakePdf());
    const fileB = ctx.db.prepare("SELECT id FROM files WHERE request_id = ?").get(b.id) as { id: string };
    expect(await code(deleteClientFile(ctx, a.token, fileB.id))).toBe("not_found");
    // A ne voit que sa propre demande
    const view = getClientView(ctx, a.token);
    expect(view.items.every((i) => i.files.length === 0)).toBe(true);
    // L'état de B est intact
    expect(itemsOf(ctx, b.id)[0].state).toBe("received");
  });

  it("une autorisation de téléversement d'une demande ne sert pas pour une autre", async () => {
    const a = newRequest(ctx);
    const b = newRequest(ctx);
    const intent = createUploadIntent(ctx, a.token, { itemId: itemsOf(ctx, a.id)[0].id, fileName: "p.pdf", size: 20 });
    await receiveUpload(ctx, intent.uploadToken, toStream(Buffer.alloc(20, 65)));
    expect(await code(completeUpload(ctx, b.token, intent.uploadId))).toBe("not_found");
  });
});

describe("Fichiers", () => {
  it("refuse un format interdit dès l'intention", async () => {
    const { token, id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    await expect(code(() => createUploadIntent(ctx, token, { itemId: item.id, fileName: "virus.exe", size: 100 }))).resolves.toBe("forbidden_format");
    await expect(code(() => createUploadIntent(ctx, token, { itemId: item.id, fileName: "doc.docx", size: 100 }))).resolves.toBe("forbidden_format");
  });

  it("refuse un fichier dont le contenu ne correspond pas à l'extension (exécutable renommé en .pdf)", async () => {
    const { token, id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    const fake = Buffer.concat([Buffer.from("MZ"), Buffer.alloc(200, 1)]);
    expect(await code(upload(ctx, token, item.id, "permis.pdf", fake))).toBe("forbidden_format");
    expect(itemsOf(ctx, id)[0].state).toBe("to_provide");
    expect(fs.readdirSync(path.join(ctx.dir, "storage", "quarantine"))).toHaveLength(0);
  });

  it("refuse un PDF contenant des actions actives et la signature de test antivirus", async () => {
    const { token, id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    expect(await code(upload(ctx, token, item.id, "a.pdf", fakePdf("/JavaScript (app.alert(1))")))).toBe("infected");
    const eicar = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";
    expect(await code(upload(ctx, token, item.id, "b.pdf", fakePdf(eicar)))).toBe("infected");
  });

  it("refuse un fichier trop volumineux (déclaré)", async () => {
    const { token, id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    await expect(code(() => createUploadIntent(ctx, token, { itemId: item.id, fileName: "gros.pdf", size: 999 * 1024 * 1024 }))).resolves.toBe("too_large");
  });

  it("refuse un fichier plus gros que ce qui a été déclaré (envoi tronqué à la limite)", async () => {
    const { token, id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    const intent = createUploadIntent(ctx, token, { itemId: item.id, fileName: "p.pdf", size: 50 });
    expect(await code(receiveUpload(ctx, intent.uploadToken, toStream(fakePdf("x".repeat(500)))))).toBe("too_large");
    expect(fs.readdirSync(path.join(ctx.dir, "storage", "quarantine"))).toHaveLength(0);
  });

  it("gère un téléversement interrompu : rien n'est conservé et l'autorisation est brûlée", async () => {
    const { token, id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    const intent = createUploadIntent(ctx, token, { itemId: item.id, fileName: "p.pdf", size: 1000 });
    expect(await code(receiveUpload(ctx, intent.uploadToken, toStream(fakePdf())))).toBe("bad_upload"); // moins d'octets que déclaré
    expect(fs.readdirSync(path.join(ctx.dir, "storage", "quarantine"))).toHaveLength(0);
    expect(await code(receiveUpload(ctx, intent.uploadToken, toStream(Buffer.alloc(1000, 1))))).toBe("invalid_link"); // pas de réutilisation
    expect(itemsOf(ctx, id)[0].state).toBe("to_provide");
  });

  it("l'autorisation de téléversement est à usage unique et expire", async () => {
    const { token, id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    const content = fakePdf();
    const i1 = createUploadIntent(ctx, token, { itemId: item.id, fileName: "p.pdf", size: content.length });
    await receiveUpload(ctx, i1.uploadToken, toStream(content));
    expect(await code(receiveUpload(ctx, i1.uploadToken, toStream(content)))).toBe("invalid_link");
    const i2 = createUploadIntent(ctx, token, { itemId: item.id, fileName: "q.pdf", size: content.length });
    ctx.advance(16 * 60_000);
    expect(await code(receiveUpload(ctx, i2.uploadToken, toStream(content)))).toBe("expired_link");
    expect(await cleanupExpiredUploads(ctx)).toBeGreaterThanOrEqual(0);
  });

  it("limite le nombre de fichiers par pièce", async () => {
    const { token, id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    for (let i = 0; i < 4; i++) await upload(ctx, token, item.id, `p${i}.pdf`, fakePdf(String(i)));
    expect(await code(() => createUploadIntent(ctx, token, { itemId: item.id, fileName: "p5.pdf", size: 20 }))).toBe("too_many_files");
  });

  it("les noms de fichiers dangereux sont nettoyés", async () => {
    const { token, id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    await upload(ctx, token, item.id, "../../etc/<script>passwd?.pdf", fakePdf());
    const f = ctx.db.prepare("SELECT original_name, storage_key FROM files").get() as { original_name: string; storage_key: string };
    expect(f.original_name).not.toMatch(/[\\/<>?]/);
    expect(f.storage_key).toMatch(/^[0-9a-f-]{36}$/); // clé de stockage aléatoire, sans nom d'origine
  });

  it("les fichiers sont stockés hors de public/ avec des droits restreints", async () => {
    const { token, id } = newRequest(ctx);
    await upload(ctx, token, itemsOf(ctx, id)[0].id, "p.pdf", fakePdf());
    const f = ctx.db.prepare("SELECT storage_key FROM files").get() as { storage_key: string };
    const p = path.join(ctx.dir, "storage", "files", f.storage_key);
    expect(fs.existsSync(p)).toBe(true);
    expect(fs.statSync(p).mode & 0o077).toBe(0); // illisible par les autres utilisateurs du système
    expect(p).not.toContain(`${path.sep}public${path.sep}`);
  });
});

describe("Complétude, statuts et synchronisation", () => {
  it("dossier incomplet → complet en pièces, avec une progression calculée et non simulée", async () => {
    const { token, id } = newRequest(ctx);
    const items = itemsOf(ctx, id);
    expect(getRequestDetail(ctx, admin, id).status).toBe("incomplete");
    expect(getRequestDetail(ctx, admin, id).progress.percent).toBe(0);

    await upload(ctx, token, items[0].id, "permis.pdf", fakePdf("1"));
    await upload(ctx, token, items[1].id, "carte-grise.png", fakePng());
    let d = getRequestDetail(ctx, admin, id);
    expect(d.progress.requiredDone).toBe(2);
    expect(d.progress.requiredTotal).toBe(3);
    expect(d.progress.percent).toBe(67);
    expect(d.status).toBe("incomplete");
    expect(d.progress.missing.map((m) => m.label)).toEqual(["Relevé d'informations"]);

    await upload(ctx, token, items[2].id, "releve.pdf", fakePdf("3"));
    d = getRequestDetail(ctx, admin, id);
    expect(d.progress.percent).toBe(100);
    expect(d.status).toBe("complete"); // complet en pièces, pas encore confirmé par le client

    const filesInDb = (ctx.db.prepare("SELECT COUNT(*) c FROM files WHERE deleted_at IS NULL").get() as { c: number }).c;
    expect(filesInDb).toBe(3);
    expect(listRequests(ctx, admin)[0].received).toBe(3);
  });

  it("le client confirme son envoi (à vérifier) mais cela ne valide rien", async () => {
    const { token, id } = newRequest(ctx);
    const items = itemsOf(ctx, id);
    expect(await code(() => submitRequest(ctx, token))).toBe("conflict"); // incomplet : refusé
    for (const it of items.slice(0, 3)) await upload(ctx, token, it.id, `${it.id}.pdf`, fakePdf(it.id));
    expect(submitRequest(ctx, token)).toBe("to_review");
    expect(getRequestDetail(ctx, admin, id).status).toBe("to_review");
    expect(getRequestDetail(ctx, admin, id).items.some((i) => i.state === "validated")).toBe(false);
  });

  it("une notification de complétude n'est préparée qu'une seule fois (aucun e-mail envoyé)", async () => {
    const { token, id } = newRequest(ctx);
    const items = itemsOf(ctx, id);
    for (const it of items.slice(0, 3)) await upload(ctx, token, it.id, `${it.id}.pdf`, fakePdf(it.id));
    await upload(ctx, token, items[3].id, "rib.pdf", fakePdf("rib"));
    const rows = ctx.db.prepare("SELECT kind, request_ref, sent_at FROM outbox").all() as { kind: string; request_ref: string; sent_at: string | null }[];
    expect(rows).toHaveLength(1);
    expect(rows[0].sent_at).toBeNull();
    expect(JSON.stringify(rows)).not.toMatch(/permis|Client Fictif|@/); // aucune donnée sensible
  });

  it("validation : tout validé → dossier validé ; un refus remet le dossier en incomplet", async () => {
    const { token, id } = newRequest(ctx);
    const items = itemsOf(ctx, id).slice(0, 3);
    for (const it of items) await upload(ctx, token, it.id, `${it.id}.pdf`, fakePdf(it.id));
    submitRequest(ctx, token);

    reviewItem(ctx, admin, items[0].id, "validate");
    reviewItem(ctx, admin, items[1].id, "validate");
    reviewItem(ctx, admin, items[2].id, "replace", { reason: "illisible", note: "Photo floue" });
    let d = getRequestDetail(ctx, admin, id);
    expect(d.status).toBe("incomplete");
    expect(d.request.submitted_at).toBeNull(); // le client doit reconfirmer
    expect(d.progress.toReplace.map((i) => i.label)).toEqual(["Relevé d'informations"]);
    // Le client voit exactement ce qu'il doit remplacer
    const view = getClientView(ctx, token);
    const flagged = view.items.filter((i) => i.state === "to_replace");
    expect(flagged).toHaveLength(1);
    expect(flagged[0].rejectNote).toBe("Photo floue");

    await upload(ctx, token, items[2].id, "releve-net.pdf", fakePdf("net"));
    submitRequest(ctx, token);
    reviewItem(ctx, admin, items[2].id, "validate");
    d = getRequestDetail(ctx, admin, id);
    expect(d.status).toBe("validated");
    expect(d.progress.requiredValidated).toBe(3);
  });

  it("remplacement : l'ancien fichier est supprimé physiquement et l'historique le trace", async () => {
    const { token, id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    await upload(ctx, token, item.id, "ancien.pdf", fakePdf("ancien"));
    const old = ctx.db.prepare("SELECT storage_key FROM files").get() as { storage_key: string };
    reviewItem(ctx, admin, item.id, "replace", { reason: "mauvais_document" });
    await upload(ctx, token, item.id, "nouveau.pdf", fakePdf("nouveau"));
    expect(fs.existsSync(path.join(ctx.dir, "storage", "files", old.storage_key))).toBe(false);
    const live = ctx.db.prepare("SELECT original_name FROM files WHERE deleted_at IS NULL").all() as { original_name: string }[];
    expect(live.map((f) => f.original_name)).toEqual(["nouveau.pdf"]);
    expect(itemsOf(ctx, id)[0].state).toBe("received");
    const types = getRequestDetail(ctx, admin, id).events.map((e) => e.type);
    expect(types).toContain("file_replaced");
    expect(types).toContain("item_to_replace");
  });

  it("une pièce validée ne peut plus être modifiée par le client", async () => {
    const { token, id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    await upload(ctx, token, item.id, "p.pdf", fakePdf());
    reviewItem(ctx, admin, item.id, "validate");
    expect(await code(() => createUploadIntent(ctx, token, { itemId: item.id, fileName: "x.pdf", size: 20 }))).toBe("conflict");
    const f = ctx.db.prepare("SELECT id FROM files").get() as { id: string };
    expect(await code(deleteClientFile(ctx, token, f.id))).toBe("conflict");
  });

  it("le client supprime son fichier : la pièce redevient à fournir", async () => {
    const { token, id } = newRequest(ctx);
    const item = itemsOf(ctx, id)[0];
    await upload(ctx, token, item.id, "p.pdf", fakePdf());
    const f = ctx.db.prepare("SELECT id, storage_key FROM files").get() as { id: string; storage_key: string };
    await deleteClientFile(ctx, token, f.id);
    expect(itemsOf(ctx, id)[0].state).toBe("to_provide");
    expect(fs.existsSync(path.join(ctx.dir, "storage", "files", f.storage_key))).toBe(false);
  });

  it("enregistrement progressif : le client revient plus tard sans tout recommencer", async () => {
    const { token, id } = newRequest(ctx);
    const items = itemsOf(ctx, id);
    await upload(ctx, token, items[0].id, "p.pdf", fakePdf());
    ctx.advance(24 * 3600_000);
    const v = getClientView(ctx, token);
    expect(v.items[0].state).toBe("received");
    expect(v.items[0].files[0].name).toBe("p.pdf");
    expect(v.progress.requiredDone).toBe(1);
  });
});

describe("Questions conditionnelles", () => {
  const conditional = {
    questions: [{ key: "deja_assure", label: "Êtes-vous déjà assuré pour ce véhicule ?" }],
    items: [
      { label: "Permis", required: true },
      { label: "Relevé d'informations", required: true, conditionQuestion: "deja_assure", conditionEquals: "yes" as const },
    ],
  };

  it("une pièce conditionnelle n'est demandée que selon la réponse", async () => {
    const { token, id } = newRequest(ctx, conditional);
    const items = itemsOf(ctx, id);
    expect(getClientView(ctx, token).items.map((i) => i.label)).toEqual(["Permis"]); // pièce masquée tant que non répondu
    await upload(ctx, token, items[0].id, "p.pdf", fakePdf());
    expect(getRequestDetail(ctx, admin, id).status).toBe("incomplete"); // question sans réponse

    saveAnswers(ctx, token, { deja_assure: "no" });
    expect(getClientView(ctx, token).items.map((i) => i.label)).toEqual(["Permis"]);
    expect(getRequestDetail(ctx, admin, id).status).toBe("complete");

    saveAnswers(ctx, token, { deja_assure: "yes" });
    expect(getClientView(ctx, token).items.map((i) => i.label)).toEqual(["Permis", "Relevé d'informations"]);
    expect(getRequestDetail(ctx, admin, id).status).toBe("incomplete");
    // pièce masquée : impossible d'y téléverser
    saveAnswers(ctx, token, { deja_assure: "no" });
    expect(await code(() => createUploadIntent(ctx, token, { itemId: items[1].id, fileName: "r.pdf", size: 20 }))).toBe("not_found");
  });

  it("ignore les clés de réponse inconnues", () => {
    const { token } = newRequest(ctx, conditional);
    saveAnswers(ctx, token, { pirate: "yes", deja_assure: "peut-etre" });
    expect(getClientView(ctx, token).answers).toEqual({});
  });
});

describe("Clôture, relances et suppression", () => {
  it("une demande clôturée n'accepte plus de fichiers", async () => {
    const { token, id } = newRequest(ctx);
    closeRequest(ctx, admin, id);
    expect(resolveToken(ctx, token).state).toBe("closed");
    expect(getRequestDetail(ctx, admin, id).status).toBe("closed");
    expect(await code(() => createUploadIntent(ctx, token, { itemId: itemsOf(ctx, id)[0].id, fileName: "p.pdf", size: 20 }))).toBe("closed");
  });

  it("le message de relance liste uniquement ce qui manque ou est à remplacer", async () => {
    const { token, id } = newRequest(ctx);
    const items = itemsOf(ctx, id);
    await upload(ctx, token, items[0].id, "p.pdf", fakePdf());
    await upload(ctx, token, items[1].id, "c.pdf", fakePdf("c"));
    reviewItem(ctx, admin, items[1].id, "replace", { reason: "illisible", note: "Photo floue" });
    const r = prepareReminder(ctx, admin, id);
    expect(r.text).toContain("Relevé d'informations");
    expect(r.text).toContain("Carte grise — Photo floue");
    expect(r.text).not.toContain("Permis");
    expect(r.text).toContain(`http://test.local/documents/${token}`);
    expect(r.mailto).toContain("mailto:un@example.invalid");
  });

  it("la suppression définitive efface fichiers et données et ne garde qu'une trace anonyme", async () => {
    const { token, id } = newRequest(ctx);
    await upload(ctx, token, itemsOf(ctx, id)[0].id, "p.pdf", fakePdf());
    const f = ctx.db.prepare("SELECT storage_key FROM files").get() as { storage_key: string };
    await deleteRequestPermanently(ctx, admin, id);
    expect(fs.existsSync(path.join(ctx.dir, "storage", "files", f.storage_key))).toBe(false);
    expect(ctx.db.prepare("SELECT COUNT(*) c FROM requests").get()).toEqual({ c: 0 });
    expect(ctx.db.prepare("SELECT COUNT(*) c FROM files").get()).toEqual({ c: 0 });
    const audit = ctx.db.prepare("SELECT action, request_ref FROM audit_log").all() as { action: string; request_ref: string }[];
    expect(audit).toHaveLength(1);
    expect(audit[0].action).toBe("request_deleted");
  });

  it("la purge ne supprime que les dossiers clôturés depuis plus longtemps que la durée donnée", async () => {
    const a = newRequest(ctx);
    const b = newRequest(ctx);
    const c = newRequest(ctx);
    closeRequest(ctx, admin, a.id);
    ctx.advance(40 * 86_400_000);
    closeRequest(ctx, admin, b.id); // clôturé récemment
    expect(await purgeClosedRequests(ctx, admin, 30)).toBe(1);
    const left = (ctx.db.prepare("SELECT id FROM requests").all() as { id: string }[]).map((r) => r.id).sort();
    expect(left).toEqual([b.id, c.id].sort());
  });

  it("téléchargement : réservé à l'administrateur, uniquement les fichiers sains, et tracé", async () => {
    const { token, id } = newRequest(ctx);
    await upload(ctx, token, itemsOf(ctx, id)[0].id, "p.pdf", fakePdf("contenu"));
    const f = ctx.db.prepare("SELECT id FROM files").get() as { id: string };
    const opened = await openFileForAdmin(ctx, admin, f.id);
    expect(opened.name).toBe("p.pdf");
    expect(opened.type).toBe("pdf");
    expect(getRequestDetail(ctx, admin, id).events.map((e) => e.type)).toContain("file_downloaded");
    expect(await code(openFileForAdmin(ctx, admin, "00000000-0000-0000-0000-000000000000"))).toBe("not_found");
  });

  it("Julien peut ajouter une pièce à un dossier existant ; le client doit alors reconfirmer", async () => {
    const { token, id } = newRequest(ctx);
    const items = itemsOf(ctx, id);
    for (const it of items.slice(0, 3)) await upload(ctx, token, it.id, `${it.id}.pdf`, fakePdf(it.id));
    submitRequest(ctx, token);
    addItem(ctx, admin, id, { label: "Justificatif de domicile", required: true });
    const d = getRequestDetail(ctx, admin, id);
    expect(d.status).toBe("incomplete");
    expect(d.progress.missing.map((m) => m.label)).toEqual(["Justificatif de domicile"]);
  });
});

describe("Limiteur de débit", () => {
  it("bloque après le seuil puis libère après la fenêtre", () => {
    for (let i = 0; i < 3; i++) expect(rateLimit("k", 3, 1000, 1000)).toBe(true);
    expect(rateLimit("k", 3, 1000, 1500)).toBe(false);
    expect(rateLimit("k", 3, 1000, 2500)).toBe(true);
  });
});

describe("Modèles de documents initiaux", () => {
  it("reprennent la liste de Julien et pointent tous vers une assurance existante", async () => {
    const { DEFAULT_TEMPLATES } = await import("@/lib/portal/default-templates");
    const { getProductBySlug } = await import("@/lib/products");
    for (const t of DEFAULT_TEMPLATES) {
      expect(getProductBySlug(t.insuranceSlug), t.name).toBeTruthy();
      expect(t.items.length, t.name).toBeGreaterThan(0);
    }
    const names = DEFAULT_TEMPLATES.map((t) => t.name);
    for (const n of ["Auto", "Moto", "Habitation", "Propriétaire non occupant (PNO)", "Mutuelle santé", "Prévoyance", "Multirisque professionnelle", "Responsabilité civile professionnelle", "Emprunteur", "Animaux", "Protection juridique"])
      expect(names).toContain(n);
    const labels = (n: string) => DEFAULT_TEMPLATES.find((t) => t.name === n)!.items.map((i) => i.label);
    expect(labels("Auto")).toEqual(["Carte grise", "Permis de conduire", "Relevé d'information", "Pièce d'identité", "RIB"]);
    expect(labels("Moto")).toContain("Permis A / A2 (ou justificatif de formation)");
    expect(labels("Emprunteur")).toEqual(expect.arrayContaining(["Offre de prêt", "Tableau d'amortissement", "Justificatif de revenus"]));
  });

  it("le remplacement des modèles initiaux conserve les modèles personnels de Julien", async () => {
    const { ensureDefaultTemplates, resetDefaultTemplates, saveTemplate, listTemplates } = await import("@/lib/portal/admin");
    ensureDefaultTemplates(ctx);
    saveTemplate(ctx, admin, { insuranceSlug: "rc-pro", name: "Mon modèle perso", items: [{ label: "Un document", required: true }] });
    resetDefaultTemplates(ctx);
    const all = listTemplates(ctx, admin);
    expect(all.some((t) => t.name === "Mon modèle perso" && !t.isDefault)).toBe(true);
    expect(all.filter((t) => t.isDefault).length).toBeGreaterThanOrEqual(14);
    expect(all.filter((t) => t.isDefault && t.name === "Auto")).toHaveLength(1); // pas de doublon
  });
});
