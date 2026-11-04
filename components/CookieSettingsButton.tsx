"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/ads";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="block py-1 text-left text-sm text-white/70 transition hover:text-white"
    >
      Gérer les cookies
    </button>
  );
}
