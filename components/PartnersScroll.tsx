/**
 * Compagnies comparées — liste existante du site, présentée en mots-symboles sobres et homogènes
 * (aucun logo officiel n'est utilisé : pas de faux partenariat suggéré par une charte graphique).
 */
const partners = ["AXA", "Generali", "Swiss Life", "CMAM", "Wakam", "Fidelidad", "April", "Solly Azar", "Zéphir"];

export function PartnersScroll() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {partners.map((name) => (
        <li key={name} className="display px-8 text-[1.35rem] text-night/55 transition-colors hover:text-night sm:px-12 sm:text-[1.6rem]">
          {name}
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Compagnies comparées" className="border-y border-line bg-paper py-8">
      <p className="eyebrow mb-5 text-center">Compagnies comparées</p>
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
