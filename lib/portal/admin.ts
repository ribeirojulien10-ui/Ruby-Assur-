import { getProductBySlug } from "@/lib/products";
import { ALL_FORMATS, DEFAULT_FORMATS, LIMITS, type FileFormat } from "./config";
import {
  deleteFileRecord,
  getFiles,
  getItem,
  getItems,
  getRequest,
  iso,
  logEvent,
  queueNotification,
  touch,
  type PortalContext,
} from "./context";
import { all, get, run, tx } from "./db";
import { DEFAULT_TEMPLATES } from "./default-templates";
import { hashToken, newId, newToken } from "./ids";
import { buildReminder, mailtoLink, whatsappLink } from "./messages";
import {
  computeProgress,
  deriveStatus,
  linkStateOf,
  parseJson,
  firstName,
  slugifyKey,
  answersOf,
  missingInfo,
  type Answers,
  type Info,
} from "./rules";
import { decryptToken, encryptToken } from "./secret";
import {
  assertAdmin,
  PortalError,
  type AdminSession,
  type ClientRow,
  type EventRow,
  type FileRow,
  type InfoField,
  type ItemRow,
  type Question,
  type RequestRow,
  type RequestStatus,
} from "./types";

/**
 * Opérations réservées à Julien. Chaque fonction EXIGE une session administrateur
 * (`assertAdmin`) : l'autorisation est vérifiée côté serveur à chaque opération,
 * pas seulement à l'affichage de la page.
 */

// ───────────────────────── Modèles de checklists ─────────────────────────

export interface TemplateItemInput {
  label: string;
  instructions?: string;
  required: boolean;
  formats?: string[];
  maxMb?: number | null;
  conditionQuestion?: string | null;
  conditionEquals?: "yes" | "no" | null;
}
export interface TemplateInput {
  id?: string;
  insuranceSlug: string;
  name: string;
  description?: string;
  instructions?: string;
  questions?: Question[];
  fields?: InfoField[];
  items: TemplateItemInput[];
}
export interface TemplateView extends TemplateInput {
  id: string;
  isDefault: boolean;
  items: (TemplateItemInput & { id: string })[];
}

const cleanFormats = (f?: string[]): string[] => {
  const ok = (f && f.length ? f : DEFAULT_FORMATS).map((x) => x.toLowerCase()).filter((x): x is FileFormat => (ALL_FORMATS as readonly string[]).includes(x));
  return ok.length ? Array.from(new Set(ok)) : [...DEFAULT_FORMATS];
};

function insertDefaultTemplates(ctx: PortalContext) {
  DEFAULT_TEMPLATES.forEach((t, ti) => {
    const id = newId();
    run(ctx.db, "INSERT INTO templates(id, insurance_slug, name, description, instructions, questions, fields, is_default, sort, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
      id, t.insuranceSlug, t.name, t.description, t.instructions ?? null, JSON.stringify(cleanQuestions(t.questions)), JSON.stringify(cleanFields(t.fields)), 1, ti, iso(ctx));
    t.items.forEach((it, i) => {
      run(ctx.db, "INSERT INTO template_items(id, template_id, label, instructions, required, sort, allowed_formats, condition_question, condition_equals) VALUES (?,?,?,?,?,?,?,?,?)",
        newId(), id, it.label, it.instructions ?? null, it.required ? 1 : 0, i, cleanFormats(it.formats).join(","),
        it.conditionQuestion ?? null, it.conditionQuestion ? (it.conditionEquals ?? "yes") : null);
    });
  });
}

export function ensureDefaultTemplates(ctx: PortalContext) {
  const count = get<{ c: number }>(ctx.db, "SELECT COUNT(*) AS c FROM templates")?.c ?? 0;
  if (count > 0) return;
  tx(ctx.db, () => insertDefaultTemplates(ctx));
}

/**
 * Remplace les modèles INITIAUX par la version courante de default-templates.ts.
 * Les modèles créés ou dupliqués par Julien (is_default = 0) et les demandes déjà créées ne sont pas touchés.
 */
