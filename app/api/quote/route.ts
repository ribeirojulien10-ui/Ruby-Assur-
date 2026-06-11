import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "contact@rubyassur.fr";
const FROM = "Ruby Assur' <contact@rubyassur.fr>";

export async function POST(req: NextRequest) {
  const fd = await req.formData();

  const firstName = fd.get("firstName") as string;
  const lastName = fd.get("lastName") as string;
  const phone = fd.get("phone") as string;
  const email = fd.get("email") as string;
  const insurance = fd.get("insurance") as string;
  const message = fd.get("message") as string;
  const fileEntries = fd.getAll("files") as File[];

  if (!firstName || !lastName || !phone || !email || !insurance) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const attachments = await Promise.all(
    fileEntries
      .filter(f => f.size > 0)
      .map(async f => ({
        filename: f.name,
        content: Buffer.from(await f.arrayBuffer()),
      }))
  );

  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `Nouvelle demande de devis — ${insurance} (${firstName} ${lastName})`,
    html: `
      <h2 style="color:#0A1A35">Nouvelle demande de devis</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
        <tr><td><strong>Prénom</strong></td><td>${firstName}</td></tr>
        <tr><td><strong>Nom</strong></td><td>${lastName}</td></tr>
        <tr><td><strong>Téléphone</strong></td><td>${phone}</td></tr>
        <tr><td><strong>Email</strong></td><td>${email}</td></tr>
        <tr><td><strong>Assurance</strong></td><td>${insurance}</td></tr>
        ${message ? `<tr><td><strong>Message</strong></td><td>${message}</td></tr>` : ""}
        ${attachments.length > 0 ? `<tr><td><strong>Documents joints</strong></td><td>${attachments.map(a => a.filename).join(", ")}</td></tr>` : ""}
      </table>
    `,
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
