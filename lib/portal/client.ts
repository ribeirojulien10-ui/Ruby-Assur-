import { getProductBySlug } from "@/lib/products";
import { LIMITS } from "./config";
import {
  deleteFileRecord,
  getFiles,
  getItem,
  getItems,
  iso,
  logEvent,
  queueNotification,
  touch,
  type PortalContext,
} from "./context";
import { all, get, run, tx } from "./db";
import { basicScan, detectType, extensionMatches } from "./filecheck";
import { extOf, hashToken, looksLikeToken, newId, newToken, safeFileName } from "./ids";
import {
  applicableItems,
  computeProgress,
  deriveStatus,
  firstName,
  linkStateOf,
  parseJson,
  unansweredQuestions,
  answersOf,
  missingInfo,
  parsePersons,
  type Answers,
  type Info,
} from "./rules";
import { PortalError, type ClientRow, type FileRow, type InfoField, type ItemRow, type Question, type RequestRow, type RequestStatus } from "./types";

/**
 * Parcours CLIENT : aucune session, l'accès repose uniquement sur le lien personnel.
 * Chaque fonction vérifie le jeton, puis que la ressource demandée appartient à CETTE demande.
 * Un lien ne peut donc jamais servir à lire ou modifier le dossier d'un autre client.
 */

export type Access =
  | { state: "ok"; request: RequestRow }
  | { state: "invalid" | "revoked" | "expired" | "closed" };

export function resolveToken(ctx: PortalContext, token: string): Access {
  if (!looksLikeToken(token)) return { state: "invalid" };
  const request = get<RequestRow>(ctx.db, "SELECT * FROM requests WHERE token_hash = ?", hashToken(token));
  if (!request) return { state: "invalid" };
  const link = linkStateOf(request, ctx.now());
  if (link === "revoked") return { state: "revoked" };
  if (link === "expired") return { state: "expired" };
  if (request.closed_at) return { state: "closed" };
  return { state: "ok", request };
}

function need(ctx: PortalContext, token: string): RequestRow {
  const a = resolveToken(ctx, token);
  if (a.state === "ok") return a.request;
  throw new PortalError(
    a.state === "invalid" ? "invalid_link" : a.state === "revoked" ? "revoked_link" : a.state === "expired" ? "expired_link" : "closed",
  );
}

export interface ClientItemView {
  id: string;
  label: string;
  instructions: string | null;
  required: boolean;
  state: ItemRow["state"];
  rejectReason: string | null;
  rejectNote: string | null;
  formats: string[];
  maxBytes: number;
  locked: boolean; // validée par Julien : plus modifiable
  files: { id: string; name: string; size: number; at: string }[];
}

export interface ClientView {
  firstName: string;
  insuranceName: string;
  title: string;
  instructions: string | null;
  expiresAt: string | null;
  status: RequestStatus;
  submitted: boolean;
  questions: Question[];
  answers: Answers;
  unanswered: Question[];
  fields: InfoField[];
  info: Info;
  infoMissing: number;
  items: ClientItemView[];
  progress: { requiredTotal: number; requiredDone: number; percent: number; missing: number; toReplace: number };
  canSubmit: boolean;
  limits: { maxFilesPerItem: number; maxFileBytes: number };
}

export function getClientView(ctx: PortalContext, token: string): ClientView {
  const request = need(ctx, token);
  const client = get<ClientRow>(ctx.db, "SELECT * FROM clients WHERE id = ?", request.client_id)!;
  const items = getItems(ctx, request.id);
  const files = getFiles(ctx, request.id);
  const answers = answersOf(request);
  const questions = parseJson<Question[]>(request.questions, []);
  const unanswered = unansweredQuestions(questions, items, answers);
  const fields = parseJson<InfoField[]>(request.fields, []);
  const info = parseJson<Info>(request.info, {});
  const p = computeProgress(items, answers);
  const status = deriveStatus(request, items);
  return {
    firstName: firstName(client.full_name),
    insuranceName: getProductBySlug(request.insurance_slug)?.name ?? "Assurance",
    title: request.title,
    instructions: request.instructions,
    expiresAt: request.expires_at,
    status,
    submitted: !!request.submitted_at,
    questions,
    answers,
    unanswered,
    fields,
    info,
    infoMissing: missingInfo(fields, info).length,
    items: applicableItems(items, answers).map((i) => ({
      id: i.id,
      label: i.label,
      instructions: i.instructions,
      required: !!i.required,
      state: i.state,
      rejectReason: i.reject_reason,
      rejectNote: i.reject_note,
      formats: i.allowed_formats.split(","),
      maxBytes: i.max_bytes,
      locked: i.state === "validated",
      files: files
        .filter((f) => f.item_id === i.id)
        .map((f) => ({ id: f.id, name: f.original_name, size: f.size, at: f.created_at })),
    })),
    progress: {
      requiredTotal: p.requiredTotal,
      requiredDone: p.requiredDone,
      percent: p.percent,
      missing: p.missing.length,
      toReplace: p.toReplace.length,
    },
    canSubmit: (status === "complete" || status === "to_review") && !request.submitted_at,
    limits: { maxFilesPerItem: LIMITS.maxFilesPerItem, maxFileBytes: LIMITS.maxFileBytes },
  };
}