export function resetDefaultTemplates(ctx: PortalContext) {
  tx(ctx.db, () => {
    run(ctx.db, "DELETE FROM templates WHERE is_default = 1");
    insertDefaultTemplates(ctx);
  });
}

export function listTemplates(ctx: PortalContext, admin: AdminSession | null): TemplateView[] {
  assertAdmin(admin);
  ensureDefaultTemplates(ctx);
  const ts = all<{ id: string; insurance_slug: string; name: string; description: string | null; instructions: string | null; questions: string; fields: string; is_default: number }>(
    ctx.db, "SELECT * FROM templates ORDER BY sort, name");
  return ts.map((t) => ({
    id: t.id,
    insuranceSlug: t.insurance_slug,
    name: t.name,
    description: t.description ?? "",
    instructions: t.instructions ?? "",
    questions: parseJson<Question[]>(t.questions, []),
    fields: parseJson<InfoField[]>((t as { fields?: string }).fields, []),
    isDefault: !!t.is_default,
    items: all<{ id: string; label: string; instructions: string | null; required: number; allowed_formats: string; max_mb: number | null; condition_question: string | null; condition_equals: string | null }>(
      ctx.db, "SELECT * FROM template_items WHERE template_id = ? ORDER BY sort, rowid", t.id).map((i) => ({
      id: i.id,
      label: i.label,
      instructions: i.instructions ?? "",
      required: !!i.required,
      formats: i.allowed_formats.split(","),
      maxMb: i.max_mb,
      conditionQuestion: i.condition_question,
      conditionEquals: (i.condition_equals as "yes" | "no" | null) ?? null,
    })),
  }));
}

const FIELD_TYPES = ["text", "textarea", "number", "date", "tel", "email", "choice"] as const;
function cleanFields(fields?: InfoField[]): InfoField[] {
  const seen = new Set<string>();
  return (fields ?? [])
    .filter((f) => f.label?.trim())
    .map((f) => {
      let key = f.key || slugifyKey(f.label);
      while (seen.has(key)) key += "_2";
      seen.add(key);
      const type = (FIELD_TYPES as readonly string[]).includes(f.type) ? f.type : "text";
      return {
        key,
        label: f.label.trim().slice(0, 160),
        type,
        ...(type === "choice" ? { options: (f.options ?? []).map((o) => o.trim()).filter(Boolean).slice(0, 12) } : {}),
        ...(f.unit ? { unit: f.unit.slice(0, 12) } : {}),
        ...(f.required ? { required: true } : {}),
        ...(f.hint ? { hint: f.hint.slice(0, 200) } : {}),
      } as InfoField;
    });
}
const cleanQuestions = (qs?: Question[]): Question[] =>
  (qs ?? []).filter((q) => q.label.trim()).map((q) => ({ key: q.key || slugifyKey(q.label), label: q.label.trim(), type: q.type === "checkbox" ? "checkbox" : "yesno" }));

function validateItems(items: TemplateItemInput[], questions: Question[]) {
  if (!items.length) throw new PortalError("invalid_input", "Au moins une pièce est nécessaire.");
  const keys = new Set(questions.map((q) => q.key));
  for (const it of items) {
    if (!it.label?.trim()) throw new PortalError("invalid_input", "Chaque pièce doit avoir un nom.");
    if (it.label.length > 160) throw new PortalError("invalid_input", "Nom de pièce trop long.");
    if (it.conditionQuestion && !keys.has(it.conditionQuestion)) throw new PortalError("invalid_input", "Condition inconnue.");
  }
}

