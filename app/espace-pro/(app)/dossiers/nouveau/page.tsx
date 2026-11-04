import type { Metadata } from "next";
import { NewRequestForm } from "@/components/portal/NewRequestForm";
import { requireAdmin } from "@/lib/auth-guard";
import { products } from "@/lib/products";
import { listClients, listTemplates } from "@/lib/portal/admin";
import { defaultContext } from "@/lib/portal/context";

export const metadata: Metadata = { title: "Nouvelle demande" };

export default async function NewRequestPage() {
  const admin = await requireAdmin();
  const ctx = defaultContext();
  const templates = listTemplates(ctx, admin);
  const clients = listClients(ctx, admin).map((c) => ({ id: c.id, full_name: c.full_name, email: c.email, phone: c.phone }));
  return (
    <>
      <p className="eyebrow">Nouvelle demande</p>
      <h1 className="display mt-3 max-w-3xl text-display-md text-night">Demander des documents à un client.</h1>
      <p className="mt-3 max-w-2xl text-ink-muted">Choisissez le client et l&apos;assurance : la liste des documents se remplit automatiquement et reste modifiable. Un lien sécurisé personnel est généré.</p>
      <div className="mt-8 max-w-4xl">
        <NewRequestForm templates={templates} clients={clients} insurances={products.map((p) => ({ slug: p.slug, name: p.name }))} />
      </div>
    </>
  );
}
