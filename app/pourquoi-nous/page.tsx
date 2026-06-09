import type { Metadata } from "next";
import OriasPill from "@/components/OriasPill";
import CtaBand from "@/components/CtaBand";
import { Person } from "@/components/Icons";
import { company, taglines } from "@/lib/company";

export const metadata: Metadata = {
  title: "Pourquoi nous choisir — Ruby Assur'",
  description:
    "Indépendance, conseil clair, proximité et accompagnement dans la durée : ce qui fait la différence Ruby Assur', courtier en assurances dans l'Aisne.",
};

const reasons = [
  {
    n: 1,
    title: "Indépendance",
    text: "Nous ne dépendons pas d'une seule compagnie. Notre rôle de courtier est de comparer pour vous orienter au mieux.",
  },
  {
    n: 2,
    title: "Conseil clair",
    text: "Pas de jargon inutile. On vous explique ce qui est couvert, et ce qui ne l'est pas.",
  },
  {
    n: 3,
    title: "Proximité",
    text: "Un interlocuteur local, disponible et à l'écoute, dans l'Aisne et alentours.",
  },
  {
    n: 4,
    title: "Accompagnement dans la durée",
    text: "De la souscription au suivi, nous restons à vos côtés à chaque étape.",
  },
  {
    n: 5,
    title: "Transparence & conformité",
    text: "Courtier inscrit à l'ORIAS, sans maniement de fonds. Vous savez à qui vous avez affaire.",
  },
];

export default function PourquoiNous() {
  return (
    <section className="block">
      <div className="wrap">
        <span className="eyebrow">Pourquoi nous choisir</span>
        <h2 className="sec-title">Ce qui fait la différence Ruby Assur&apos;</h2>

        <div className="why-grid" style={{ marginTop: 46 }}>
          <div>
            <div className="why-list">
              {reasons.map((r) => (
                <div className="why-item" key={r.n}>
                  <div className="num">{r.n}</div>
                  <div>
                    <h4>{r.title}</h4>
                    <p>{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="why-aside">
            <div className="quote">« {taglines.primary} »</div>
            <div className="sig">
              <div className="av">
                <Person size={22} />
              </div>
              <div>
                <b>{company.president}</b>
                <span>Fondateur, Ruby Assur&apos;</span>
              </div>
            </div>
            <div style={{ marginTop: 28 }}>
              <OriasPill long />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 56 }}>
          <CtaBand
            title="Prêt à être bien accompagné ?"
            text="Faites le premier pas — c'est sans engagement."
          />
        </div>
      </div>
    </section>
  );
}
