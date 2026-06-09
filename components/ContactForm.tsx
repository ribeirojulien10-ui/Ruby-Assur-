"use client";

import { useState } from "react";
import { company } from "@/lib/company";

const types = [
  "Assurance auto",
  "Assurance habitation",
  "Santé / mutuelle",
  "Prévoyance",
  "Assurance emprunteur",
  "Assurance professionnelle",
  "Multirisque professionnelle",
  "Responsabilité civile professionnelle",
  "Autre besoin",
];

type FormState = {
  prenom: string;
  nom: string;
  email: string;
  tel: string;
  type: string;
  message: string;
  rgpd: boolean;
};

const empty: FormState = {
  prenom: "",
  nom: "",
  email: "",
  tel: "",
  type: "",
  message: "",
  rgpd: false,
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);

  const update =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const value =
        e.target instanceof HTMLInputElement && e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };

  const validate = () => {
    const next: Record<string, boolean> = {};
    if (!form.prenom.trim()) next.prenom = true;
    if (!form.nom.trim()) next.nom = true;
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      next.email = true;
    if (!form.type) next.type = true;
    if (!form.message.trim()) next.message = true;
    if (!form.rgpd) next.rgpd = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSent(true);

    const subject = encodeURIComponent(
      `Demande de devis — ${form.type} — ${form.prenom} ${form.nom}`
    );
    const body = encodeURIComponent(
      `Prénom : ${form.prenom}\n` +
        `Nom : ${form.nom}\n` +
        `Email : ${form.email}\n` +
        `Téléphone : ${form.tel || "-"}\n` +
        `Type d'assurance : ${form.type}\n\n` +
        `Message :\n${form.message}`
    );

    // Démo locale : ouvre la messagerie pré-remplie (aucun back-end requis).
    setTimeout(() => {
      window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`;
    }, 600);
  };

  return (
    <form className="devis" onSubmit={handleSubmit} noValidate>
      {sent && (
        <div className="form-ok">
          Merci, votre demande est prête à être envoyée. Votre messagerie va
          s&apos;ouvrir — sinon, écrivez-nous directement à l&apos;adresse
          indiquée. Nous revenons vers vous rapidement.
        </div>
      )}

      <div className="frow">
        <div className="field">
          <label>
            Prénom <span className="req">*</span>
          </label>
          <input
            type="text"
            value={form.prenom}
            onChange={update("prenom")}
            className={errors.prenom ? "err" : ""}
          />
        </div>
        <div className="field">
          <label>
            Nom <span className="req">*</span>
          </label>
          <input
            type="text"
            value={form.nom}
            onChange={update("nom")}
            className={errors.nom ? "err" : ""}
          />
        </div>
      </div>

      <div className="frow">
        <div className="field">
          <label>
            Email <span className="req">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={update("email")}
            className={errors.email ? "err" : ""}
          />
        </div>
        <div className="field">
          <label>Téléphone</label>
          <input type="tel" value={form.tel} onChange={update("tel")} />
        </div>
      </div>

      <div className="field">
        <label>
          Type d&apos;assurance recherchée <span className="req">*</span>
        </label>
        <select
          value={form.type}
          onChange={update("type")}
          className={errors.type ? "err" : ""}
        >
          <option value="">Sélectionnez…</option>
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>
          Votre message <span className="req">*</span>
        </label>
        <textarea
          value={form.message}
          onChange={update("message")}
          placeholder="Décrivez votre besoin en quelques mots…"
          className={errors.message ? "err" : ""}
        />
      </div>

      <div className="consent" style={{ color: errors.rgpd ? "#c0392b" : "" }}>
        <input
          type="checkbox"
          id="rgpd"
          checked={form.rgpd}
          onChange={update("rgpd")}
        />
        <label htmlFor="rgpd" style={{ fontWeight: 400, margin: 0 }}>
          J&apos;accepte que mes données soient utilisées pour traiter ma
          demande, conformément à la{" "}
          <a href="/confidentialite">politique de confidentialité</a>.{" "}
          <span className="req">*</span>
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center" }}
      >
        Envoyer ma demande
      </button>
      <p className="form-note">Demande sans engagement · Réponse rapide</p>
    </form>
  );
}
