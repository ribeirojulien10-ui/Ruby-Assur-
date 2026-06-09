import type { Metadata } from "next";
import { legalInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de Ruby Assur’, courtier en assurance à Pasly, RCS Soissons, ORIAS 24007878.",
};

const entries = [
  ["Nom", legalInfo.name],
  ["SIREN", legalInfo.siren],
  ["SIRET", legalInfo.siret],
  ["Forme juridique", legalInfo.legalForm],
  ["RCS", legalInfo.rcs],
  ["Adresse", legalInfo.address],
  ["Activité", legalInfo.activity],
  ["Code NAF / APE", legalInfo.naf],
  ["Président", legalInfo.president],
  ["ORIAS", legalInfo.orias],
  ["Statut", legalInfo.status],
  ["Capital social", legalInfo.capital],
  ["TVA", legalInfo.vat],
];

export default function LegalPage() {
  return (
    <section className="bg-white py-16">
      <div className="section-shell max-w-4xl">
        <p className="eyebrow">Cadre légal</p>
        <h1 className="mt-3 text-4xl font-semibold text-ruby-navy sm:text-5xl">Mentions légales</h1>
        <p className="mt-5 text-base leading-8 text-slate-700">
          Les informations ci-dessous identifient Ruby Assur’ et précisent le cadre de cette version locale du site.
        </p>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2">
          {entries.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-ruby-line bg-ruby-frost p-4">
              <dt className="text-sm font-semibold text-ruby-navy">{label}</dt>
              <dd className="mt-1 text-sm leading-6 text-slate-700">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 rounded-lg border border-ruby-line bg-ruby-sand p-5 text-sm leading-7 text-slate-700">
          <p>
            Les contenus du site sont fournis à titre informatif. Ils ne constituent pas une proposition contractuelle
            et ne remplacent pas une analyse personnalisée de votre situation par un courtier.
          </p>
        </div>
      </div>
    </section>
  );
}
