"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authReady, getAuth } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-guard";
import {
  addItem,
  closeRequest,
  createRequest,
  deleteRequestPermanently,
  deleteTemplate,
  getActiveLink,
  linkUrl,
  logReminder,
  regenerateLink,
  removeItem,
  reopenRequest,
  reviewItem,
  revokeLink,
  saveTemplate,
  setItemRequired,
  setLinkExpiry,
  type CreateRequestInput,
  type TemplateInput,
} from "@/lib/portal/admin";
import { portalEnabled } from "@/lib/portal/config";
import { defaultContext } from "@/lib/portal/context";
import { clientIp, rateLimit } from "@/lib/portal/ratelimit";
import { PortalError } from "@/lib/portal/types";

export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const MESSAGES: Partial<Record<PortalError["code"], string>> = {
  closed: "Ce dossier est clôturé.",
  not_found: "Élément introuvable.",
  conflict: "Action impossible dans l'état actuel du dossier.",
  revoked_link: "Le lien est révoqué : régénérez-le.",
};

function fail(e: unknown): { ok: false; error: string } {
  if (e instanceof PortalError) {
    if (e.code === "unauthorized") redirect("/espace-pro/connexion");
    return { ok: false, error: e.message !== e.code ? e.message : (MESSAGES[e.code] ?? "Demande invalide.") };
  }
  // Next utilise des exceptions pour redirect()/notFound() : on les laisse passer.
  if (e && typeof e === "object" && "digest" in e) throw e;
  console.error("[espace-pro] erreur inattendue:", (e as Error)?.name);
  return { ok: false, error: "Une erreur est survenue." };
}

// ───────────── Connexion / déconnexion ─────────────

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData): Promise<{ error?: string }> {
  if (!portalEnabled()) redirect("/");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const h = await headers();
  // Anti-force-brute : 5 tentatives / 10 min par adresse IP et par e-mail.
  if (!rateLimit(`login:${clientIp(h)}`, 8, 600_000) || !rateLimit(`login-mail:${email}`, 5, 600_000)) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }
  try {
    await authReady();
    await getAuth().api.signInEmail({ body: { email, password }, headers: h });
  } catch {
    return { error: "Identifiants incorrects." }; // message volontairement identique, sans détail
  }
  redirect("/espace-pro");
}

export async function logoutAction() {
  await authReady();
  await getAuth().api.signOut({ headers: await headers() }).catch(() => undefined);
  redirect("/espace-pro/connexion");
}

// ───────────── Demandes ─────────────

export async function createRequestAction(payload: CreateRequestInput): Promise<ActionResult<{ id: string; link: string }>> {
  const admin = await requireAdmin();
  try {
    const ctx = defaultContext();
    const { id, token } = createRequest(ctx, admin, payload);
    revalidatePath("/espace-pro", "layout");
    return { ok: true, id, link: linkUrl(ctx, token) };
  } catch (e) {
    return fail(e);
  }
}

export async function regenerateLinkAction(requestId: string, ttlDays: number): Promise<ActionResult<{ link: string }>> {
  const admin = await requireAdmin();
  try {
    const ctx = defaultContext();
    const token = regenerateLink(ctx, admin, requestId, ttlDays);
    revalidatePath(`/espace-pro/dossiers/${requestId}`);
    return { ok: true, link: linkUrl(ctx, token) };
  } catch (e) {
    return fail(e);
  }
}

export async function revealLinkAction(requestId: string): Promise<ActionResult<{ link: string | null }>> {
  const admin = await requireAdmin();
  try {
    return { ok: true, link: getActiveLink(defaultContext(), admin, requestId) };
  } catch (e) {
    return fail(e);
  }
}

export async function revokeLinkAction(requestId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    revokeLink(defaultContext(), admin, requestId);
    revalidatePath(`/espace-pro/dossiers/${requestId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function extendLinkAction(requestId: string, days: number): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    setLinkExpiry(defaultContext(), admin, requestId, days);
    revalidatePath(`/espace-pro/dossiers/${requestId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function reviewItemAction(
  requestId: string,
  itemId: string,
  decision: "validate" | "replace",
  reason?: string,
  note?: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    reviewItem(defaultContext(), admin, itemId, decision, { reason, note });
    revalidatePath("/espace-pro", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function addItemAction(requestId: string, label: string, required: boolean, instructions: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    addItem(defaultContext(), admin, requestId, { label, required, instructions });
    revalidatePath(`/espace-pro/dossiers/${requestId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function removeItemAction(requestId: string, itemId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    await removeItem(defaultContext(), admin, itemId);
    revalidatePath(`/espace-pro/dossiers/${requestId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function setItemRequiredAction(requestId: string, itemId: string, required: boolean): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    setItemRequired(defaultContext(), admin, itemId, required);
    revalidatePath(`/espace-pro/dossiers/${requestId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function closeRequestAction(requestId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    closeRequest(defaultContext(), admin, requestId);
    revalidatePath("/espace-pro", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function reopenRequestAction(requestId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    reopenRequest(defaultContext(), admin, requestId);
    revalidatePath("/espace-pro", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function logReminderAction(requestId: string, channel: "copie" | "email" | "whatsapp"): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    logReminder(defaultContext(), admin, requestId, channel);
    revalidatePath(`/espace-pro/dossiers/${requestId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteRequestAction(requestId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    await deleteRequestPermanently(defaultContext(), admin, requestId);
    revalidatePath("/espace-pro", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ───────────── Modèles ─────────────

export async function saveTemplateAction(payload: TemplateInput): Promise<ActionResult<{ id: string }>> {
  const admin = await requireAdmin();
  try {
    const id = saveTemplate(defaultContext(), admin, payload);
    revalidatePath("/espace-pro/modeles");
    revalidatePath("/espace-pro/dossiers/nouveau");
    return { ok: true, id };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteTemplateAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    deleteTemplate(defaultContext(), admin, id);
    revalidatePath("/espace-pro/modeles");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