export function saveTemplate(ctx: PortalContext, admin: AdminSession | null, input: TemplateInput): string {
  assertAdmin(admin);
  if (!getProductBySlug(input.insuranceSlug)) throw new PortalError("invalid_input", "Assurance inconnue.");
  if (!input.name?.trim()) throw new PortalError("invalid_input", "Nom du modèle requis.");
  const questions = cleanQuestions(input.questions);
  const fields = cleanFields(input.fields);
  validateItems(input.items, questions);
  return tx(ctx.db, () => {
    const id = input.id ?? newId();
    if (input.id) {
      run(ctx.db, "UPDATE templates SET insurance_slug=?, name=?, description=?, instructions=?, questions=?, fields=?, updated_at=? WHERE id=?",
        input.insuranceSlug, input.name.trim(), input.description ?? null, input.instructions ?? null, JSON.stringify(questions), JSON.stringify(fields), iso(ctx), id);
      run(ctx.db, "DELETE FROM template_items WHERE template_id = ?", id);
    } else {
      run(ctx.db, "INSERT INTO templates(id, insurance_slug, name, description, instructions, questions, fields, is_default, sort, updated_at) VALUES (?,?,?,?,?,?,?,0,999,?)",
        id, input.insuranceSlug, input.name.trim(), input.description ?? null, input.instructions ?? null, JSON.stringify(questions), JSON.stringify(fields), iso(ctx));
    }
    input.items.forEach((it, i) =>
      run(ctx.db, "INSERT INTO template_items(id, template_id, label, instructions, required, sort, allowed_formats, max_mb, condition_question, condition_equals) VALUES (?,?,?,?,?,?,?,?,?,?)",
        newId(), id, it.label.trim(), it.instructions?.trim() || null, it.required ? 1 : 0, i, cleanFormats(it.formats).join(","),
        it.maxMb ?? null, it.conditionQuestion || null, it.conditionQuestion ? (it.conditionEquals ?? "yes") : null),
    );
    return id;
  });
}

export function deleteTemplate(ctx: PortalContext, admin: AdminSession | null, id: string) {
  assertAdmin(admin);
  run(ctx.db, "DELETE FROM templates WHERE id = ?", id);
}

// ───────────────────────── Clients ─────────────────────────

export function createClient(
  ctx: PortalContext,
  admin: AdminSession | null,
  input: { fullName: string; email?: string; phone?: string; isDemo?: boolean },
): string {
  assertAdmin(admin);
  const name = input.fullName?.trim();
  if (!name || name.length > 120) throw new PortalError("invalid_input", "Nom du client requis.");
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new PortalError("invalid_input", "E-mail invalide.");
  const id = newId();
  run(ctx.db, "INSERT INTO clients(id, full_name, email, phone, is_demo, created_at) VALUES (?,?,?,?,?,?)",
    id, name, input.email?.trim() || null, input.phone?.trim() || null, input.isDemo ? 1 : 0, iso(ctx));
  return id;
}

export function listClients(ctx: PortalContext, admin: AdminSession | null): ClientRow[] {
  assertAdmin(admin);
  return all<ClientRow>(ctx.db, "SELECT * FROM clients ORDER BY full_name COLLATE NOCASE");
}

// ───────────────────────── Demandes ─────────────────────────

export interface CreateRequestInput {
  clientId?: string;
  newClient?: { fullName: string; email?: string; phone?: string };
  insuranceSlug: string;
  title?: string;
  instructions?: string;
  items: TemplateItemInput[];
  questions?: Question[];
  fields?: InfoField[];
  linkTtlDays?: number;
  isDemo?: boolean;
}

function issueToken(ctx: PortalContext, requestId: string, ttlDays: number): string {
  const token = newToken();
  const expires = new Date(ctx.now().getTime() + ttlDays * 86_400_000).toISOString();
  run(ctx.db,
    "UPDATE requests SET token_hash=?, token_enc=?, token_issued_at=?, expires_at=?, revoked_at=NULL WHERE id=?",
    hashToken(token), encryptToken(token), iso(ctx), expires, requestId);
  return token;
}

