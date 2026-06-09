"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Emblem from "./Emblem";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/nos-assurances", label: "Nos assurances" },
  { href: "/a-propos", label: "À propos" },
  { href: "/pourquoi-nous", label: "Pourquoi nous" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site">
      <div className="wrap nav">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Emblem size={42} variant="badge" className="mark" />
          <span className="name">
            Ruby Assur<span className="ap">&apos;</span>
          </span>
        </Link>

        <button
          className="burger"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="btn btn-gold"
            onClick={() => setOpen(false)}
          >
            Demander un devis
          </Link>
        </nav>
      </div>
    </header>
  );
}
