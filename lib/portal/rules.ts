import type { InfoField, ItemRow, Person, ItemState, Question, RequestRow, RequestStatus } from "./types";

/** Règles métier PURES (sans accès base) : faciles à tester et sans effet de bord. */

export const ITEM_STATE_LABEL: Record<ItemState, string> = {
  to_provide: "À fournir",
  received: "Reçu",
  to_replace: "À remplacer",
  validated: "Validé",
};

// Vocabulaire volontairement sans « complet » : en début de processus (étude / devis), un dossier n'est jamais
// « complet » ; on distingue seulement ce qui attend le client, ce qui est en cours et ce que Julien doit examiner.
export const STATUS_LABEL: Record<RequestStatus, string> = {
  incomplete: "En attente du client",
  complete: "En cours",
  to_review: "À examiner",
  validated: "Pièces validées",
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

/** Questions « oui/non » dont la réponse conditionne au moins une pièce et qui n'ont pas encore de réponse.
 *  Les cases à cocher n'en font pas partie : décochées, elles valent « non ». */
export function unansweredQuestions(
  questions: Question[],
  items: Pick<ItemRow, "condition_question">[],
  answers: Answers,
): Question[] {
  return questions.filter(
    (q) => q.type !== "checkbox" && items.some((i) => i.condition_question === q.key) && !answers[q.key],
  );
}

/** Réponses effectives : les cases à cocher non cochées valent « non ». */
export function answersOf(req: Pick<RequestRow, "questions" | "answers">): Answers {
  const questions = parseJson<Question[]>(req.questions, []);
  const saved = parseJson<Answers>(req.answers, {});
  const out: Answers = {};
  for (const q of questions) if (q.type === "checkbox") out[q.key] = "no";
  return { ...out, ...saved };
}

export type Info = Record<string, string>;

/** Lit la valeur d'un champ « personnes » (JSON) ; toute valeur invalide donne une liste vide. */
export function parsePersons(raw: string | undefined): Person[] {
  const v = parseJson<unknown>(raw, []);
  return Array.isArray(v)
    ? v
        .filter((p): p is Person => !!p && typeof (p as Person).name === "string")
        .map((p) => ({ name: p.name, birth: typeof p.birth === "string" ? p.birth : "" }))
    : [];
}

/** Champs réellement applicables : ceux dont la condition (case cochée / réponse) est remplie. */
export function visibleFields(fields: InfoField[], answers: Answers): InfoField[] {
  return fields.filter((f) => !f.condition || answers[f.condition.question] === f.condition.equals);
}

/** Une liste de personnes est complète si elle contient au moins une personne nommée (et, si demandé, une date de naissance pour chacune). */
function personsComplete(raw: string | undefined, birthRequired: boolean): boolean {
  const list = parsePersons(raw);
  return list.length > 0 && list.every((p) => p.name.trim() && (!birthRequired || p.birth));
}

const isFilled = (f: InfoField, info: Info): boolean =>
  f.type === "persons" ? personsComplete(info[f.key], !!f.birthRequired) : !!(info[f.key] ?? "").trim();

/** Informations OBLIGATOIRES encore vides (parmi les champs applicables). */
export function missingInfo(fields: InfoField[], info: Info, answers: Answers = {}): InfoField[] {
  return visibleFields(fields, answers).filter((f) => f.required && !isFilled(f, info));
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
 *  - to_review  : pièces reçues ET le client a confirmé son envoi (« À examiner »)
 *  - complete   : pièces demandées reçues, en attente de la confirmation du client (« En cours »)
 */
export function deriveStatus(
  req: Pick<RequestRow, "closed_at" | "submitted_at" | "questions" | "answers"> & Partial<Pick<RequestRow, "fields" | "info">>,
  items: ItemRow[],
): RequestStatus {
  if (req.closed_at) return "closed";
  const answers = answersOf(req);
  const questions = parseJson<Question[]>(req.questions, []);
  const p = computeProgress(items, answers);
  const infoMissing = missingInfo(parseJson<InfoField[]>(req.fields, []), parseJson<Info>(req.info, {}), answers);
  const blocked =
    p.missing.length > 0 ||
    p.toReplace.length > 0 ||
    infoMissing.length > 0 ||
    unansweredQuestions(questions, items, answers).length > 0;
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
