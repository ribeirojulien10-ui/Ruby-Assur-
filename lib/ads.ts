// Identifiant de la balise Google Ads (déjà utilisé par le site).
export const ADS_ID = "AW-18231437121";

// Clé de stockage du choix de l'internaute (cookies publicitaires).
export const CONSENT_KEY = "ruby-cookie-consent";
export const OPEN_CONSENT_EVENT = "ruby:open-consent";

type Gtag = (...args: unknown[]) => void;

/**
 * Enregistre une conversion Google Ads « demande de devis envoyée ».
 * Ne fait RIEN si :
 *  - NEXT_PUBLIC_GADS_QUOTE_LABEL n'est pas défini (étiquette de conversion à créer
 *    dans Google Ads par le propriétaire),
 *  - la balise n'est pas chargée (consentement non donné).
 * À appeler uniquement après la réponse OK du serveur (devis réellement envoyé).
 */
export function trackQuoteConversion(): void {
  const label = process.env.NEXT_PUBLIC_GADS_QUOTE_LABEL;
  if (!label || typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", "conversion", { send_to: `${ADS_ID}/${label}` });
}
