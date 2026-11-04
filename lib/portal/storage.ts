import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { dataDir } from "./config";
import { PortalError } from "./types";

/**
 * Stockage PRIVÉ des fichiers.
 *
 * Interface commune : en local, les fichiers vivent sur le disque (dossier `.data/`, hors de /public
 * et ignoré par Git). En production, cette interface serait implémentée par un stockage objet privé
 * (ex. Supabase Storage avec URL de téléversement signées) — voir docs/portail/architecture.md.
 *
 * Les clés de stockage sont des UUID aléatoires : aucun nom de client ni nom de fichier d'origine.
 * Aucun fichier n'est jamais accessible par une URL publique.
 */
export interface StorageAdapter {
  /** Reçoit un flux dans la zone de QUARANTAINE (jamais lisible par le client). */
  putQuarantine(uploadId: string, body: ReadableStream<Uint8Array> | null, maxBytes: number): Promise<{ size: number; sha256: string }>;
  readQuarantine(uploadId: string): Promise<Buffer>;
  /** Passe le fichier de la quarantaine au stockage définitif. */
  promote(uploadId: string, storageKey: string): Promise<void>;
  dropQuarantine(uploadId: string): Promise<void>;
  open(storageKey: string): Promise<{ stream: ReadableStream<Uint8Array>; size: number }>;
  read(storageKey: string): Promise<Buffer>;
  remove(storageKey: string): Promise<void>;
}

export class LocalStorage implements StorageAdapter {
  private root: string;
  private quarantine: string;
  private files: string;

  constructor(root: string = path.join(dataDir(), "storage")) {
    this.root = root;
    this.quarantine = path.join(root, "quarantine");
    this.files = path.join(root, "files");
    fs.mkdirSync(this.quarantine, { recursive: true, mode: 0o700 });
    fs.mkdirSync(this.files, { recursive: true, mode: 0o700 });
  }

  private qpath(id: string) {
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new PortalError("bad_upload");
    return path.join(this.quarantine, id);
  }
  private fpath(key: string) {
    if (!/^[0-9a-f-]{36}$/.test(key)) throw new PortalError("not_found");
    return path.join(this.files, key);
  }

  async putQuarantine(uploadId: string, body: ReadableStream<Uint8Array> | null, maxBytes: number) {
    if (!body) throw new PortalError("bad_upload", "Corps de requête vide");
    const target = this.qpath(uploadId);
    const hash = createHash("sha256");
    let size = 0;
    const counter = new Transform({
      transform(chunk: Buffer, _enc, cb) {
        size += chunk.length;
        if (size > maxBytes) return cb(new PortalError("too_large"));
        hash.update(chunk);
        cb(null, chunk);
      },
    });
    try {
      await pipeline(Readable.fromWeb(body as never), counter, fs.createWriteStream(target, { mode: 0o600, flags: "wx" }));
    } catch (e) {
      await fs.promises.rm(target, { force: true });
      if (e instanceof PortalError) throw e;
      // Téléversement interrompu (connexion coupée) : on nettoie, rien n'est conservé.
      throw new PortalError("bad_upload", "Téléversement interrompu");
    }
    return { size, sha256: hash.digest("hex") };
  }

  async readQuarantine(uploadId: string) {
    return fs.promises.readFile(this.qpath(uploadId));
  }

  async promote(uploadId: string, storageKey: string) {
    await fs.promises.rename(this.qpath(uploadId), this.fpath(storageKey));
  }

  async dropQuarantine(uploadId: string) {
    await fs.promises.rm(this.qpath(uploadId), { force: true });
  }

  async open(storageKey: string) {
    const p = this.fpath(storageKey);
    const stat = await fs.promises.stat(p).catch(() => null);
    if (!stat) throw new PortalError("not_found");
    return { stream: Readable.toWeb(fs.createReadStream(p)) as ReadableStream<Uint8Array>, size: stat.size };
  }

  async read(storageKey: string) {
    return fs.promises.readFile(this.fpath(storageKey));
  }

  async remove(storageKey: string) {
    await fs.promises.rm(this.fpath(storageKey), { force: true });
  }
}

const g = globalThis as unknown as { __rubyPortalStorage?: StorageAdapter };
export function getStorage(): StorageAdapter {
  if (!g.__rubyPortalStorage) g.__rubyPortalStorage = new LocalStorage();
  return g.__rubyPortalStorage;
}
