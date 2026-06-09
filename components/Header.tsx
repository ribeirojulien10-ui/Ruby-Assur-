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
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Ruby Assur' — Accueil"><Logo /></Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-navy/70 transition hover:text-navy">{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-sm font-semibold text-navy">
            <Phone className="h-4 w-4 text-gold" />{phone.replace(/(\d{2})(?=\d)/g, "$1 ").trim()}
          </a>
          <Link href="/contact" className="btn-primary text-xs px-4 py-2">Demander un devis</Link>
          <BookingButton label="Prendre RDV" className="text-xs px-4 py-2" />
        </div>
        <button className="lg:hidden p-2 text-navy" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-off-gray bg-white px-4 py-4 lg:hidden">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2 text-sm font-medium text-navy" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/contact" className="btn-primary mt-3 w-full text-center" onClick={() => setOpen(false)}>Demander un devis</Link>
        </div>
      )}
    </header>
  );
}
