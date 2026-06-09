import Link from "next/link";
import Emblem from "./Emblem";
import { company, taglines } from "@/lib/company";

export default function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="name">
              <Emblem size={34} variant="ring" />
              Ruby Assur<span className="ap">&apos;</span>
            </div>
            <p>
              Courtier en assurances à Pasly et Soissons. {taglines.primary}
            </p>
          </div>

          <div className="foot-col">
            <h5>Navigation</h5>
            <Link href="/">Accueil</Link>
            <Link href="/nos-assurances">Nos assurances</Link>
            <Link href="/a-propos">À propos</Link>
            <Link href="/pourquoi-nous">Pourquoi nous</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="foot-col">
            <h5>Informations</h5>
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/reclamations">Réclamations</Link>
            <Link href="/confidentialite">Confidentialité</Link>
          </div>

          <div className="foot-col">
            <h5>Le cabinet</h5>
            <div className="foot-orias">
              {company.name} — SASU
              <br />
              {company.addressLine1}, {company.addressLine2}
              <br />
              SIREN {company.siren}
              <br />
              Courtier inscrit <strong>ORIAS n° {company.orias}</strong>
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          <span>
            © {new Date().getFullYear()} Ruby Assur&apos;. Tous droits réservés.
          </span>
          <span>
            Courtier en assurance, sans maniement de fonds · Sous le contrôle de
            l&apos;ACPR
          </span>
        </div>
      </div>
    </footer>
  );
}
