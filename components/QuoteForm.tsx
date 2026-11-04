"use client";
import { useState, useRef } from "react";
import { products } from "@/lib/products";
import { trackQuoteConversion } from "@/lib/ads";
import { Paperclip, X } from "lucide-react";

// Vercel refuse toute requête > 4,5 Mo (erreur 413). On limite donc le TOTAL des pièces
// jointes à 4 Mo, ce qui laisse une marge pour les champs texte et l'encodage multipart.
const MAX_TOTAL_SIZE = 4 * 1024 * 1024; // 4 Mo au total
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@rubyassur.fr";
const fmtMo = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1).replace(".", ",");
const PHONE_RE = /^0[0-9]{9}$/;
const ALLOWED_EXT = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];
const extOf = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";

const inputCls = "field";

export function QuoteForm({ defaultInsurance = "" }: { defaultInsurance?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", insurance: defaultInsurance, message: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [phoneError, setPhoneError] = useState("");
  const [fileError, setFileError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Documents suggérés selon l'assurance choisie (et non plus toujours auto).
  const selected = products.find(p => p.slug === form.insurance);
  const docsHint = selected
    ? `Joindre des documents (${selected.requiredDocuments.slice(0, 3).map(d => d.charAt(0).toLowerCase() + d.slice(1)).join(", ")}…)`
    : "Joindre des documents utiles à votre demande";

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const next = [...files];
    let total = next.reduce((n, f) => n + f.size, 0);
    const tooBig: string[] = [];
    const wrongType: string[] = [];
    Array.from(incoming).forEach(f => {
      if (!ALLOWED_EXT.includes(extOf(f.name))) {
        wrongType.push(f.name);
        return;
      }
      if (next.find(x => x.name === f.name)) return;
      if (total + f.size > MAX_TOTAL_SIZE) {
        tooBig.push(f.name);
        return;
      }
      next.push(f);
      total += f.size;
    });
    setFiles(next);
    const errors: string[] = [];
    if (tooBig.length > 0) {
      errors.push(
        `Taille totale limitée à 4 Mo (${tooBig.join(", ")} non ajouté). Pour des fichiers plus volumineux, envoyez-les par e-mail à ${CONTACT_EMAIL}.`
      );
    }
    if (wrongType.length > 0) errors.push(`Format non accepté (PDF, JPG, PNG, DOC, DOCX) : ${wrongType.join(", ")}`);
    setFileError(errors.join(" — "));
  }

  function removeFile(name: string) {
    setFiles(files.filter(f => f.name !== name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");

    const cleanPhone = form.phone.replace(/[\s.\-]/g, "");
    if (!PHONE_RE.test(cleanPhone)) {
      setPhoneError("Numéro invalide : 10 chiffres commençant par 0 (ex. 06 12 34 56 78).");
      return;
    }
    setPhoneError("");

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries({ ...form, phone: cleanPhone }).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append("files", f));
      const honeypot = (e.currentTarget as HTMLFormElement).elements.namedItem("website") as HTMLInputElement | null;
      fd.append("website", honeypot?.value ?? "");
      const res = await fetch("/api/quote", { method: "POST", body: fd });
      if (res.status === 413) {
        setSubmitError(`Vos pièces jointes sont trop volumineuses (4 Mo maximum au total). Réduisez-les ou envoyez-les par e-mail à ${CONTACT_EMAIL}.`);
      } else if (res.ok) {
        setSubmitted(true);
        trackQuoteConversion(); // uniquement si le serveur a confirmé l'envoi du devis
      } else {
        setSubmitError("Une erreur est survenue. Réessayez ou appelez le 06 71 55 19 31.");
      }
    } catch {
      setSubmitError("Une erreur est survenue. Réessayez ou appelez le 06 71 55 19 31.");
    } finally {
      setLoading(false);
    }
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
      {/* Honeypot anti-spam : invisible pour les humains */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Prénom *" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className={inputCls} />
        <input required placeholder="Nom *" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className={inputCls} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <input required type="tel" inputMode="tel" autoComplete="tel" placeholder="Téléphone *" value={form.phone} onChange={e => { setForm({...form, phone: e.target.value}); if (phoneError) setPhoneError(""); }} aria-invalid={phoneError ? true : undefined} className={inputCls} />
          {phoneError && <p role="alert" className="mt-1.5 text-xs text-red-600">{phoneError}</p>}
        </div>
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
          {docsHint}
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
        {fileError && <p role="alert" className="mt-1.5 text-xs text-red-600">{fileError}</p>}
        <p className="mt-1.5 text-xs text-slate-400">PDF, JPG, PNG, DOC, DOCX — {fmtMo(files.reduce((n, f) => n + f.size, 0))} / 4 Mo au total. Au-delà, envoyez-nous vos documents par e-mail.</p>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
        {loading ? "Envoi…" : "Envoyer ma demande"}
      </button>
      {submitError && <p role="alert" className="text-center text-sm text-red-600">{submitError}</p>}
      <p className="text-center text-xs text-slate-400">Gratuit, sans engagement. Réponse sous 24h.</p>
    </form>
  );
}
