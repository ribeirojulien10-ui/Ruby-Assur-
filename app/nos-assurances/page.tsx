import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import {
  Car,
  House,
  HeartPulse,
  Clock,
  Doc,
  Coins,
  Briefcase,
  Building,
  ShieldCheck,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Nos assurances — Ruby Assur'",
  description:
    "Auto, habitation, santé, prévoyance, emprunteur, professionnelle, multirisque pro, RC pro : Ruby Assur' compare et conseille selon votre situation.",
};

const particuliers = [
  {
    icon: <Car />,
    title: "Assurance auto",
    text: "Une couverture ajustée à votre véhicule et à votre usage, au tiers comme tous risques.",
  },
  {
    icon: <House />,
    title: "Assurance habitation",
    text: "Pour votre logement et vos biens, que vous soyez locataire ou propriétaire.",
  },
  {
    icon: <HeartPulse />,
    title: "Santé & mutuelle",
    text: "Une complémentaire santé pensée pour vous et votre famille.",
  },
  {
    icon: <Clock />,
    title: "Prévoyance",
    text: "Anticiper les aléas de la vie pour protéger vos proches et vos revenus.",
  },
  {
    icon: <Doc />,
    title: "Assurance emprunteur",
    text: "Pour sécuriser votre crédit immobilier ou professionnel.",
  },
  {
    icon: <Coins />,
    title: "Autres besoins",
    text: "Un besoin spécifique ? Parlons-en, nous étudions votre situation.",
  },
];

const pros = [
  {
    icon: <Briefcase />,
    title: "Assurance professionnelle",
    text: "Des couvertures pour accompagner votre activité au quotidien.",
  },
  {
    icon: <Building />,
    title: "Multirisque professionnelle",
    text: "Protéger vos locaux, votre matériel et votre exploitation.",
  },
  {
    icon: <ShieldCheck />,
    title: "Responsabilité civile pro.",
    text: "Couvrir les dommages causés dans le cadre de votre activité.",
  },
];

export default function NosAssurances() {
  return (
    <section className="block">
      <div className="wrap">
        <span className="eyebrow">Nos assurances</span>
        <h2 className="sec-title">Des solutions pour chaque besoin</h2>
        <p className="sec-intro">
          Ruby Assur&apos; est un cabinet de courtage : nous ne vendons pas un
          produit unique, nous comparons et conseillons selon votre situation.
          Voici les domaines sur lesquels nous pouvons vous accompagner.
        </p>

        <h3
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 500,
            margin: "46px 0 0",
            fontSize: "1.4rem",
          }}
        >
          Particuliers
        </h3>
        <div className="grid-services">
          {particuliers.map((s) => (
            <div className="scard" key={s.title}>
              <div className="ico">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>

        <h3
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 500,
            margin: "56px 0 0",
            fontSize: "1.4rem",
          }}
        >
          Professionnels
        </h3>
        <div className="grid-services">
          {pros.map((s) => (
            <div className="scard" key={s.title}>
              <div className="ico">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: 30,
            fontSize: ".88rem",
            color: "var(--muted)",
            fontStyle: "italic",
          }}
        >
          Les garanties, plafonds et conditions varient selon les contrats et
          votre profil. Ruby Assur&apos; vous présente les solutions adaptées et
          vous remet les documents contractuels correspondants.
        </p>

        <div style={{ marginTop: 46 }}>
          <CtaBand
            title="Besoin d'un devis sur mesure ?"
            text="Dites-nous ce que vous cherchez à couvrir, nous revenons vers vous avec des solutions claires."
          />
        </div>
      </div>
    </section>
  );
}