export function saveAnswers(ctx: PortalContext, token: string, answers: Record<string, string>) {
  const request = need(ctx, token);
  const questions = parseJson<Question[]>(request.questions, []);
  const clean: Answers = parseJson<Answers>(request.answers, {});
  for (const q of questions) {
    const v = answers[q.key];
    if (v === "yes" || v === "no") clean[q.key] = v;
  }
  run(ctx.db, "UPDATE requests SET answers = ?, submitted_at = NULL WHERE id = ?", JSON.stringify(clean), request.id);
  logEvent(ctx, request.id, "client", "answers_saved");
  touch(ctx, request.id);
}

/** Enregistre les informations saisies par le client (champs définis par le modèle uniquement). */
export function saveInfo(ctx: PortalContext, token: string, values: Record<string, unknown>) {
  const request = need(ctx, token);
  const fields = parseJson<InfoField[]>(request.fields, []);
  const info = parseJson<Info>(request.info, {});
  for (const f of fields) {
    if (!(f.key in values)) continue;
    if (f.type === "persons") {
      const raw = values[f.key];
      const list = (Array.isArray(raw) ? raw : parsePersons(typeof raw === "string" ? raw : undefined))
        .map((p) => ({ name: String((p as { name?: unknown }).name ?? "").trim().slice(0, 120), birth: String((p as { birth?: unknown }).birth ?? "").trim() }))
        .filter((p) => p.name || p.birth)
        .slice(0, 8);
      for (const p of list) if (p.birth && !/^\d{4}-\d{2}-\d{2}$/.test(p.birth)) throw new PortalError("invalid_input", `« ${f.label} » : date de naissance invalide.`);
      if (list.length) info[f.key] = JSON.stringify(list);
      else delete info[f.key];
      continue;
    }
    let v = String(values[f.key] ?? "").trim().slice(0, f.type === "textarea" ? 2000 : 300);
    if (f.type === "number" && v && !/^-?\d+([.,]\d+)?$/.test(v)) throw new PortalError("invalid_input", `« ${f.label} » doit être un nombre.`);
    if (f.type === "date" && v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new PortalError("invalid_input", `« ${f.label} » : date invalide.`);
    if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new PortalError("invalid_input", `« ${f.label} » : adresse e-mail invalide.`);
    if (f.type === "choice" && v && !(f.options ?? []).includes(v)) v = "";
    if (v) info[f.key] = v;
    else delete info[f.key];
  }
  run(ctx.db, "UPDATE requests SET info = ? WHERE id = ?", JSON.stringify(info), request.id);
  logEvent(ctx, request.id, "client", "info_saved");
  touch(ctx, request.id);
}

// ───────────────────────── Téléversement : intention → envoi → validation ─────────────────────────

/** Étape 1 : le serveur vérifie tout et délivre une autorisation temporaire, à usage unique. */
export function createUploadIntent(
  ctx: PortalContext,
  token: string,
  input: { itemId: string; fileName: string; size: number },
): { uploadId: string; uploadToken: string; expiresAt: string } {
  const request = need(ctx, token);
  const item = getItem(ctx, input.itemId);
  if (item.request_id !== request.id) throw new PortalError("not_found"); // pièce d'une AUTRE demande
  const items = getItems(ctx, request.id);
  const answers = answersOf(request);
  if (!applicableItems(items, answers).some((i) => i.id === item.id)) throw new PortalError("not_found");
  if (item.state === "validated") throw new PortalError("conflict", "Cette pièce a déjà été validée.");

  const name = safeFileName(input.fileName);
  const ext = extOf(name);
  if (!item.allowed_formats.split(",").includes(ext)) throw new PortalError("forbidden_format", "Format non accepté.");
  if (!Number.isInteger(input.size) || input.size <= 0) throw new PortalError("bad_upload", "Fichier vide.");
  const max = Math.min(item.max_bytes, LIMITS.maxFileBytes);
  if (input.size > max) throw new PortalError("too_large");

  const current = all<FileRow>(ctx.db, "SELECT * FROM files WHERE item_id = ? AND deleted_at IS NULL", item.id);
  if (item.state !== "to_replace" && current.length >= LIMITS.maxFilesPerItem) throw new PortalError("too_many_files");
  const total =
    get<{ s: number | null }>(ctx.db, "SELECT SUM(size) AS s FROM files WHERE request_id = ? AND deleted_at IS NULL", request.id)?.s ?? 0;
  if (total + input.size > LIMITS.maxRequestBytes) throw new PortalError("too_large", "Volume maximal du dossier atteint.");

  const pending =
    get<{ c: number }>(
      ctx.db,
      "SELECT COUNT(*) AS c FROM uploads WHERE request_id = ? AND consumed_at IS NULL AND expires_at > ?",
      request.id,
      iso(ctx),
    )?.c ?? 0;
  if (pending >= 20) throw new PortalError("rate_limited");

  const uploadToken = newToken();
  const uploadId = newId();
  const expiresAt = new Date(ctx.now().getTime() + LIMITS.uploadIntentTtlMs).toISOString();
  run(
    ctx.db,
    "INSERT INTO uploads(id, token_hash, request_id, item_id, file_name, declared_size, expires_at, created_at) VALUES (?,?,?,?,?,?,?,?)",
    uploadId,
    hashToken(uploadToken),
    request.id,
    item.id,
    name,
    input.size,
    expiresAt,
    iso(ctx),
  );
  return { uploadId, uploadToken, expiresAt };
}

interface UploadRow {
  id: string;
  request_id: string;
  item_id: string;
  file_name: string;
  declared_size: number;
  received_size: number | null;
  received_sha256: string | null;
  expires_at: string;
  received_at: string | null;
  consumed_at: string | null;
}

/** Étape 2 : réception du fichier en QUARANTAINE. Le client n'a pas d'accès en lecture à cette zone. */
export async function receiveUpload(ctx: PortalContext, uploadToken: string, body: ReadableStream<Uint8Array> | null) {
  if (!looksLikeToken(uploadToken)) throw new PortalError("invalid_link");
  const up = get<UploadRow>(ctx.db, "SELECT * FROM uploads WHERE token_hash = ?", hashToken(uploadToken));
  if (!up || up.consumed_at || up.received_at) throw new PortalError("invalid_link");
  if (new Date(up.expires_at).getTime() <= ctx.now().getTime()) throw new PortalError("expired_link");
  const request = get<RequestRow>(ctx.db, "SELECT * FROM requests WHERE id = ?", up.request_id);
  if (!request || linkStateOf(request, ctx.now()) !== "active" || request.closed_at) throw new PortalError("invalid_link");

  try {
    const { size, sha256 } = await ctx.storage.putQuarantine(up.id, body, up.declared_size);
    if (size !== up.declared_size) {
      await ctx.storage.dropQuarantine(up.id);
      throw new PortalError("bad_upload", "Téléversement incomplet.");
    }
    run(ctx.db, "UPDATE uploads SET received_size=?, received_sha256=?, received_at=? WHERE id=?", size, sha256, iso(ctx), up.id);
  } catch (e) {
    await ctx.storage.dropQuarantine(up.id);
    run(ctx.db, "UPDATE uploads SET consumed_at = ? WHERE id = ?", iso(ctx), up.id); // autorisation brûlée
    throw e;
  }
}

/** Étape 3 : contrôle du contenu réel, analyse, puis enregistrement définitif. */
export async function completeUpload(ctx: PortalContext, token: string, uploadId: string) {
  const request = need(ctx, token);
  const up = get<UploadRow>(ctx.db, "SELECT * FROM uploads WHERE id = ?", uploadId);
  if (!up || up.request_id !== request.id) throw new PortalError("not_found");
  if (up.consumed_at) throw new PortalError("bad_upload", "Autorisation déjà utilisée.");
  if (!up.received_at) throw new PortalError("bad_upload", "Fichier non reçu.");

  const item = getItem(ctx, up.item_id);
  const burn = () => run(ctx.db, "UPDATE uploads SET consumed_at = ? WHERE id = ?", iso(ctx), up.id);
  try {
    const content = await ctx.storage.readQuarantine(up.id);
    const type = detectType(content.subarray(0, 16));
    const ext = extOf(up.file_name);
    if (!extensionMatches(up.file_name, type) || !item.allowed_formats.split(",").includes(ext))
      throw new PortalError("forbidden_format", "Le contenu du fichier ne correspond pas à son format.");
    const scan = basicScan(content);
    if (scan.status !== "clean") throw new PortalError("infected", "Fichier refusé par l'analyse de sécurité.");

    const storageKey = newId();
    const replaced: FileRow[] = [];
    const result = tx(ctx.db, () => {
      const freshItem = getItem(ctx, item.id);
      if (freshItem.state === "validated") throw new PortalError("conflict", "Cette pièce a déjà été validée.");
      const existing = all<FileRow>(ctx.db, "SELECT * FROM files WHERE item_id = ? AND deleted_at IS NULL", item.id);
      const isReplacement = freshItem.state === "to_replace";
      if (isReplacement) replaced.push(...existing);
      else if (existing.length >= LIMITS.maxFilesPerItem) throw new PortalError("too_many_files");

      const t = iso(ctx);
      if (isReplacement) run(ctx.db, "UPDATE files SET deleted_at = ? WHERE item_id = ? AND deleted_at IS NULL", t, item.id);
      run(
        ctx.db,
        "INSERT INTO files(id, request_id, item_id, storage_key, original_name, size, detected_type, sha256, scan_status, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
        newId(),
        request.id,
        item.id,
        storageKey,
        up.file_name,
        up.received_size ?? content.length,
        type,
        up.received_sha256 ?? "",
        scan.status,
        t,
      );
      run(ctx.db, "UPDATE request_items SET state='received', reject_reason=NULL, reject_note=NULL, reviewed_at=NULL WHERE id=?", item.id);
      run(ctx.db, "UPDATE uploads SET consumed_at = ? WHERE id = ?", t, up.id);
      logEvent(ctx, request.id, "client", isReplacement ? "file_replaced" : "file_uploaded", { label: freshItem.label }, item.id);
      touch(ctx, request.id);

      const completed = false; // la notification à Julien se fait à la CONFIRMATION du client (voir submitRequest)
      return { completed, replacement: isReplacement };
    });
    await ctx.storage.promote(up.id, storageKey);
    for (const f of replaced) await ctx.storage.remove(f.storage_key);
    return result;
  } catch (e) {
    await ctx.storage.dropQuarantine(up.id);
    burn();
    throw e;
  }
}

export async function deleteClientFile(ctx: PortalContext, token: string, fileId: string) {
  const request = need(ctx, token);
  const f = get<FileRow>(ctx.db, "SELECT * FROM files WHERE id = ? AND deleted_at IS NULL", fileId);
  if (!f || f.request_id !== request.id) throw new PortalError("not_found"); // fichier d'un autre dossier
  const item = getItem(ctx, f.item_id);
  if (item.state === "validated") throw new PortalError("conflict", "Cette pièce a déjà été validée.");
  await deleteFileRecord(ctx, f);
  const left = get<{ c: number }>(ctx.db, "SELECT COUNT(*) AS c FROM files WHERE item_id = ? AND deleted_at IS NULL", item.id)?.c ?? 0;
  if (left === 0 && item.state === "received") run(ctx.db, "UPDATE request_items SET state='to_provide' WHERE id=?", item.id);
  run(ctx.db, "UPDATE requests SET submitted_at = NULL WHERE id = ?", request.id);
  logEvent(ctx, request.id, "client", "file_deleted", { label: item.label }, item.id);
  touch(ctx, request.id);
}

/** Le client confirme son envoi. Cela ne VALIDE rien : seul Julien valide la conformité des pièces. */
export function submitRequest(ctx: PortalContext, token: string): RequestStatus {
  const request = need(ctx, token);
  const items = getItems(ctx, request.id);
  const status = deriveStatus(request, items);
  if (status === "incomplete") throw new PortalError("conflict", "Il manque encore des pièces obligatoires.");
  const t = iso(ctx);
  const firstTime = !request.submitted_at;
  run(ctx.db, "UPDATE requests SET submitted_at = ? WHERE id = ?", t, request.id);
  logEvent(ctx, request.id, "client", "request_submitted");
  if (firstTime) {
    // Julien est prévenu quand le CLIENT confirme son envoi (et non dès que des pièces sont reçues).
    run(ctx.db, "UPDATE requests SET completed_notified_at = ? WHERE id = ?", t, request.id);
    queueNotification(ctx, "request_ready", request.id);
  }
  touch(ctx, request.id);
  return deriveStatus({ ...request, submitted_at: t }, items);
}

/** Nettoyage des autorisations expirées et de leur quarantaine. */
export async function cleanupExpiredUploads(ctx: PortalContext) {
  const stale = all<{ id: string }>(ctx.db, "SELECT id FROM uploads WHERE consumed_at IS NULL AND expires_at < ?", iso(ctx));
  for (const u of stale) {
    await ctx.storage.dropQuarantine(u.id);
    run(ctx.db, "UPDATE uploads SET consumed_at = ? WHERE id = ?", iso(ctx), u.id);
  }
  return stale.length;
}
