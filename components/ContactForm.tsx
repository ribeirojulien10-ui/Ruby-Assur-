"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { insuranceOptions } from "@/lib/site";

const inputClass =
  "focus-ring h-12 w-full rounded-md border border-ruby-line bg-white px-3 text-sm text-ruby-ink shadow-sm outline-none transition placeholder:text-slate-400";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <div className="rounded-lg border border-ruby-line bg-white p-5 shadow-soft sm:p-6">
      {submitted ? (
        <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="flex items-start gap-2 font-semibold">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Demande enregistrée en démonstration.
          </p>
          <p className="mt-2">
            Aucun message n’a été envoyé. La structure est prête à être reliée plus tard à une solution email ou à une API.
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-ruby-ink">
            Nom
            <input className={inputClass} name="lastName" type="text" autoComplete="family-name" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ruby-ink">
            Prénom
            <input className={inputClass} name="firstName" type="text" autoComplete="given-name" required />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-ruby-ink">
            Email
            <input className={inputClass} name="email" type="email" autoComplete="email" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ruby-ink">
            Téléphone
            <input className={inputClass} name="phone" type="tel" autoComplete="tel" required />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-ruby-ink">
          Type d’assurance recherchée
          <select className={inputClass} name="insuranceType" required defaultValue="">
            <option value="" disabled>
              Sélectionner un besoin
            </option>
            {insuranceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-ruby-ink">
          Message
          <textarea
            className="focus-ring min-h-32 w-full rounded-md border border-ruby-line bg-white px-3 py-3 text-sm text-ruby-ink shadow-sm outline-none transition placeholder:text-slate-400"
            name="message"
            required
            placeholder="Décrivez brièvement votre situation ou votre besoin."
          />
        </label>

        <label className="flex gap-3 rounded-md bg-ruby-frost p-3 text-sm text-slate-700">
          <input
            className="mt-1 h-4 w-4 shrink-0 rounded border-ruby-line text-ruby-navy"
            name="consent"
            type="checkbox"
            required
          />
          <span>
            J’accepte que les informations saisies soient utilisées pour traiter ma demande de rappel. Mode démonstration :
            aucune donnée n’est envoyée pour l’instant.
          </span>
        </label>

        <button
          type="submit"
          className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ruby-navy px-5 text-sm font-semibold text-white transition hover:bg-ruby-ink"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Demander un rappel
        </button>
      </form>
    </div>
  );
}