export function createRequest(ctx: PortalContext, admin: AdminSession | null, input: CreateRequestInput): { id: string; token: string } {
  assertAdmin(admin);
  const product = getProductBySlug(input.insuranceSlug);
  if (!product) throw new PortalError("invalid_input", "Assurance inconnue.");
  const questions = cleanQuestions(input.questions);
  const fields = cleanFields(input.fields);
  validateItems(input.items, questions);
  const ttl = input.linkTtlDays ?? LIMITS.defaultLinkTtlDays;
  if (!(ttl >= 1 && ttl <= 365)) throw new PortalError("invalid_input", "Durée de validité invalide.");

  const clientId = input.clientId ?? (input.newClient ? createClient(ctx, admin, { ...input.newClient, isDemo: input.isDemo }) : null);
  if (!clientId) throw new PortalError("invalid_input", "Client requis.");
  if (!get(ctx.db, "SELECT id FROM clients WHERE id = ?", clientId)) throw new PortalError("not_found", "Client introuvable.");

  return tx(ctx.db, () => {
    const id = newId();
    const t = iso(ctx);
    run(ctx.db,
      "INSERT INTO requests(id, client_id, insurance_slug, title, instructions, questions, answers, fields, info, is_demo, created_at, updated_at, last_activity_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
      id, clientId, input.insuranceSlug, input.title?.trim() || product.name, input.instructions?.trim() || null,
      JSON.stringify(questions), "{}", JSON.stringify(fields), "{}", input.isDemo ? 1 : 0, t, t, t);
    input.items.forEach((it, i) =>
      run(ctx.db,
        "INSERT INTO request_items(id, request_id, label, instructions, required, sort, allowed_formats, max_bytes, condition_question, condition_equals) VALUES (?,?,?,?,?,?,?,?,?,?)",
        newId(), id, it.label.trim(), it.instructions?.trim() || null, it.required ? 1 : 0, i, cleanFormats(it.formats).join(","),
        Math.min(it.maxMb ? it.maxMb * 1024 * 1024 : LIMITS.maxFileBytes, LIMITS.maxFileBytes),
        it.conditionQuestion || null, it.conditionQuestion ? (it.conditionEquals ?? "yes") : null),
    );
    const token = issueToken(ctx, id, ttl);
    logEvent(ctx, id, "julien", "request_created", { items: input.items.length });
    logEvent(ctx, id, "julien", "link_generated", { ttlDays: ttl });
    return { id, token };
  });
}

export function linkUrl(ctx: PortalContext, token: string): string {
  return `${ctx.baseUrl.replace(/\/$/, "")}/documents/${token}`;
}

export function regenerateLink(ctx: PortalContext, admin: AdminSession | null, requestId: string, ttlDays: number = LIMITS.defaultLinkTtlDays): string {
  assertAdmin(admin);
  const r = getRequest(ctx, requestId);
  if (r.closed_at) throw new PortalError("closed");
  const token = issueToken(ctx, requestId, ttlDays);
  logEvent(ctx, requestId, "julien", "link_regenerated", { ttlDays });
  touch(ctx, requestId);
  return token;
}

export function revokeLink(ctx: PortalContext, admin: AdminSession | null, requestId: string) {
  assertAdmin(admin);
  getRequest(ctx, requestId);
  run(ctx.db, "UPDATE requests SET revoked_at = ? WHERE id = ?", iso(ctx), requestId);
  logEvent(ctx, requestId, "julien", "link_revoked");
  touch(ctx, requestId);
}

export function setLinkExpiry(ctx: PortalContext, admin: AdminSession | null, requestId: string, days: number) {
  assertAdmin(admin);
  const r = getRequest(ctx, requestId);
  if (r.revoked_at) throw new PortalError("revoked_link");
  if (!(days >= 1 && days <= 365)) throw new PortalError("invalid_input");
  run(ctx.db, "UPDATE requests SET expires_at = ? WHERE id = ?", new Date(ctx.now().getTime() + days * 86_400_000).toISOString(), requestId);
  logEvent(ctx, requestId, "julien", "link_extended", { days });
}

