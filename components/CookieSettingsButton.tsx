"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/ads";

export function CookieSettingsButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className="text-left transition hover:text-white">
      Gérer les cookies
    </button>
  );
}
