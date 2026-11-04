/**
 * Limiteur de débit en mémoire (fenêtre glissante simple).
 * ⚠️ Valable pour un seul processus (développement / démonstration). En production sur Vercel,
 * chaque instance a sa propre mémoire : il faut un compteur partagé (ex. Upstash Redis, Vercel KV).
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  return true;
}

export const resetRateLimits = () => hits.clear();

export function clientIp(headers: Headers): string {
  return (headers.get("x-forwarded-for") ?? headers.get("x-real-ip") ?? "local").split(",")[0].trim();
}
