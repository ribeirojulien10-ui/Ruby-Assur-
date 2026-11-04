import type { Db } from "./db";
import { all, get, getDb, run } from "./db";
import { newId } from "./ids";
import { getStorage, type StorageAdapter } from "./storage";
import type { EventRow, FileRow, ItemRow, RequestRow } from "./types";
import { PortalError } from "./types";

export interface PortalContext {
  db: Db;
  storage: StorageAdapter;
  now: () => Date;
  /** Origine publique utilisée pour construire les liens clients (ex. http://localhost:3000). */
  baseUrl: string;
}

export function defaultContext(): PortalContext {
  return {
    db: getDb(),
    storage: getStorage(),
    now: () => new Date(),
    baseUrl: process.env.PORTAL_BASE_URL ?? "http://localhost:3000",
  };
}

export const iso = (ctx: PortalContext) => ctx.now().toISOString();

export function logEvent(
  ctx: PortalContext,
  requestId: string,
  actor: EventRow["actor"],
  type: string,
  meta: Record<string, unknown> = {},
  itemId: string | null = null,
) {
  // Les métadonnées ne contiennent jamais le contenu d'un document ni de donnée sensible.
  run(
    ctx.db,
    "INSERT INTO events(id, request_id, item_id, actor, type, meta, created_at) VALUES (?,?,?,?,?,?,?)",
    newId(),
    requestId,
    itemId,
    actor,
    type,
    JSON.stringify(meta),
    iso(ctx),
  );
}

export function touch(ctx: PortalContext, requestId: string) {
  const t = iso(ctx);
  run(ctx.db, "UPDATE requests SET updated_at = ?, last_activity_at = ? WHERE id = ?", t, t, requestId);
}

export const getRequest = (ctx: PortalContext, id: string): RequestRow => {
  const r = get<RequestRow>(ctx.db, "SELECT * FROM requests WHERE id = ?", id);
  if (!r) throw new PortalError("not_found");
  return r;
};

export const getItems = (ctx: PortalContext, requestId: string): ItemRow[] =>
  all<ItemRow>(ctx.db, "SELECT * FROM request_items WHERE request_id = ? ORDER BY sort, rowid", requestId);

export const getFiles = (ctx: PortalContext, requestId: string): FileRow[] =>
  all<FileRow>(
    ctx.db,
    "SELECT * FROM files WHERE request_id = ? AND deleted_at IS NULL ORDER BY created_at, rowid",
    requestId,
  );

export const getItem = (ctx: PortalContext, itemId: string): ItemRow => {
  const i = get<ItemRow>(ctx.db, "SELECT * FROM request_items WHERE id = ?", itemId);
  if (!i) throw new PortalError("not_found");
  return i;
};

export const queueNotification = (ctx: PortalContext, kind: string, requestId: string) =>
  run(
    ctx.db,
    "INSERT INTO outbox(id, kind, request_ref, created_at) VALUES (?,?,?,?)",
    newId(),
    kind,
    requestId,
    iso(ctx),
  );

/** Supprime physiquement un fichier (stockage + trace en base marquée supprimée). */
export async function deleteFileRecord(ctx: PortalContext, file: FileRow) {
  run(ctx.db, "UPDATE files SET deleted_at = ? WHERE id = ?", iso(ctx), file.id);
  await ctx.storage.remove(file.storage_key);
}
