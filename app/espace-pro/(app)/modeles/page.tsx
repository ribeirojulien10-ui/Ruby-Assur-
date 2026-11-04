import type { Metadata } from "next";
import { TemplateEditor } from "@/components/portal/TemplateEditor";
import { requireAdmin } from "@/lib/auth-guard";
import { products } from "@/lib/products";
import { listTemplates } from "@/lib/portal/admin";
import { defaultContext } from "@/lib/portal/context";

export const metadata: Metadata = { title: "Modèles de documents" };

export default async function TemplatesPage() {
  const admin = await requireAdmin();
  const templates = listTemplates(defaultContext(), admin);
  const insurances = products.map((p) => ({ slug: p.slug, name: p.name }));
  return (
    <>
      <p className="eyebrow">Modèles</p>
      <h1 className="display mt-3 text-display-md text-night">Listes de documents par assurance.</h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        Chaque modèle pré-remplit une nouvelle demande. Modifiez-les sans toucher au code. Les modèles initiaux reprennent les pièces listées sur le site : ce sont des propositions à valider selon vos assureurs, pas des règles officielles.
      </p>
      <div className="mt-8 max-w-4xl space-y-3">
        {templates.map((t) => (
          <details key={t.id} className="group rounded-xl bg-white shadow-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
              <span>
                <span className="block font-semibold text-night">{t.name}</span>
                <span className="text-[0.82rem] text-ink-muted">{t.items.length} document(s) · {t.items.filter((i) => i.required).length} obligatoire(s){t.isDefault ? " · modèle initial" : ""}</span>
              </span>
              <span aria-hidden="true" className="text-champagne-deep transition group-open:rotate-180">▾</span>
            </summary>
            <div className="border-t border-line p-5"><TemplateEditor template={t} insurances={insurances} /></div>
          </details>
        ))}
        <details className="rounded-xl border border-dashed border-night/30 bg-white/60">
          <summary className="cursor-pointer list-none p-5 font-semibold text-night">+ Créer un nouveau modèle</summary>
          <div className="border-t border-line p-5"><TemplateEditor template={null} insurances={insurances} /></div>
        </details>
      </div>
    </>
  );
}