/** Lien actif à recopier (déchiffré à la demande, uniquement pour la session administrateur). */
export function getActiveLink(ctx: PortalContext, admin: AdminSession | null, requestId: string): string | null {
  assertAdmin(admin);
  const r = getRequest(ctx, requestId);
  if (linkStateOf(r, ctx.now()) !== "active" || !r.token_enc) return null;
  const token = decryptToken(r.token_enc);
  return token ? linkUrl(ctx, token) : null;
}

// ───────────────────────── Lecture : liste, tableau de bord, fiche ─────────────────────────

export interface RequestListRow {
  id: string;
  clientName: string;
  insuranceSlug: string;
  insuranceName: string;
  title: string;
  createdAt: string;
  lastActivityAt: string;
  received: number;
  expected: number;
  status: RequestStatus;
  linkState: "active" | "expired" | "revoked" | "none";
  toReviewCount: number;
  toReplaceCount: number;
  missingCount: number;
  isDemo: boolean;
}

function toListRow(ctx: PortalContext, r: RequestRow & { full_name: string }): RequestListRow {
  const items = getItems(ctx, r.id);
  const answers = answersOf(r);
  const p = computeProgress(items, answers);
  return {
    id: r.id,
    clientName: r.full_name,
    insuranceSlug: r.insurance_slug,
    // Nom du MODÈLE choisi (ex. « Moto », « PNO ») : il distingue des produits qui partagent une même page du site.
    insuranceName: r.title || (getProductBySlug(r.insurance_slug)?.name ?? r.insurance_slug),
    title: r.title,
    createdAt: r.created_at,
    lastActivityAt: r.last_activity_at,
    received: p.requiredDone,
    expected: p.requiredTotal,
    status: deriveStatus(r, items),
    linkState: linkStateOf(r, ctx.now()),
    toReviewCount: p.toReview.length,
    toReplaceCount: p.toReplace.length,
    missingCount: p.missing.length,
    isDemo: !!r.is_demo,
  };
}

export interface ListFilters {
  q?: string;
  insurance?: string;
  status?: RequestStatus | "open" | "";
  missing?: boolean;
  from?: string;
  to?: string;
}

export function listRequests(ctx: PortalContext, admin: AdminSession | null, f: ListFilters = {}): RequestListRow[] {
  assertAdmin(admin);
  const rows = all<RequestRow & { full_name: string }>(
    ctx.db,
    `SELECT r.*, c.full_name FROM requests r JOIN clients c ON c.id = r.client_id ORDER BY r.last_activity_at DESC`,
  ).map((r) => toListRow(ctx, r));
  const q = f.q?.trim().toLowerCase();
  return rows.filter((r) => {
    if (q && !r.clientName.toLowerCase().includes(q) && !r.title.toLowerCase().includes(q)) return false;
    if (f.insurance && r.insuranceSlug !== f.insurance) return false;
    if (f.status === "open") { if (r.status === "closed") return false; }
    else if (f.status && r.status !== f.status) return false;
    if (f.missing && r.missingCount + r.toReplaceCount === 0) return false;
    if (f.from && r.createdAt < f.from) return false;
    if (f.to && r.createdAt > f.to + "T23:59:59.999Z") return false;
    return true;
  });
}

export interface Dashboard {
  counts: Record<"incomplete" | "complete" | "to_review" | "toExamine" | "toReplace" | "closed" | "validated", number>;
  attention: RequestListRow[];
  activity: { id: string; requestId: string; clientName: string; title: string; actor: string; type: string; at: string }[];
}

