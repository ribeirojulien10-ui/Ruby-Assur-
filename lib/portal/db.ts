import fs from "node:fs";
import path from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { dataDir } from "./config";

/**
 * Base SQLite locale (module `node:sqlite` de Node, aucune dépendance native).
 * Le schéma est volontairement relationnel et simple pour être transposé en PostgreSQL
 * (voir supabase/migrations/0001_portail_documents.sql).
 */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS clients(
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  is_demo INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS templates(
  id TEXT PRIMARY KEY,
  insurance_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  questions TEXT NOT NULL DEFAULT '[]',
  is_default INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS template_items(
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  instructions TEXT,
  required INTEGER NOT NULL DEFAULT 1,
  sort INTEGER NOT NULL DEFAULT 0,
  allowed_formats TEXT NOT NULL,
  max_mb INTEGER,
  condition_question TEXT,
  condition_equals TEXT
);

CREATE TABLE IF NOT EXISTS requests(
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  insurance_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  instructions TEXT,
  questions TEXT NOT NULL DEFAULT '[]',
  answers TEXT NOT NULL DEFAULT '{}',
  token_hash TEXT UNIQUE,
  token_enc TEXT,
  token_issued_at TEXT,
  expires_at TEXT,
  revoked_at TEXT,
  submitted_at TEXT,
  completed_notified_at TEXT,
  closed_at TEXT,
  is_demo INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_activity_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS request_items(
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  instructions TEXT,
  required INTEGER NOT NULL DEFAULT 1,
  sort INTEGER NOT NULL DEFAULT 0,
  allowed_formats TEXT NOT NULL,
  max_bytes INTEGER NOT NULL,
  condition_question TEXT,
  condition_equals TEXT,
  state TEXT NOT NULL DEFAULT 'to_provide'
    CHECK(state IN ('to_provide','received','to_replace','validated')),
  reject_reason TEXT,
  reject_note TEXT,
  reviewed_at TEXT,
  validated_at TEXT
);

CREATE TABLE IF NOT EXISTS files(
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES request_items(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  size INTEGER NOT NULL,
  detected_type TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  scan_status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS uploads(
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  request_id TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES request_items(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  declared_size INTEGER NOT NULL,
  received_size INTEGER,
  received_sha256 TEXT,
  expires_at TEXT NOT NULL,
  received_at TEXT,
  consumed_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events(
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  item_id TEXT,
  actor TEXT NOT NULL,
  type TEXT NOT NULL,
  meta TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reminders(
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  missing_count INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS outbox(
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  request_ref TEXT NOT NULL,
  created_at TEXT NOT NULL,
  sent_at TEXT,
  error TEXT
);

-- Trace minimale conservée même après suppression définitive d'un dossier (aucune donnée personnelle).
CREATE TABLE IF NOT EXISTS audit_log(
  id TEXT PRIMARY KEY,
  at TEXT NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  request_ref TEXT
);

CREATE INDEX IF NOT EXISTS idx_requests_client ON requests(client_id);
CREATE INDEX IF NOT EXISTS idx_items_request ON request_items(request_id);
CREATE INDEX IF NOT EXISTS idx_files_item ON files(item_id);
CREATE INDEX IF NOT EXISTS idx_events_request ON events(request_id, created_at);
CREATE INDEX IF NOT EXISTS idx_uploads_request ON uploads(request_id);
`;

export type Db = DatabaseSync;

/** Migration légère : ajoute une colonne si elle manque (bases locales créées avant son introduction). */
function addColumnIfMissing(db: Db, table: string, column: string, ddl: string) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
}

export function openDatabase(file: string): Db {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  // Chargement paresseux : le module n'est lu que si le portail est réellement utilisé
  // (évite tout échec au build ou en production quand le portail est désactivé).
  const { DatabaseSync: Sqlite } = process.getBuiltinModule("node:sqlite") as typeof import("node:sqlite");
  const db = new Sqlite(file);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA);
  // v2 : informations à saisir par le client (champs définis par le modèle, valeurs saisies sur la demande)
  addColumnIfMissing(db, "templates", "fields", "TEXT NOT NULL DEFAULT '[]'");
  addColumnIfMissing(db, "requests", "fields", "TEXT NOT NULL DEFAULT '[]'");
  addColumnIfMissing(db, "requests", "info", "TEXT NOT NULL DEFAULT '{}'");
  return db;
}

// Une seule connexion par processus (résiste au rechargement à chaud de Next en développement).
const g = globalThis as unknown as { __rubyPortalDb?: Db };

export function getDb(): Db {
  if (!g.__rubyPortalDb) g.__rubyPortalDb = openDatabase(path.join(dataDir(), "portal.sqlite"));
  return g.__rubyPortalDb;
}

/** Utilitaires de requête : renvoient des objets simples (compatibles avec les composants React). */
export function all<T>(db: Db, sql: string, ...params: unknown[]): T[] {
  return (db.prepare(sql).all(...(params as never[])) as unknown[]).map((r) => ({ ...(r as object) }) as T);
}
export function get<T>(db: Db, sql: string, ...params: unknown[]): T | undefined {
  const r = db.prepare(sql).get(...(params as never[]));
  return r ? ({ ...(r as object) } as T) : undefined;
}
export function run(db: Db, sql: string, ...params: unknown[]) {
  return db.prepare(sql).run(...(params as never[]));
}
export function tx<T>(db: Db, fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const out = fn();
    db.exec("COMMIT");
    return out;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
