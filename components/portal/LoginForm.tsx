"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/espace-pro/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[0.85rem] font-semibold text-night">Adresse e-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[0.85rem] font-semibold text-night">Mot de passe</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {state?.error && <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-[0.88rem] text-danger">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full">{pending ? "Connexion…" : "Se connecter"}</button>
    </form>
  );
}
