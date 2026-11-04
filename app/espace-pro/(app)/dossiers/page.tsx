import type { Metadata } from "next";
import Link from "next/link";
import { FilePlus2, Search } from "lucide-react";
import { Progress } from "@/components/portal/Progress";
import { LinkBadge, StatusBadge } from "@/components/portal/StatusBadge";
import { requireAdmin } from "@/lib/auth-guard";
import { getProductBySlug, products } from "@/lib/products";
import { listRequests, type ListFilters } from "@/lib/portal/admin";
import { defaultContext } from "@/lib/portal/context";
import { STATUS_LABEL } from "@/lib/portal/rules";
import { fmtDate, fmtDateTime } from "@/lib/portal/ui";
import type { RequestStatus } from "@/lib/portal/types";

export const metadata: Metadata = { title: "Dossiers" };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function DossiersPage({ searchParams }: { searchParams: Promise<SP> }) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  const filters: ListFilters = {
    q: one(sp.q),
    insurance: one(sp.insurance),
    status: (one(sp.status) as RequestStatus | "open" | "") || "",
    missing: one(sp.missing) === "1",
    from: one(sp.from) || undefined,
    to: one(sp.to) || undefined,
  };
  const rows = listRequests(defaultContext(), admin, filters);
  const active = Object.values({ ...filters, missing: filters.missing || "" }).some(Boolean);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Dossiers</p>
          <h1 className="display mt-3 text-display-md text-night">Toutes les demandes</h1>
        </div>
        <Link href="/espace-pro/dossiers/nouveau" className="btn-primary"><FilePlus2 className="h-4 w-4" aria-hidden="true" /> Nouvelle demande</Link>
      </div>

      <form method="get" className="mt-6 grid gap-3 rounded-lg bg-white p-4 shadow-card sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto_auto]" role="search" aria-label="Filtrer les dossiers">
        <label className="relative sm:col-span-2 lg:col-span-1">
          <span className="sr-only">Rechercher un client</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          <input name="q" defaultValue={filters.q} placeholder="Rechercher un client…" className="field pl-10" />
        </label>
        <label>
          <span className="sr-only">Assurance</span>
          <select name="insurance" defaultValue={filters.insurance} className="field">
            <option value="">Toutes les assurances</option>
            {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Statut</span>
          <select name="status" defaultValue={filters.status} className="field">
            <option value="">Tous les statuts</option>
            <option value="open">En cours (hors terminés)</option>
            {(Object.keys(STATUS_LABEL) as RequestStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 px-2 text-[0.9rem] text-ink-soft">
          <input type="checkbox" name="missing" value="1" defaultChecked={filters.missing} className="h-4 w-4 accent-night" />
          Pièces manquantes
        </label>
        <div className="flex gap-2">
          <button className="btn-primary btn-sm flex-1">Filtrer</button>
          {active && <Link href="/espace-pro/dossiers" className="btn-outline btn-sm">Réinitialiser</Link>}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-5 lg:max-w-md">
          <label className="text-[0.8rem] text-ink-muted">Créés depuis le
            <input type="date" name="from" defaultValue={filters.from} className="field mt-1" />
          </label>
          <label className="text-[0.8rem] text-ink-muted">jusqu&apos;au
            <input type="date" name="to" defaultValue={filters.to} className="field mt-1" />
          </label>
        </div>
      </form>

      <p className="mt-6 text-[0.9rem] text-ink-muted" aria-live="polite">{rows.length} dossier{rows.length > 1 ? "s" : ""}</p>

      {rows.length === 0 ? (
        <p className="mt-3 rounded-lg bg-white p-8 text-center text-ink-muted shadow-card">Aucun dossier ne correspond à ces critères.</p>
      ) : (
        <>
          {/* Tableau (ordinateur) */}
          <div className="mt-3 hidden overflow-hidden rounded-lg bg-white shadow-card md:block">
            <table className="w-full text-left text-[0.92rem]">
              <thead className="bg-ivory text-[0.72rem] uppercase tracking-[0.14em] text-ink-muted">
                <tr>
                  {["Client", "Assurance", "Créé le", "Pièces", "Statut", "Dernière activité"].map((h) => <th key={h} scope="col" className="px-5 py-3 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.id} className="transition hover:bg-ivory-soft">
                    <td className="px-5 py-4">
                      <Link href={`/espace-pro/dossiers/${r.id}`} className="font-semibold text-night underline-offset-4 hover:underline">{r.clientName}</Link>
                      {r.linkState !== "active" && r.status !== "closed" && <span className="mt-1 block"><LinkBadge state={r.linkState} /></span>}
                    </td>
                    <td className="px-5 py-4 text-ink-soft">{getProductBySlug(r.insuranceSlug)?.name ?? r.insuranceName}</td>
                    <td className="px-5 py-4 text-ink-muted">{fmtDate(r.createdAt)}</td>
                    <td className="px-5 py-4"><Progress done={r.received} total={r.expected} compact /></td>
                    <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-4 text-ink-muted">{fmtDateTime(r.lastActivityAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cartes (mobile) */}
          <ul className="mt-3 space-y-3 md:hidden">
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={`/espace-pro/dossiers/${r.id}`} className="block rounded-lg bg-white p-5 shadow-card">
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-night">{r.clientName}</span>
                    <StatusBadge status={r.status} />
                  </span>
                  <span className="mt-1 block text-[0.88rem] text-ink-muted">{r.insuranceName} · {fmtDate(r.createdAt)}</span>
                  <span className="mt-3 block"><Progress done={r.received} total={r.expected} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
