"use client";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { BookingButton } from "./BookingEmbed";
import { Phone, Menu, X } from "lucide-react";

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/particuliers", label: "Particuliers" },
  { href: "/professionnels", label: "Professionnels" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-off-gray bg-white/95 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Ruby Assur' — Accueil"><Logo /></Link>
        <nav className="hidden items-center gap-4 lg:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-navy/70 transition hover:text-navy">{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-xs font-semibold text-navy lg:text-sm">
            <Phone className="h-4 w-4 shrink-0 text-gold" />
            <span className="hidden xl:inline">{phone.replace(/(\d{2})(?=\d)/g, "$1 ").trim()}</span>
            <span className="xl:hidden">{phone}</span>
          </a>
          <Link href="/contact" className="btn-primary text-xs px-3 py-2">Demander un devis</Link>
          <BookingButton label="Prendre RDV" className="text-xs px-3 py-2" />
        </div>
        <button className="md:hidden p-2 text-navy" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-off-gray bg-white px-4 py-4 lg:hidden">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2 text-sm font-medium text-navy" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/contact" className="btn-primary mt-3 w-full text-center" onClick={() => setOpen(false)}>Demander un devis</Link>
          <div className="mt-2"><BookingButton label="Prendre RDV" className="w-full justify-center" /></div>
        </div>
      )}
    </header>
  );
}
