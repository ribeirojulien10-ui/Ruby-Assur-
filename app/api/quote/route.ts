import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { products } from "@/lib/products";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "contact@rubyassur.fr";
const FROM = "Ruby Assur' <contact@rubyassur.fr>";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo
const MAX_FILES = 5;
const MAX_TEXT = 200;
const MAX_MESSAGE = 3000;
const ALLOWED_EXT = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];
const PHONE_RE = /^0[0-9]{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Les données utilisateur sont injectées dans un email HTML : on échappe tout.
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: NextRequest) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  // Honeypot : champ invisible rempli = robot → on répond OK sans rien traiter.
  if (str(fd, "website") !== "") {
    return NextResponse.json({ ok: true });
  }

  const firstName = str(fd, "firstName");
  const lastName = str(fd, "lastName");
  const phone = str(fd, "phone").replace(/[\s.\-]/g, "");
  const email = str(fd, "email");
  const insuranceRaw = str(fd, "insurance");
  const insurance = products.find(p => p.slug === insuranceRaw)?.name ?? insuranceRaw;
  const message = str(fd, "message");
  const fileEntries = fd.getAll("files").filter((f): f is File => f instanceof File);

  if (!firstName || !lastName || !phone || !email || !insuranceRaw) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }
  if (
    firstName.length > MAX_TEXT ||
    lastName.length > MAX_TEXT ||
    email.length > MAX_TEXT ||
    insurance.length > MAX_TEXT ||
    message.length > MAX_MESSAGE
  ) {
    return NextResponse.json({ error: "Champ trop long" }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "Téléphone invalide" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const nonEmptyFiles = fileEntries.filter(f => f.size > 0);
  if (nonEmptyFiles.length > MAX_FILES) {
    return NextResponse.json({ error: "Trop de fichiers" }, { status: 400 });
  }
  if (
    nonEmptyFiles.some(f => !ALLOWED_EXT.includes(f.name.split(".").pop()?.toLowerCase() ?? ""))
  ) {
    return NextResponse.json({ error: "Format de fichier non accepté" }, { status: 400 });
  }
  if (nonEmptyFiles.some(f => f.size > MAX_FILE_SIZE)) {
    return NextResponse.json({ error: "Fichier trop volumineux (10 Mo max)" }, { status: 413 });
  }

  const attachments = await Promise.all(
    nonEmptyFiles.map(async f => ({
      filename: f.name.replace(/[^\w.\- ()]/g, "_").slice(0, 120),
      content: Buffer.from(await f.arrayBuffer()),
    }))
  );

  // Évite l'injection d'en-têtes dans le sujet (retours à la ligne).
  const subjectSafe = `Nouvelle demande de devis — ${insurance} (${firstName} ${lastName})`.replace(/[\r\n]+/g, " ");

  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: subjectSafe,
    html: `
      <h2 style="color:#0A1A35">Nouvelle demande de devis</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
        <tr><td><strong>Prénom</strong></td><td>${esc(firstName)}</td></tr>
        <tr><td><strong>Nom</strong></td><td>${esc(lastName)}</td></tr>
        <tr><td><strong>Téléphone</strong></td><td>${esc(phone)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${esc(email)}</td></tr>
        <tr><td><strong>Assurance</strong></td><td>${esc(insurance)}</td></tr>
        ${message ? `<tr><td><strong>Message</strong></td><td>${esc(message).replace(/\n/g, "<br />")}</td></tr>` : ""}
        ${attachments.length > 0 ? `<tr><td><strong>Documents joints</strong></td><td>${attachments.map(a => esc(a.filename)).join(", ")}</td></tr>` : ""}
      </table>
    `,
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  if (error) {
    // Ne jamais journaliser les données du client : uniquement la nature de l'erreur.
    console.error("Resend error:", error.name, error.message);
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
