import type { ItemRow, ItemState, Question, RequestRow, RequestStatus } from "./types";

/** Règles métier PURES (sans accès base) : faciles à tester et sans effet de bord. */

export const ITEM_STATE_LABEL: Record<ItemState, string> = {
  to_provide: "À fournir",
  received: "Reçu",
  to_replace: "À remplacer",
  validated: "Validé",
};

export const STATUS_LABEL: Record<RequestStatus, string> = {
  incomplete: "Incomplet",
  complete: "Complet en pièces",
  to_review: "À vérifier",
  validated: "Validé",
  closed: "Terminé",
};

export const parseJson = <T,>(raw: string | null | undefined, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export type Answers = Record<string, "yes" | "no">;

/** Une pièce est applicable si elle n'a pas de condition, ou si la réponse à sa question correspond. */
export function isApplicable(item: Pick<ItemRow, "condition_question" | "condition_equals">, answers: Answers): boolean {
  if (!item.condition_question) return true;
  return answers[item.condition_question] === item.condition_equals;
}

export function applicableItems<T extends Pick<ItemRow, "condition_question" | "condition_equals">>(
  items: T[],
  answers: Answers,
): T[] {
  return items.filter((i) => isApplicable(i, answers));
}

/** Questions dont la réponse conditionne au moins une pièce et qui n'ont pas encore de réponse. */
export function unansweredQuestions(
  questions: Question[],
  items: Pick<ItemRow, "condition_question">[],
  answers: Answers,
): Question[] {
  return questions.filter((q) => items.some((i) => i.condition_question === q.key) && !answers[q.key]);
}

export interface Progress {
  requiredTotal: number;
  requiredDone: number; // reçues OU validées
  requiredValidated: number;
  optionalReceived: number;
  missing: ItemRow[]; // obligatoires à fournir
  toReplace: ItemRow[]; // à remplacer
  toReview: ItemRow[]; // reçues, en attente d'examen par Julien
  percent: number; // calculé, jamais simulé
}

export function computeProgress(items: ItemRow[], answers: Answers): Progress {
  const app = applicableItems(items, answers);
  const required = app.filter((i) => i.required);
  const done = required.filter((i) => i.state === "received" || i.state === "validated");
  const validated = required.filter((i) => i.state === "validated");
  return {
    requiredTotal: required.length,
    requiredDone: done.length,
    requiredValidated: validated.length,
    optionalReceived: app.filter((i) => !i.required && (i.state === "received" || i.state === "validated")).length,
    missing: required.filter((i) => i.state === "to_provide"),
    toReplace: app.filter((i) => i.state === "to_replace"),
    toReview: app.filter((i) => i.state === "received"),
    percent: required.length === 0 ? 0 : Math.round((done.length / required.length) * 100),
  };
}

/**
 * Statut du dossier, TOUJOURS dérivé de l'état réel des pièces (jamais stocké) :
 * il ne peut donc pas être désynchronisé du nombre de documents reçus.
 *
 *  - closed     : Julien a clôturé le dossier
 *  - incomplete : il manque au moins une pièce obligatoire, ou une pièce est à remplacer,
 *                 ou une question conditionnelle attend encore sa réponse
 *  - validated  : toutes les pièces obligatoires sont validées par Julien
 *  - to_review  : complet en pièces ET le client a confirmé son envoi
 *  - complete   : complet en pièces, en attente de la confirmation du client
 */
export function deriveStatus(
  req: Pick<RequestRow, "closed_at" | "submitted_at" | "questions" | "answers">,
  items: ItemRow[],
): RequestStatus {
  if (req.closed_at) return "closed";
  const answers = parseJson<Answers>(req.answers, {});
  const questions = parseJson<Question[]>(req.questions, []);
  const p = computeProgress(items, answers);
  const blocked = p.missing.length > 0 || p.toReplace.length > 0 || unansweredQuestions(questions, items, answers).length > 0;
  if (blocked) return "incomplete";
  if (p.requiredTotal > 0 && p.requiredValidated === p.requiredTotal) return "validated";
  return req.submitted_at ? "to_review" : "complete";
}

export function linkStateOf(
  req: Pick<RequestRow, "token_hash" | "revoked_at" | "expires_at">,
  now: Date,
): "active" | "expired" | "revoked" | "none" {
  if (!req.token_hash) return "none";
  if (req.revoked_at) return "revoked";
  if (req.expires_at && new Date(req.expires_at).getTime() <= now.getTime()) return "expired";
  return "active";
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? "";
}

export const slugifyKey = (label: string): string =>
  label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 40) || "question";
