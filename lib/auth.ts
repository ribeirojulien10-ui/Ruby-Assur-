import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { nextCookies } from "better-auth/next-js";
import { getDb } from "@/lib/portal/db";

/**
 * Authentification de Julien (espace professionnel) — Better Auth, bibliothèque dédiée et éprouvée.
 *  - pas de mot de passe codé en dur : les comptes sont créés par script, mots de passe hachés (scrypt) par la bibliothèque ;
 *  - inscription publique DÉSACTIVÉE (seul le script de création de compte peut ouvrir un compte) ;
 *  - sessions courtes (8 h), cookies httpOnly, SameSite strict, « Secure » en production ;
 *  - liste blanche d'e-mails autorisés (PORTAL_ADMIN_EMAILS) vérifiée en plus de la session.
 * Avant la production : activer l'authentification à deux facteurs (plugin TOTP de Better Auth).
 */
export function buildAuth(opts: { allowSignUp?: boolean } = {}) {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("BETTER_AUTH_SECRET manquant ou trop court (32 caractères minimum).");
  return betterAuth({
    database: getDb(),
    secret,
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    emailAndPassword: {
      enabled: true,
      disableSignUp: !opts.allowSignUp,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    session: { expiresIn: 60 * 60 * 8, updateAge: 60 * 30 },
    rateLimit: { enabled: true, window: 60, max: 20 },
    advanced: {
      useSecureCookies: process.env.NODE_ENV === "production",
      defaultCookieAttributes: { sameSite: "strict", httpOnly: true },
    },
    plugins: [nextCookies()],
  });
}

type Auth = ReturnType<typeof buildAuth>;
const g = globalThis as unknown as { __rubyAuth?: Auth; __rubyAuthReady?: Promise<void> };

export function getAuth(): Auth {
  if (!g.__rubyAuth) g.__rubyAuth = buildAuth();
  return g.__rubyAuth;
}

/** Crée les tables d'authentification si besoin (idempotent). */
export function authReady(): Promise<void> {
  if (!g.__rubyAuthReady) {
    g.__rubyAuthReady = (async () => {
      const { runMigrations } = await getMigrations(getAuth().options);
      await runMigrations();
    })();
  }
  return g.__rubyAuthReady;
}