export function dashboard(ctx: PortalContext, admin: AdminSession | null): Dashboard {
  assertAdmin(admin);
  const rows = listRequests(ctx, admin);
  const counts = { incomplete: 0, complete: 0, to_review: 0, toExamine: 0, toReplace: 0, closed: 0, validated: 0 };
  for (const r of rows) {
    if (r.status === "incomplete") counts.incomplete++;
    if (r.status === "complete") counts.complete++;
    if (r.status === "to_review") counts.to_review++;
    if (r.status === "validated") counts.validated++;
    if (r.status === "closed") counts.closed++;
    if (r.status !== "closed" && r.toReviewCount > 0) counts.toExamine++;
    if (r.status !== "closed" && r.toReplaceCount > 0) counts.toReplace++;
  }
  const attention = rows
    .filter((r) => r.status === "to_review" || r.status === "complete" || (r.status !== "closed" && r.toReviewCount > 0))
    .slice(0, 8);
  const activity = all<{ id: string; request_id: string; full_name: string; title: string; actor: string; type: string; created_at: string }>(
    ctx.db,
    `SELECT e.id, e.request_id, c.full_name, r.title, e.actor, e.type, e.created_at
       FROM events e JOIN requests r ON r.id = e.request_id JOIN clients c ON c.id = r.client_id
      WHERE e.type NOT IN ('file_downloaded')
      ORDER BY e.created_at DESC, e.rowid DESC LIMIT 12`,
  ).map((e) => ({ id: e.id, requestId: e.request_id, clientName: e.full_name, title: e.title, actor: e.actor, type: e.type, at: e.created_at }));
  return { counts, attention, activity };
}

export interface RequestDetail {
  request: RequestRow;
  client: ClientRow;
  insuranceName: string;
  status: RequestStatus;
  linkState: "active" | "expired" | "revoked" | "none";
  items: (ItemRow & { files: FileRow[]; applicable: boolean })[];
  progress: ReturnType<typeof computeProgress>;
  questions: Question[];
  answers: Answers;
  fields: InfoField[];
  info: Info;
  infoMissing: InfoField[];
  events: EventRow[];
  reminders: { id: string; channel: string; missing_count: number; created_at: string }[];
}

export function getRequestDetail(ctx: PortalContext, admin: AdminSession | null, id: string): RequestDetail {
  assertAdmin(admin);
  const request = getRequest(ctx, id);
  const client = get<ClientRow>(ctx.db, "SELECT * FROM clients WHERE id = ?", request.client_id)!;
  const items = getItems(ctx, id);
  const files = getFiles(ctx, id);
  const answers = answersOf(request);
  const progress = computeProgress(items, answers);
  const applicableIds = new Set(items.filter((i) => !i.condition_question || answers[i.condition_question] === i.condition_equals).map((i) => i.id));
  return {
    request: { ...request, token_hash: null, token_enc: null }, // jamais exposé à l'interface
    client,
    insuranceName: request.title || (getProductBySlug(request.insurance_slug)?.name ?? request.insurance_slug),
    status: deriveStatus(request, items),
    linkState: linkStateOf(request, ctx.now()),
    items: items.map((i) => ({ ...i, files: files.filter((f) => f.item_id === i.id), applicable: applicableIds.has(i.id) })),
    progress,
    questions: parseJson<Question[]>(request.questions, []),
    answers,
    fields: parseJson<InfoField[]>(request.fields, []),
    info: parseJson<Info>(request.info, {}),
    infoMissing: missingInfo(parseJson<InfoField[]>(request.fields, []), parseJson<Info>(request.info, {})),
    events: all<EventRow>(ctx.db, "SELECT * FROM events WHERE request_id = ? ORDER BY created_at DESC, rowid DESC", id),
    reminders: all(ctx.db, "SELECT id, channel, missing_count, created_at FROM reminders WHERE request_id = ? ORDER BY created_at DESC", id),
  };
}

// ───────────────────────── Examen des pièces ─────────────────────────

