"use client";
import { useState, useRef } from "react";
import { products } from "@/lib/products";
import { Paperclip, X } from "lucide-react";

const inputCls = "rounded-xl border border-off-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy w-full";

export function QuoteForm({ defaultInsurance = "" }: { defaultInsurance?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", insurance: defaultInsurance, message: "" });
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const next = [...files];
    Array.from(incoming).forEach(f => {
      if (!next.find(x => x.name === f.name)) next.push(f);
    });
    setFiles(next);
  }

  function removeFile(name: string) {
    setFiles(files.filter(f => f.name !== name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    files.forEach(f => fd.append("files", f));
    const res = await fetch("/api/quote", { method: "POST", body: fd });
    setLoading(false);
    if (res.ok) setSubmitted(true);
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
        <input required placeholder="Prénom *" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className={inputCls} />
        <input required placeholder="Nom *" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className={inputCls} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required type="tel" placeholder="Téléphone *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputCls} />
        <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputCls} />
      </div>
      <select required value={form.insurance} onChange={e => setForm({...form, insurance: e.target.value})} className={inputCls}>
        <option value="">Type d&apos;assurance *</option>
        {products.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
      </select>
      <textarea rows={3} placeholder="Votre message (optionnel)" value={form.message} onChange={e => setForm({...form, message: e.target.value})} className={inputCls} />

      {/* Zone pièces jointes */}
      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 rounded-xl border border-dashed border-off-gray px-4 py-3 text-sm text-slate-500 hover:border-navy hover:text-navy transition w-full"
        >
          <Paperclip className="h-4 w-4 shrink-0" />
          Joindre des documents (permis, carte grise, relevé…)
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          className="hidden"
          onChange={e => addFiles(e.target.files)}
        />
        {files.length > 0 && (
          <ul className="mt-2 space-y-1">
            {files.map(f => (
              <li key={f.name} className="flex items-center justify-between rounded-lg bg-off-white px-3 py-2 text-xs text-slate-600">
                <span className="truncate">{f.name}</span>
                <button type="button" onClick={() => removeFile(f.name)} className="ml-2 shrink-0 text-slate-400 hover:text-red-500">
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-1.5 text-xs text-slate-400">PDF, JPG, PNG acceptés — 10 Mo max par fichier</p>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
        {loading ? "Envoi…" : "Envoyer ma demande"}
      </button>
      <p className="text-center text-xs text-slate-400">Gratuit, sans engagement. Réponse sous 24h.</p>
    </form>
  );
}
