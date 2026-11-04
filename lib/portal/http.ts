import { NextResponse } from "next/server";
import { portalEnabled } from "./config";
import { clientIp, rateLimit } from "./ratelimit";
import { PortalError } from "./types";

/** En-têtes communs : jamais de cache, jamais d'indexation, pas de fuite du lien via le Referer. */
export const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

const MESSAGES: Record<PortalError["code"], [number, string]> = {
  unauthorized: [401, "Authentification requise."],
  not_found: [404, "Élément introuvable."],
  invalid_link: [404, "Ce lien n'est pas valide."],
  expired_link: [410, "Ce lien a expiré."],
  revoked_link: [410, "Ce lien n'est plus actif."],
  closed: [410, "Ce dossier est clôturé."],
  forbidden_format: [415, "Format de fichier non accepté."],
  too_large: [413, "Le fichier est trop volumineux."],
  too_many_files: [409, "Le nombre maximal de fichiers pour cette pièce est atteint."],
  bad_upload: [400, "L'envoi a échoué, veuillez réessayer."],
  infected: [422, "Ce fichier a été refusé par l'analyse de sécurité."],
  rate_limited: [429, "Trop de tentatives. Patientez quelques instants."],
  invalid_input: [400, "Demande invalide."],
  conflict: [409, "Action impossible dans l'état actuel du dossier."],
};

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: PRIVATE_HEADERS });
}

/** Transforme toute erreur en réponse sûre : aucun détail interne, aucun contenu de document. */
export function failure(e: unknown) {
  if (e instanceof PortalError) {
    const [status, msg] = MESSAGES[e.code];
    // Les messages de PortalError sont rédigés en français pour l'utilisateur ; sinon message générique.
    const detail = e.message && e.message !== e.code ? e.message : msg;
    return json({ error: detail, code: e.code }, status);
  }
  console.error("[portail] erreur inattendue:", (e as Error)?.name); // jamais le contenu de la requête
  return json({ error: "Une erreur est survenue. Réessayez dans un instant.", code: "internal" }, 500);
}

export function gate(): NextResponse | null {
  return portalEnabled() ? null : new NextResponse(null, { status: 404 });
}

/** Limitation de débit par adresse IP et par route (valable pour un seul processus : voir ratelimit.ts). */
export function limit(req: Request, bucket: string, max: number, windowMs = 60_000): NextResponse | null {
  if (!rateLimit(`${bucket}:${clientIp(req.headers)}`, max, windowMs)) {
    return json({ error: MESSAGES.rate_limited[1], code: "rate_limited" }, 429);
  }
  return null;
}
