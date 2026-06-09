"use client";
import { useState } from "react";
import { products } from "@/lib/products";

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", insurance: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: brancher /api/quote quand le backend est prêt
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-navy p-8 text-center text-white">
        <p className="text-2xl font-bold">Demande envoyée ✓</p>
        <p className="mt-2 text-white/70">Ruby Assur' vous recontacte rapidement.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Prénom *" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="rounded-xl border border-off-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
        <input required placeholder="Nom *" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="rounded-xl border border-off-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required type="tel" placeholder="Téléphone *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="rounded-xl border border-off-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
        <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="rounded-xl border border-off-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
      </div>
      <select required value={form.insurance} onChange={e => setForm({...form, insurance: e.target.value})} className="w-full rounded-xl border border-off-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy">
        <option value="">Type d&apos;assurance *</option>
        {products.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
      </select>
      <textarea rows={4} placeholder="Votre message (optionnel)" value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full rounded-xl border border-off-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
      <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">{loading ? "Envoi…" : "Envoyer ma demande"}</button>
      <p className="text-center text-xs text-slate-400">Gratuit, sans engagement. Réponse sous 24h.</p>
    </form>
  );
}
