import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "contact@rubyassur.fr";
const FROM = "Ruby Assur' <contact@rubyassur.fr>";

export async function POST(req: NextRequest) {
  const { firstName, lastName, phone, email, insurance, message } = await req.json();

  if (!firstName || !lastName || !phone || !email || !insurance) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `Nouvelle demande de devis — ${insurance} (${firstName} ${lastName})`,
    html: `
      <h2>Nouvelle demande de devis</h2>
      <table>
        <tr><td><strong>Prénom</strong></td><td>${firstName}</td></tr>
        <tr><td><strong>Nom</strong></td><td>${lastName}</td></tr>
        <tr><td><strong>Téléphone</strong></td><td>${phone}</td></tr>
        <tr><td><strong>Email</strong></td><td>${email}</td></tr>
        <tr><td><strong>Assurance</strong></td><td>${insurance}</td></tr>
        ${message ? `<tr><td><strong>Message</strong></td><td>${message}</td></tr>` : ""}
      </table>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
