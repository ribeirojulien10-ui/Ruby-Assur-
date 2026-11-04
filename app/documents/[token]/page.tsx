import type { Metadata } from "next";
import { CircleAlert, Clock3, ShieldCheck } from "lucide-react";
import { ClientPortal } from "@/components/portal/ClientPortal";
import { getClientView, resolveToken } from "@/lib/portal/client";
import { defaultContext } from "@/lib/portal/context";

export const metadata: Metadata = { title: "Votre dossier" };

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";
const fmtPhone = (p: string) => p.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

function Notice({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-8 text-center shadow-card sm:p-12">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-night text-champagne" aria-hidden="true">{icon}</span>
      <h1 className="display mt-6 text-display-sm text-night">{title}</h1>
      <div className="mx-auto mt-3 max-w-md text-[1rem] leading-7 text-ink-muted">{children}</div>
    </div>
  );
}

export default async function ClientDocumentsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const ctx = defaultContext();
  const access = resolveToken(ctx, token);

  // Les messages ne révèlent rien du dossier : un lien invalide ou révoqué reçoit le même message.
  if (access.state === "expired")
    return (
      <Notice icon={<Clock3 className="h-6 w-6" />} title="Ce lien a expiré">
        <p>Pour des raisons de sécurité, les liens ont une durée limitée. Contactez Ruby Assur&apos; au <a className="font-semibold text-night underline" href={`tel:${phone}`}>{fmtPhone(phone)}</a> pour recevoir un nouveau lien.</p>
      </Notice>
    );
  if (access.state === "closed")
    return (
      <Notice icon={<ShieldCheck className="h-6 w-6" />} title="Ce dossier est clôturé">
        <p>Merci ! Vous n&apos;avez plus de documents à transmettre. Pour toute question, contactez Ruby Assur&apos; au {fmtPhone(phone)}.</p>
      </Notice>
    );
  if (access.state !== "ok")
    return (
      <Notice icon={<CircleAlert className="h-6 w-6" />} title="Ce lien n'est pas valide">
        <p>Le lien est incorrect ou n&apos;est plus actif. Contactez Ruby Assur&apos; au <a className="font-semibold text-night underline" href={`tel:${phone}`}>{fmtPhone(phone)}</a> pour obtenir un nouveau lien.</p>
      </Notice>
    );

  return <ClientPortal token={token} initial={getClientView(ctx, token)} />;
}
