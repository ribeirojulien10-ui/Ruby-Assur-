import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminSession } from "@/lib/portal/types";

// Environnement isolé : base et fichiers dans un dossier temporaire, jamais dans .data/.
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ruby-portal-routes-"));
process.env.PORTAL_ENABLED = "true";
process.env.PORTAL_DATA_DIR = dir;
process.env.BETTER_AUTH_SECRET = "test-secret-test-secret-test-secret-32chars!!";

const session: { current: AdminSession | null } = { current: null };
vi.mock("@/lib/auth-guard", () => ({
  getAdminSession: vi.fn(async () => session.current),
  requireAdmin: vi.fn(async () => {
    if (!session.current) throw new Error("redirect");
    return session.current;
  }),
}));

const admin: AdminSession = { userId: "admin-test", email: "julien@example.invalid" };
const pdf = (extra = "") => Buffer.from(`%PDF-1.4\n% FICTIF ${extra}\n%%EOF\n`);
const params = <T,>(p: T) => ({ params: Promise.resolve(p) });
const json = async (r: Response) => (await r.json()) as Record<string, unknown>;

let ctx: Awaited<ReturnType<(typeof import("@/lib/portal/context"))["defaultContext"]>>;
let token: string;
let itemId: string;
let requestId: string;

beforeAll(async () => {
  const { defaultContext } = await import("@/lib/portal/context");
  const { createRequest } = await import("@/lib/portal/admin");
  ctx = defaultContext();
  const r = createRequest(ctx, admin, {
    newClient: { fullName: "Client Fictif Routes" },
    insuranceSlug: "assurance-auto-moto",
    items: [{ label: "Permis", required: true }],
    isDemo: true,
  });
  token = r.token;
  requestId = r.id;
  itemId = (ctx.db.prepare("SELECT id FROM request_items WHERE request_id = ?").get(r.id) as { id: string }).id;
});

beforeEach(async () => {
  const { resetRateLimits } = await import("@/lib/portal/ratelimit");
  resetRateLimits();
  session.current = null;
});

afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

describe("Routes client (liens)", () => {
  it("parcours complet intention → envoi → validation par les routes HTTP", async () => {
    const intentRoute = await import("@/app/api/portal/[token]/upload-intent/route");
    const putRoute = await import("@/app/api/portal/uploads/[uploadToken]/route");
    const completeRoute = await import("@/app/api/portal/[token]/complete/route");
    const content = pdf("route");

    const intentRes = await intentRoute.POST(
      new Request("http://t/x", { method: "POST", body: JSON.stringify({ itemId, fileName: "permis.pdf", size: content.length }) }),
      params({ token }),
    );
    expect(intentRes.status).toBe(200);
    const intent = (await json(intentRes)) as { uploadId: string; uploadUrl: string };
    expect(intent.uploadUrl).toMatch(/^\/api\/portal\/uploads\/[A-Za-z0-9_-]{43}$/);
    const uploadToken = intent.uploadUrl.split("/").pop()!;

    const putRes = await putRoute.PUT(new Request("http://t/x", { method: "PUT", body: content }), params({ uploadToken }));
    expect(putRes.status).toBe(200);

    const doneRes = await completeRoute.POST(
      new Request("http://t/x", { method: "POST", body: JSON.stringify({ uploadId: intent.uploadId }) }),
      params({ token }),
    );
    expect(doneRes.status).toBe(200);
    expect((ctx.db.prepare("SELECT state FROM request_items WHERE id = ?").get(itemId) as { state: string }).state).toBe("received");
  });

  it("toutes les réponses sont privées : pas de cache, pas d'indexation, pas de Referer", async () => {
    const { POST } = await import("@/app/api/portal/[token]/upload-intent/route");
    const res = await POST(new Request("http://t/x", { method: "POST", body: "{}" }), params({ token: "invalide" }));
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect(res.headers.get("x-robots-tag")).toContain("noindex");
    expect(res.headers.get("referrer-policy")).toBe("no-referrer");
  });

  it("un lien inventé ou mal formé est refusé (404) sans révéler quoi que ce soit", async () => {
    const { POST } = await import("@/app/api/portal/[token]/upload-intent/route");
    const { newToken } = await import("@/lib/portal/ids");
    for (const t of [newToken(), "abc", "../../etc/passwd"]) {
      const res = await POST(new Request("http://t/x", { method: "POST", body: JSON.stringify({ itemId, fileName: "a.pdf", size: 10 }) }), params({ token: t }));
      expect(res.status).toBe(404);
      expect((await json(res)).code).toBe("invalid_link");
    }
  });

  it("un envoi avec une autorisation inventée est refusé", async () => {
    const { PUT } = await import("@/app/api/portal/uploads/[uploadToken]/route");
    const { newToken } = await import("@/lib/portal/ids");
    const res = await PUT(new Request("http://t/x", { method: "PUT", body: pdf() }), params({ uploadToken: newToken() }));
    expect(res.status).toBe(404);
  });

  it("limite le débit des tentatives (429 après le seuil)", async () => {
    const { POST } = await import("@/app/api/portal/[token]/upload-intent/route");
    let last = 200;
    for (let i = 0; i < 45; i++) {
      const res = await POST(new Request("http://t/x", { method: "POST", body: "{}" }), params({ token: "x" }));
      last = res.status;
    }
    expect(last).toBe(429);
  });

  it("requête mal formée : 400, jamais une erreur serveur", async () => {
    const { POST } = await import("@/app/api/portal/[token]/upload-intent/route");
    const res = await POST(new Request("http://t/x", { method: "POST", body: "pas du json" }), params({ token }));
    expect(res.status).toBe(400);
  });
});

