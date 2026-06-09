import type { Metadata } from "next";
import Link from "next/link";
import Emblem from "@/components/Emblem";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "À propos — Ruby Assur'",
  description:
    "Ruby Assur', cabinet de courtage en assurances à Pasly (Aisne), dirigé par Julien Ribeiro. Un partenaire de confiance pour les particuliers et les professionnels.",
};

export default function APropos() {
  return (
    <section className="block">
      <div className="wrap">
        <span className="eyebrow">À propos</span>
        <h2 className="sec-title" style={{ maxWidth: "18ch" }}>
          Le courtage assurance, à hauteur d&apos;humain
        </h2>

        <div className="about-grid" style={{ marginTop: 46 }}>
          <div className="about-card">
            <Emblem size={120} variant="ring" className="emblem" />
            <h3>Ruby Assur&apos;</h3>
            <p style={{ color: "rgba(245,239,230,.78)", fontSize: ".96rem" }}>
              Cabinet de courtage en assurances basé à Pasly, dans
              l&apos;Aisne.
            </p>
            <div className="meta">
              <div>
                <span>Dirigeant</span>
                <b>{company.president}</b>
              </div>
              <div>
                <span>Forme</span>
                <b>SASU</b>
              </div>
              <div>
                <span>Implantation</span>
                <b>Pasly · Soissons</b>
              </div>
              <div>
                <span>ORIAS</span>
                <b>n° {company.orias}</b>
              </div>
            </div>
          </div>

          <div className="prose-block">
            <p>
              Ruby Assur&apos; est née d&apos;une conviction simple :{" "}
              <strong>l&apos;assurance ne devrait pas être un casse-tête.</strong>{" "}
              Trop souvent, on souscrit un contrat sans bien comprendre ce
              qu&apos;il couvre — ou ce qu&apos;il ne couvre pas.
            </p>
            <p>
              En tant que <strong>courtier indépendant</strong>, notre métier
              est d&apos;être de votre côté. Nous comparons les solutions, nous
              traduisons le jargon, et nous vous aidons à choisir une couverture
              qui correspond réellement à votre situation, personnelle comme
              professionnelle.
            </p>
            <p>
              Le samoyède de notre logo n&apos;est pas un hasard : réputé pour sa{" "}
              <strong>fidélité</strong> et son tempérament protecteur, il incarne
              ce que nous voulons être pour nos clients — un partenaire de
              confiance, présent dans la durée.
            </p>
            <p>
              Implantés à Pasly, près de Soissons, nous accompagnons les
              particuliers et les professionnels de l&apos;Aisne, avec la
              proximité et la disponibilité d&apos;un interlocuteur local.
            </p>
            <Link
              href="/contact"
              className="btn btn-primary"
              style={{ marginTop: 10 }}
            >
              Faire connaissance
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
