"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PhoneCall, X } from "lucide-react";
import { useState } from "react";
import { brand, navLinks } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ruby-line bg-white/95 backdrop-blur">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-md" onClick={() => setOpen(false)}>
          <Image
            src="/images/samoyed-brand.png"
            alt="Logo Ruby Assur’ avec samoyède"
            width={52}
            height={52}
            className="h-12 w-12 rounded-full border border-ruby-line object-cover"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="text-lg font-semibold text-ruby-navy">{brand}</span>
            <span className="mt-1 text-xs text-slate-600">Courtier en assurances</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-ring rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive ? "bg-ruby-frost text-ruby-navy" : "text-slate-700 hover:bg-ruby-frost hover:text-ruby-navy"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ruby-navy px-4 text-sm font-semibold text-white transition hover:bg-ruby-ink"
          >
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            Demander un rappel
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md border border-ruby-line bg-white text-ruby-navy lg:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-ruby-line bg-white lg:hidden">
          <nav className="section-shell flex flex-col gap-2 py-4" aria-label="Navigation mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-md px-3 py-3 text-sm font-semibold text-ruby-navy hover:bg-ruby-frost"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="focus-ring mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ruby-navy px-4 text-sm font-semibold text-white"
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              Demander un rappel
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
