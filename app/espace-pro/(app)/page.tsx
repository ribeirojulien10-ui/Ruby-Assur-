import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileSearch, FilePlus2, Inbox, Lock, RefreshCcw, CircleDashed } from "lucide-react";
import { Progress } from "@/components/portal/Progress";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { requireAdmin } from "@/lib/auth-guard";
import { dashboard } from "@/lib/portal/admin";
import { defaultContext } from "@/lib/portal/context";
import { get } from "@/lib/portal/db";
import { ACTOR_LABEL, EVENT_LABEL, fmtDateTime } from "@/lib/portal/ui";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const ctx = defaultContext();
  const d = dashboard(ctx, admin);
  const demo = (get<{ c: number }>(ctx.db, "SELECT COUNT(*) c FROM requests WHERE is_demo = 1")?.c ?? 0) > 0;

  const cards = [
    { href: "/espace-pro/dossiers?status=incomplete", n: d.counts.incomplete, label: "En attente du client", hint: "Pièces ou informations manquantes", icon: CircleDashed },
    { href: "/espace-pro/dossiers?status=complete", n: d.counts.complete, label: "En cours", hint: "Pièces reçues, envoi pas encore confirmé", icon: Inbox },
    { href: "/espace-pro/dossiers?status=to_review", n: d.counts.to_review, label: "À examiner", hint: "Envoi confirmé par le client", icon: FileSearch },
    { href: "/espace-pro/dossiers?missing=1", n: d.counts.toReplace, label: "Documents à remplacer", hint: "En attente du client", icon: RefreshCcw },
    { href: "/espace-pro/dossiers?status=closed", n: d.counts.closed, label: "Terminés", hint: "Dossiers clôturés", icon: Lock },
  ];

  return (
    <>
      {demo && (
        <p role="note" className="mb-6 rounded-md bg-warn-soft px-4 py-3 text-[0.9rem] text-warn">
          <strong>Mode démonstration :</strong> les dossiers « Démo — … » sont entièrement fictifs (aucune donnée réelle).
        </p>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Tableau de bord</p>
          <h1 className="display mt-3 text-display-md text-night">Ce qui demande <em>votre attention</em>.</h1>
        </div>
        <Link href="/espace-pro/dossiers/nouveau" className="btn-primary"><FilePlus2 className="h-4 w-4" aria-hidden="true" /> Nouvelle demande</Link>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(({ href, n, label, hint, icon: Icon }) => (
          <li key={label}>
            <Link href={href} className="group flex h-full flex-col rounded-lg bg-white p-5 shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
              <Icon className="h-5 w-5 text-champagne-deep" aria-hidden="true" />
              <span className="display mt-4 text-[2.6rem] leading-none text-night">{n}</span>
              <span className="mt-2 text-[0.95rem] font-semibold text-night">{label}</span>
              <span className="mt-0.5 text-[0.8rem] text-ink-muted">{hint}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-8" aria-labelledby="attention">
          <h2 id="attention" className="display text-display-sm text-night">À traiter en priorité</h2>
          {d.attention.length === 0 ? (
            <p className="mt-4 rounded-lg bg-white p-6 text-ink-muted shadow-card">Rien à examiner pour le moment.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-lg bg-white shadow-card">
              {d.attention.map((r) => (
                <li key={r.id}>
                  <Link href={`/espace-pro/dossiers/${r.id}`} className="grid gap-3 p-5 transition hover:bg-ivory-soft sm:grid-cols-[1.4fr_1fr_auto] sm:items-center">
                    <span>
                      <span className="block font-semibold text-night">{r.clientName}</span>
                      <span className="text-[0.85rem] text-ink-muted">{r.insuranceName}</span>
                    </span>
                    <Progress done={r.received} total={r.expected} compact />
                    <span className="flex items-center gap-3">
                      <StatusBadge status={r.status} />
                      <ArrowRight className="h-4 w-4 text-champagne-deep" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="lg:col-span-4" aria-labelledby="activite">
          <h2 id="activite" className="display text-display-sm text-night">Dernière activité</h2>
          <ol className="mt-4 space-y-0 rounded-lg bg-white p-2 shadow-card">
            {d.activity.length === 0 && <li className="p-4 text-ink-muted">Aucune activité.</li>}
            {d.activity.map((e) => (
              <li key={e.id}>
                <Link href={`/espace-pro/dossiers/${e.requestId}`} className="block rounded-md p-3 transition hover:bg-ivory-soft">
                  <span className="block text-[0.9rem] font-medium text-night">{EVENT_LABEL[e.type] ?? e.type}</span>
                  <span className="block text-[0.8rem] text-ink-muted">{e.clientName} · {ACTOR_LABEL[e.actor] ?? e.actor} · {fmtDateTime(e.at)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
