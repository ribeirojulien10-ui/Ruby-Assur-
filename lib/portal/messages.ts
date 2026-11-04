import type { ItemRow } from "./types";

export interface ReminderInput {
  firstName: string;
  insuranceLabel: string;
  missing: ItemRow[];
  toReplace: ItemRow[];
  link: string | null; // null = lien à régénérer
}

const bullet = (s: string) => `• ${s}`;

/** Prépare un message de relance clair, copiable. Ne contient aucune donnée sensible hors le lien personnel. */
export function buildReminder(i: ReminderInput): { subject: string; text: string } {
  const lines: string[] = [];
  lines.push(i.firstName ? `Bonjour ${i.firstName},` : "Bonjour,");
  lines.push("");
  if (i.missing.length > 0) {
    lines.push(`Pour finaliser la constitution de votre dossier (${i.insuranceLabel}), il nous manque encore :`);
    for (const m of i.missing) lines.push(bullet(m.label));
  }
  if (i.toReplace.length > 0) {
    if (i.missing.length > 0) lines.push("");
    lines.push("Certains documents sont à remplacer :");
    for (const m of i.toReplace) {
      const why = m.reject_note ? ` — ${m.reject_note}` : "";
      lines.push(bullet(`${m.label}${why}`));
    }
  }
  lines.push("");
  lines.push(
    i.link
      ? `Vous pouvez transmettre ces documents directement via votre lien sécurisé : ${i.link}`
      : "Je vous envoie un nouveau lien sécurisé dans un instant pour transmettre ces documents.",
  );
  lines.push("");
  lines.push("Merci,");
  lines.push("L'équipe Ruby Assur'");
  return {
    subject: `Votre dossier Ruby Assur' — documents à transmettre`,
    text: lines.join("\n"),
  };
}

export const mailtoLink = (to: string | null, subject: string, body: string) =>
  `mailto:${to ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const whatsappLink = (phone: string | null, text: string) => {
  const digits = (phone ?? "").replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `33${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
};