describe("Route de téléchargement (Julien uniquement)", () => {
  let fileId: string;
  beforeAll(() => {
    fileId = (ctx.db.prepare("SELECT id FROM files WHERE request_id = ?").get(requestId) as { id: string }).id;
  });

  it("refuse sans session (401)", async () => {
    const { GET } = await import("@/app/api/espace-pro/files/[id]/route");
    session.current = null;
    const res = await GET(new Request(`http://t/x?disposition=inline`), params({ id: fileId }));
    expect(res.status).toBe(401);
  });

  it("avec session : diffuse le fichier avec des en-têtes stricts, en téléchargement par défaut", async () => {
    const { GET } = await import("@/app/api/espace-pro/files/[id]/route");
    session.current = admin;
    const res = await GET(new Request("http://t/x"), params({ id: fileId }));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-disposition")).toMatch(/^attachment;/);
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect(res.headers.get("content-security-policy")).toContain("sandbox");
    expect(Buffer.from(await res.arrayBuffer()).toString()).toContain("%PDF-1.4");
  });

  it("aperçu intégré autorisé pour un PDF, avec le bac à sable", async () => {
    const { GET } = await import("@/app/api/espace-pro/files/[id]/route");
    session.current = admin;
    const res = await GET(new Request("http://t/x?disposition=inline"), params({ id: fileId }));
    expect(res.headers.get("content-disposition")).toMatch(/^inline;/);
    expect(res.headers.get("content-type")).toBe("application/pdf");
  });

  it("un fichier inexistant donne 404", async () => {
    const { GET } = await import("@/app/api/espace-pro/files/[id]/route");
    session.current = admin;
    const res = await GET(new Request("http://t/x"), params({ id: "00000000-0000-0000-0000-000000000000" }));
    expect(res.status).toBe(404);
  });
});

describe("Portail désactivé par défaut", () => {
  it("toutes les routes répondent 404 quand PORTAL_ENABLED n'est pas « true »", async () => {
    const { POST } = await import("@/app/api/portal/[token]/upload-intent/route");
    const { GET } = await import("@/app/api/espace-pro/files/[id]/route");
    process.env.PORTAL_ENABLED = "false";
    try {
      expect((await POST(new Request("http://t/x", { method: "POST", body: "{}" }), params({ token }))).status).toBe(404);
      session.current = admin;
      expect((await GET(new Request("http://t/x"), params({ id: "x" }))).status).toBe(404);
    } finally {
      process.env.PORTAL_ENABLED = "true";
    }
  });
});

describe("Notifications", () => {
  it("rien n'est envoyé par défaut (désactivé)", async () => {
    const { deliverOutbox } = await import("@/lib/portal/notify");
    const send = vi.fn();
    delete process.env.PORTAL_NOTIFY_ENABLED;
    const r = await deliverOutbox(ctx, send);
    expect(r.skipped).toBe(true);
    expect(send).not.toHaveBeenCalled();
  });

  it("activées : un message générique, sans nom de client ni document, uniquement vers l'adresse de Julien", async () => {
    const { deliverOutbox } = await import("@/lib/portal/notify");
    ctx.db.prepare("INSERT INTO outbox(id, kind, request_ref, created_at) VALUES (?,?,?,?)").run("o1", "request_complete", requestId, new Date().toISOString());
    process.env.PORTAL_NOTIFY_ENABLED = "true";
    process.env.PORTAL_NOTIFY_TO = "julien@example.invalid";
    try {
      const sent: { to: string; subject: string; text: string }[] = [];
      const r = await deliverOutbox(ctx, async (m) => void sent.push(m));
      expect(r.sent).toBeGreaterThanOrEqual(1);
      expect(sent[0].to).toBe("julien@example.invalid");
      expect(sent[0].text).not.toMatch(/Fictif|Permis|\.pdf|documents\//i);
      expect(sent[0].text).toContain("/espace-pro/dossiers/");
      // marqué comme envoyé : aucun doublon
      const again = vi.fn();
      await deliverOutbox(ctx, again);
      expect(again).not.toHaveBeenCalled();
    } finally {
      delete process.env.PORTAL_NOTIFY_ENABLED;
      delete process.env.PORTAL_NOTIFY_TO;
    }
  });

  it("un échec d'envoi n'interrompt rien et est consigné sans donnée sensible", async () => {
    const { deliverOutbox } = await import("@/lib/portal/notify");
    ctx.db.prepare("INSERT INTO outbox(id, kind, request_ref, created_at) VALUES (?,?,?,?)").run("o2", "request_complete", requestId, new Date().toISOString());
    process.env.PORTAL_NOTIFY_ENABLED = "true";
    process.env.PORTAL_NOTIFY_TO = "julien@example.invalid";
    try {
      await expect(deliverOutbox(ctx, async () => { throw new Error("service indisponible"); })).resolves.toBeDefined();
      expect((ctx.db.prepare("SELECT error FROM outbox WHERE id = 'o2'").get() as { error: string }).error).toContain("indisponible");
    } finally {
      delete process.env.PORTAL_NOTIFY_ENABLED;
      delete process.env.PORTAL_NOTIFY_TO;
    }
  });
});
