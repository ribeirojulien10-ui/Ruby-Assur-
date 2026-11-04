"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { BookingButton } from "./BookingEmbed";
import { Logo } from "./Logo";

export interface NavMenu {
  key: string;
  label: string;
  href: string;
  allLabel: string;
  items: { href: string; label: string; hint: string }[];
}

const links = [
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

const fmtPhone = (p: string) => p.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

export function HeaderNav({ menus, phone }: { menus: NavMenu[]; phone: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLElement>(null);

  // Fermeture à chaque changement de page
  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Échap + clic extérieur
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  // Verrouille le défilement derrière le menu mobile
  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  const hoverOpen = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const hoverClose = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
    <header
      ref={root}
      className={`sticky top-0 z-50 border-b transition-[background,box-shadow,border-color] duration-300 ${
        scrolled || mobile ? "border-line bg-paper/92 shadow-hairline backdrop-blur-md" : "border-transparent bg-paper/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-[var(--header-h)] w-full max-w-page items-center justify-between gap-6 px-gutter">
        <Link href="/" aria-label="Ruby Assur' — Accueil" className="shrink-0 rounded-md">
          <Logo />
        </Link>

        {/* Navigation ordinateur */}
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {menus.map((m) => (
            <div key={m.key} className="relative" onMouseEnter={() => hoverOpen(m.key)} onMouseLeave={hoverClose}>
              <button
                type="button"
                aria-expanded={open === m.key}
                aria-haspopup="true"
                aria-controls={`menu-${m.key}`}
                onClick={() => setOpen(open === m.key ? null : m.key)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.95rem] font-medium transition hover:bg-night/5 ${
                  active(m.href) || open === m.key ? "text-night" : "text-ink-soft"
                }`}
              >
                {m.label}
                <ChevronDown className={`h-4 w-4 text-champagne-deep transition-transform duration-300 ${open === m.key ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {open === m.key && (
                <div
                  id={`menu-${m.key}`}
                  className="absolute left-1/2 top-full z-50 w-[36rem] -translate-x-1/2 pt-3 animate-menu-in"
                >
                  <div className="overflow-hidden rounded-lg bg-white shadow-lift ring-1 ring-night/10">
                    <ul className="grid grid-cols-2 gap-px bg-line">
                      {m.items.map((it) => (
                        <li key={it.href} className="bg-white">
                          <Link href={it.href} className="block h-full p-4 transition hover:bg-ivory-soft" onClick={() => setOpen(null)}>
                            <span className="block text-[0.95rem] font-semibold text-night">{it.label}</span>
                            <span className="mt-1 line-clamp-2 block text-[0.8rem] leading-5 text-ink-muted">{it.hint}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link href={m.href} className="flex items-center justify-between bg-ivory px-4 py-3 text-sm font-semibold text-night transition hover:bg-ivory-deep" onClick={() => setOpen(null)}>
                      {m.allLabel}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active(l.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-[0.95rem] font-medium transition hover:bg-night/5 ${active(l.href) ? "text-night" : "text-ink-soft"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${phone}`} className="flex items-center gap-2 text-[0.95rem] font-semibold text-night">
            <Phone className="h-4 w-4 text-champagne-deep" aria-hidden="true" />
            {fmtPhone(phone)}
          </a>
          <BookingButton label="Prendre RDV" className="btn-sm" />
          <Link href="/contact" className="btn-primary btn-sm">
            Demander un devis
          </Link>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full text-night transition hover:bg-night/5 lg:hidden"
          aria-label={mobile ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobile}
          aria-controls="menu-mobile"
          onClick={() => setMobile(!mobile)}
        >
          {mobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

    </header>

      {/* Tiroir mobile : une vraie page de navigation, pas un menu desktop réduit.
          Rendu HORS de l'en-tête : un parent avec backdrop-filter piégerait le positionnement fixe. */}
      {mobile && (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-[60] flex animate-fade flex-col overflow-y-auto bg-paper lg:hidden"
        >
          <nav aria-label="Navigation mobile" className="flex-1 px-gutter pb-6 pt-4">
            {menus.map((m) => (
              <details key={m.key} className="group border-b border-line" open={active(m.href)}>
                <summary className="flex cursor-pointer list-none items-center justify-between py-5">
                  <span className="display text-[1.6rem] text-night">{m.label}</span>
                  <ChevronDown className="h-5 w-5 text-champagne-deep transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <ul className="pb-4">
                  {m.items.map((it) => (
                    <li key={it.href}>
                      <Link href={it.href} className="flex items-center justify-between py-3 text-[1.02rem] text-ink-soft">
                        {it.label}
                        <ArrowRight className="h-4 w-4 text-champagne-deep" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href={m.href} className="link-arrow mt-2 py-2 text-sm">
                      {m.allLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </li>
                </ul>
              </details>
            ))}
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="display block border-b border-line py-5 text-[1.6rem] text-night">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="sticky bottom-0 grid gap-3 border-t border-line bg-paper px-gutter py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link href="/contact" className="btn-primary w-full">
              Demander un devis gratuit
            </Link>
            <a href={`tel:${phone}`} className="btn-outline w-full">
              <Phone className="h-4 w-4" aria-hidden="true" /> {fmtPhone(phone)}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
