import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/portal/PrintButton";
import { getClientView, resolveToken } from "@/lib/portal/client";
import { defaultContext } from "@/lib/portal/context";
import type { InfoField } from "@/lib/portal/types";

export const metadata: Metadata = { title: "Questionnaire à imprimer" };

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@rubyassur.fr";
const fmtPhone = (p: string) => p.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
const BLUE = "#1B3A73";

const Line = ({ rows = 1 }: { rows?: number }) => (
  <div className="mt-2 space-y-5" aria-hidden="true">
    {Array.from({ length: rows }).map((_, i) => <div key={i} className="h-5 border-b border-neutral-500" />)}
  </div>
);

function Blank({ f }: { f: InfoField }) {
  if (f.type === "choice")
    return (
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
        {(f.options ?? []).map((o) => (
          <span key={o} className="flex items-center gap-2 text-[0.95rem]"><span className="inline-block h-4 w-4 border border-neutral-700" aria-hidden="true" />{o}</span>
        ))}
      </div>
    );
  if (f.type === "persons") {
    const rows = (f.max ?? 8) === 1 ? 1 : 3;
    return (
      <div className="mt-2 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-[2fr_1fr] gap-6 text-[0.8rem] text-neutral-600">
            <div><div className="h-5 border-b border-neutral-500" />Nom et prénom</div>
            <div><div className="h-5 border-b border-neutral-500" />Date de naissance (jj/mm/aaaa)</div>
          </div>
        ))}
      </div>
    );
  }
  if (f.type === "date") return <p className="mt-2 text-neutral-500">____ / ____ / ________</p>;
  if (f.type === "textarea") return <Line rows={3} />;
  return <Line />;
}

export default async function PrintQuestionnairePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const ctx = defaultContext();
  if (resolveToken(ctx, token).state !== "ok") notFound();
  const view = getClientView(ctx, token);
  if (view.printFields.length === 0) notFound();

  return (
    <article className="mx-auto max-w-3xl bg-white p-6 text-black sm:p-10 print:p-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-[0.9rem] text-ink-muted">Imprimez cette page, remplissez-la à la main, puis envoyez-la en photo ou en scan depuis votre page de dépôt.</p>
        <PrintButton />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 pb-4" style={{ borderColor: BLUE }}>
        <div>
          <p className="display text-[1.9rem] leading-none" style={{ color: BLUE }}>RUBY <span className="italic">ASSUR</span></p>
          <p className="mt-2 text-[0.8rem] italic text-neutral-600">À vos côtés, comme un vrai compagnon.</p>
        </div>
        <div className="text-right text-[0.75rem] leading-5 text-neutral-600"><p>ORIAS 24007878</p><p>SIREN 933 756 074</p></div>
      </div>

      <h1 className="display mt-6 text-[1.6rem]" style={{ color: BLUE }}>Questionnaire — {view.title}</h1>
      <p className="mt-2 text-[0.9rem] text-neutral-700">
        Afin de faciliter l&apos;étude de votre demande, merci de compléter ce questionnaire. Les champs marqués d&apos;une étoile (*) sont obligatoires.
      </p>
      <p className="mt-3 text-[0.9rem]">Nom et prénom : <span className="inline-block w-72 border-b border-neutral-500 align-bottom">&nbsp;</span></p>

      <div className="mt-6 space-y-6">
        {view.printFields.map((f, i) => (
          <section key={f.key} className="break-inside-avoid">
            <p className="text-[0.95rem] font-semibold" style={{ color: BLUE }}>
              {i + 1}. {f.label}{f.unit ? ` (${f.unit})` : ""}{f.required ? " *" : ""}
            </p>
            <Blank f={f} />
          </section>
        ))}
      </div>

      <div className="mt-10 border-t-2 pt-4 text-[0.85rem] leading-6 text-neutral-700" style={{ borderColor: BLUE }}>
        <p>Une fois complété, envoyez ce questionnaire en photo ou en scan depuis votre page de dépôt sécurisée.</p>
        <p className="mt-1">Ruby Assur&apos; — {fmtPhone(phone)} — {email}</p>
        <p className="mt-1 text-[0.78rem] text-neutral-600">Les informations transmises servent uniquement à étudier votre demande d&apos;assurance.</p>
      </div>
    </article>
  );
}
