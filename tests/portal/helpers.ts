import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import type { PortalContext } from "@/lib/portal/context";
import { openDatabase } from "@/lib/portal/db";
import { LocalStorage } from "@/lib/portal/storage";
import { completeUpload, createUploadIntent, receiveUpload } from "@/lib/portal/client";
import { createRequest, type CreateRequestInput } from "@/lib/portal/admin";
import type { AdminSession } from "@/lib/portal/types";

process.env.BETTER_AUTH_SECRET = "test-secret-test-secret-test-secret-32chars!!";

export const admin: AdminSession = { userId: "admin-test", email: "julien@example.invalid" };

export interface TestCtx extends PortalContext {
  dir: string;
  clock: { t: number };
  advance: (ms: number) => void;
}

export function makeCtx(): TestCtx {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ruby-portal-test-"));
  const clock = { t: Date.parse("2030-01-01T10:00:00Z") };
  return {
    dir,
    clock,
    advance: (ms) => (clock.t += ms),
    db: openDatabase(path.join(dir, "test.sqlite")),
    storage: new LocalStorage(path.join(dir, "storage")),
    now: () => new Date(clock.t),
    baseUrl: "http://test.local",
  };
}

export const cleanup = (ctx: TestCtx) => fs.rmSync(ctx.dir, { recursive: true, force: true });

/** Fichiers FICTIFS (aucune donnée réelle). */
export const fakePdf = (extra = "") => Buffer.from(`%PDF-1.4\n% DOCUMENT FICTIF DE TEST\n${extra}\n%%EOF\n`);
export const fakePng = () =>
  Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.from("FICTIF-PNG")]);

export const toStream = (buf: Buffer) => Readable.toWeb(Readable.from([buf])) as ReadableStream<Uint8Array>;

export function newRequest(ctx: TestCtx, over: Partial<CreateRequestInput> = {}) {
  return createRequest(ctx, admin, {
    newClient: { fullName: "Client Fictif Un", email: "un@example.invalid", phone: "0600000001" },
    insuranceSlug: "assurance-auto-moto",
    items: [
      { label: "Permis de conduire", required: true },
      { label: "Carte grise", required: true },
      { label: "Relevé d'informations", required: true },
      { label: "RIB", required: false },
    ],
    linkTtlDays: 14,
    isDemo: true,
    ...over,
  });
}

export const itemsOf = (ctx: TestCtx, requestId: string) =>
  ctx.db.prepare("SELECT * FROM request_items WHERE request_id = ? ORDER BY sort").all(requestId) as unknown as {
    id: string; label: string; state: string; required: number;
  }[];

/** Parcours complet : intention → envoi → validation. */
export async function upload(ctx: TestCtx, token: string, itemId: string, name: string, content: Buffer) {
  const intent = createUploadIntent(ctx, token, { itemId, fileName: name, size: content.length });
  await receiveUpload(ctx, intent.uploadToken, toStream(content));
  return completeUpload(ctx, token, intent.uploadId);
}
