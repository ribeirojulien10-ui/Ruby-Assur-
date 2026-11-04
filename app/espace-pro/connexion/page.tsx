import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/portal/LoginForm";
import { Logo } from "@/components/Logo";
import { getAdminSession } from "@/lib/auth-guard";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await getAdminSession()) redirect("/espace-pro");
  return (
    <main className="grid min-h-screen place-items-center bg-ivory px-gutter py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center"><Logo /></div>
        <div className="mt-8 rounded-xl bg-white p-7 shadow-card sm:p-9">
          <h1 className="display text-display-sm text-night">Espace professionnel</h1>
          <p className="mt-2 text-[0.95rem] text-ink-muted">Accès réservé au cabinet.</p>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-[0.8rem] text-ink-faint">Cet espace n&apos;est pas référencé et n&apos;est pas destiné au public.</p>
      </div>
    </main>
  );
}
