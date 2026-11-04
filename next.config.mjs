/** @type {import('next').NextConfig} */

// Pas de CSP pour l'instant : Cal.com, chatbot, WhatsApp et Google Ads
// nécessitent un audit des domaines tiers avant activation.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// Zones privées du portail : jamais de cache, jamais d'indexation, le lien client n'est pas transmis via le Referer.
const privateHeaders = [
  { key: "Cache-Control", value: "private, no-store, max-age=0" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  { key: "Referrer-Policy", value: "no-referrer" },
];

const nextConfig = {
  reactStrictMode: true,
  agentRules: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/documents/:path*", headers: privateHeaders },
      { source: "/espace-pro/:path*", headers: privateHeaders },
      { source: "/espace-pro", headers: privateHeaders },
      { source: "/api/portal/:path*", headers: privateHeaders },
      { source: "/api/espace-pro/:path*", headers: privateHeaders },
      { source: "/api/auth/:path*", headers: privateHeaders },
    ];
  },
  // Pages doublons non liées dans le site : redirigées vers leur version à jour
  // (évite le contenu dupliqué et l'affichage de textes brouillon / de l'adresse).
  async redirects() {
    return [
      { source: "/confidentialite", destination: "/politique-confidentialite", permanent: true },
      { source: "/pourquoi-nous", destination: "/pourquoi-choisir-ruby-assur", permanent: true },
      { source: "/nos-assurances", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;