export function reviewItem(
  ctx: PortalContext,
  admin: AdminSession | null,
  itemId: string,
  decision: "validate" | "replace",
  opts: { reason?: string; note?: string } = {},
) {
  assertAdmin(admin);
  const item = getItem(ctx, itemId);
  const req = getRequest(ctx, item.request_id);
  if (req.closed_at) throw new PortalError("closed");
  if (item.state === "to_provide") throw new PortalError("conflict", "Aucun fichier à examiner.");
  const t = iso(ctx);
  if (decision === "validate") {
    if (item.state === "to_replace") throw new PortalError("conflict", "Pièce en attente de remplacement.");
    run(ctx.db, "UPDATE request_items SET state='validated', reviewed_at=?, validated_at=?, reject_reason=NULL, reject_note=NULL WHERE id=?", t, t, itemId);
    logEvent(ctx, req.id, "julien", "item_validated", { label: item.label }, itemId);
  } else {
    const reason = opts.reason ?? "autre";
    run(ctx.db, "UPDATE request_items SET state='to_replace', reviewed_at=?, validated_at=NULL, reject_reason=?, reject_note=? WHERE id=?", t, reason, opts.note?.trim().slice(0, 300) || null, itemId);
    // Le client devra confirmer à nouveau son envoi une fois la pièce remplacée.
    run(ctx.db, "UPDATE requests SET submitted_at = NULL WHERE id = ?", req.id);
    logEvent(ctx, req.id, "julien", "item_to_replace", { label: item.label, reason }, itemId);
  }
  touch(ctx, req.id);
}

export function addItem(ctx: PortalContext, admin: AdminSession | null, requestId: string, input: TemplateItemInput) {
  assertAdmin(admin);
  const req = getRequest(ctx, requestId);
  if (req.closed_at) throw new PortalError("closed");
  validateItems([input], parseJson<Question[]>(req.questions, []));
  const sort = (get<{ m: number | null }>(ctx.db, "SELECT MAX(sort) AS m FROM request_items WHERE request_id = ?", requestId)?.m ?? -1) + 1;
  const id = newId();
  run(ctx.db,
    "INSERT INTO request_items(id, request_id, label, instructions, required, sort, allowed_formats, max_bytes) VALUES (?,?,?,?,?,?,?,?)",
    id, requestId, input.label.trim(), input.instructions?.trim() || null, input.required ? 1 : 0, sort,
    cleanFormats(input.formats).join(","), LIMITS.maxFileBytes);
  run(ctx.db, "UPDATE requests SET submitted_at = NULL WHERE id = ?", requestId);
  logEvent(ctx, requestId, "julien", "item_added", { label: input.label.trim() }, id);
  touch(ctx, requestId);
  return id;
}

export async function removeItem(ctx: PortalContext, admin: AdminSession | null, itemId: string) {
  assertAdmin(admin);
  const item = getItem(ctx, itemId);
  const req = getRequest(ctx, item.request_id);
  if (req.closed_at) throw new PortalError("closed");
  const files = all<FileRow>(ctx.db, "SELECT * FROM files WHERE item_id = ? AND deleted_at IS NULL", itemId);
  for (const f of files) await deleteFileRecord(ctx, f);
  run(ctx.db, "DELETE FROM request_items WHERE id = ?", itemId);
  logEvent(ctx, req.id, "julien", "item_removed", { label: item.label });
  touch(ctx, req.id);
}

export function setItemRequired(ctx: PortalContext, admin: AdminSession | null, itemId: string, required: boolean) {
  assertAdmin(admin);
  const item = getItem(ctx, itemId);
  run(ctx.db, "UPDATE request_items SET required = ? WHERE id = ?", required ? 1 : 0, itemId);
  touch(ctx, item.request_id);
}

// ───────────────────────── Clôture, relances, suppression ─────────────────────────

export function closeRequest(ctx: PortalContext, admin: AdminSession | null, requestId: string) {
  assertAdmin(admin);
  getRequest(ctx, requestId);
  run(ctx.db, "UPDATE requests SET closed_at = ? WHERE id = ?", iso(ctx), requestId);
  logEvent(ctx, requestId, "julien", "request_closed");
  touch(ctx, requestId);
}

export function reopenRequest(ctx: PortalContext, admin: AdminSession | null, requestId: string) {
  assertAdmin(admin);
  run(ctx.db, "UPDATE requests SET closed_at = NULL WHERE id = ?", requestId);
  logEvent(ctx, requestId, "julien", "request_reopened");
  touch(ctx, requestId);
}

