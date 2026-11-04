"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { ADS_ID, CONSENT_KEY, OPEN_CONSENT_EVENT } from "@/lib/ads";

type Choice = "granted" | "denied" | null;

function readChoice(): Choice {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

// Supprime les cookies Google (publicité / mesure) déposés si l'internaute retire son accord.
function clearGoogleCookies() {
  const names = document.cookie.split(";").map((c) => c.split("=")[0].trim());
  const host = window.location.hostname;
  const domains = [host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  names
    .filter((n) => /^(_gcl|_ga|_gac|_gid|IDE|test_cookie)/.test(n))
    .forEach((n) =>
      domains.forEach((d) => {
        document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
      }),
    );
}

/**
 * Balise Google Ads soumise au consentement (CNIL) :
 *  - AUCUN script Google n'est chargé tant que l'internaute n'a pas accepté ;
 *  - « Refuser » est aussi simple et visible que « Accepter » ;
 *  - le choix est modifiable à tout moment (lien « Gérer les cookies » du pied de page).
 */
export function GoogleTag() {
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const c = readChoice();
    setChoice(c);
    setOpen(c === null);
    setReady(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  function decide(value: "granted" | "denied") {
    const previous = choice;
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* stockage indisponible : le choix vaut pour la session */
    }
    setChoice(value);
    setOpen(false);
    if (value === "denied" && previous === "granted") {
      clearGoogleCookies();
      window.location.reload(); // décharge la balise déjà chargée
    }
  }

  return (
    <>
      {ready && choice === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`} strategy="afterInteractive" />
          <Script id="google-ads-tag" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${ADS_ID}');
          `}</Script>
        </>
      )}

      {ready && open && (
        <div
          role="dialog"
          aria-label="Gestion des cookies"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-white/15 bg-navy p-5 text-white shadow-2xl sm:left-4 sm:right-auto sm:mx-0"
        >
          <p className="text-sm font-semibold">Cookies publicitaires</p>
          <p className="mt-2 text-xs leading-6 text-white/75">
            Avec votre accord, Ruby Assur&apos; utilise Google Ads pour mesurer l&apos;efficacité de ses annonces.
            La mesure d&apos;audience du site, elle, ne dépose aucun cookie. Vous pouvez changer d&apos;avis à tout moment.{" "}
            <a href="/politique-confidentialite" className="underline">En savoir plus</a>
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => decide("denied")}
              className="flex-1 rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-navy"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={() => decide("granted")}
              className="flex-1 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold-light"
            >
              Accepter
            </button>
          </div>
        </div>
      )}
    </>
  );
}