export function prepareReminder(ctx: PortalContext, admin: AdminSession | null, requestId: string) {
  assertAdmin(admin);
  const d = getRequestDetail(ctx, admin, requestId);
  const link = getActiveLink(ctx, admin, requestId);
  const msg = buildReminder({
    firstName: firstName(d.client.full_name),
    insuranceLabel: d.insuranceName,
    missing: d.progress.missing,
    toReplace: d.progress.toReplace,
    link,
  });
  return {
    ...msg,
    hasLink: !!link,
    nothingToAsk: d.progress.missing.length + d.progress.toReplace.length === 0,
    mailto: d.client.email ? mailtoLink(d.client.email, msg.subject, msg.text) : null,
    whatsapp: d.client.phone ? whatsappLink(d.client.phone, msg.text) : null,
  };
}

/** Historique : on note qu'une relance a été préparée/envoyée (aucun envoi automatique n'est fait ici). */
export function logReminder(ctx: PortalContext, admin: AdminSession | null, requestId: string, channel: "copie" | "email" | "whatsapp") {
  assertAdmin(admin);
  const d = getRequestDetail(ctx, admin, requestId);
  run(ctx.db, "INSERT INTO reminders(id, request_id, channel, missing_count, created_at) VALUES (?,?,?,?,?)",
    newId(), requestId, channel, d.progress.missing.length + d.progress.toReplace.length, iso(ctx));
  logEvent(ctx, requestId, "julien", "reminder_logged", { channel });
  touch(ctx, requestId);
}

export async function deleteRequestPermanently(ctx: PortalContext, admin: AdminSession | null, requestId: string) {
  assertAdmin(admin);
  getRequest(ctx, requestId);
  const files = all<FileRow>(ctx.db, "SELECT * FROM files WHERE request_id = ?", requestId);
  for (const f of files) await ctx.storage.remove(f.storage_key);
  for (const u of all<{ id: string }>(ctx.db, "SELECT id FROM uploads WHERE request_id = ? AND consumed_at IS NULL", requestId))
    await ctx.storage.dropQuarantine(u.id);
  tx(ctx.db, () => {
    run(ctx.db, "DELETE FROM requests WHERE id = ?", requestId);
    run(ctx.db, "INSERT INTO audit_log(id, at, actor, action, request_ref) VALUES (?,?,?,?,?)", newId(), iso(ctx), admin.userId, "request_deleted", requestId);
  });
}

/** Purge des dossiers CLÔTURÉS depuis plus de N jours. Durée à faire valider : aucune valeur par défaut. */
export async function purgeClosedRequests(ctx: PortalContext, admin: AdminSession | null, olderThanDays: number): Promise<number> {
  assertAdmin(admin);
  if (!(olderThanDays >= 1)) throw new PortalError("invalid_input");
  const limit = new Date(ctx.now().getTime() - olderThanDays * 86_400_000).toISOString();
  const ids = all<{ id: string }>(ctx.db, "SELECT id FROM requests WHERE closed_at IS NOT NULL AND closed_at < ?", limit);
  for (const { id } of ids) await deleteRequestPermanently(ctx, admin, id);
  return ids.length;
}

// ───────────────────────── Téléchargement sécurisé ─────────────────────────

export async function openFileForAdmin(ctx: PortalContext, admin: AdminSession | null, fileId: string) {
  assertAdmin(admin);
  const f = get<FileRow>(ctx.db, "SELECT * FROM files WHERE id = ? AND deleted_at IS NULL", fileId);
  if (!f) throw new PortalError("not_found");
  if (f.scan_status !== "clean") throw new PortalError("forbidden_format");
  const opened = await ctx.storage.open(f.storage_key);
  logEvent(ctx, f.request_id, "julien", "file_downloaded", { fileId: f.id }, f.item_id);
  return { ...opened, name: f.original_name, type: f.detected_type, size: f.size };
}

