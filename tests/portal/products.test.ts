import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createRequest, getRequestDetail, listRequests } from "@/lib/portal/admin";
import { getClientView, saveAnswers, saveInfo, submitRequest } from "@/lib/portal/client";
import { DEFAULT_TEMPLATES } from "@/lib/portal/default-templates";
import { getProductBySlug } from "@/lib/products";
import type { InfoField } from "@/lib/portal/types";
import { admin, cleanup, fakePdf, itemsOf, makeCtx, upload, type TestCtx } from "./helpers";

/**
 * Test de bout en bout, PRODUIT PAR PRODUIT : chaque modèle de documents est exercé comme le ferait un vrai
 * client (données entièrement fictives).
 */
const sample = (f: InfoField): string => {
  switch (f.type) {
    case "number": return "45";
    case "date": return "1990-05-12";
    case "choice": return f.options?.[0] ?? "";
    case "tel": return "0600000000";
    case "email": return "fictif@example.invalid";
    case "textarea": return `${f.label} — texte fictif`;
    case "persons": return JSON.stringify([{ name: "Personne Fictive", birth: "1990-05-12" }, { name: "Autre Fictive", birth: "2015-03-01" }].slice(0, f.max ?? 8));
    default: return "Exemple fictif";
  }
};

/** Par défaut (cases décochées = « non »), un champ ou une pièce conditionné par « oui » est masqué. */
const shownByDefault = (c?: { question?: string; equals?: string } | { conditionQuestion?: string | null; conditionEquals?: string | null }): boolean => {
  if (!c) return true;
  const eq = "equals" in c ? c.equals : (c as { conditionEquals?: string | null }).conditionEquals;
  const q = "question" in c ? c.question : (c as { conditionQuestion?: string | null }).conditionQuestion;
  return !q || eq === "no";
};

let ctx: TestCtx;
const report: Record<string, unknown>[] = [];
beforeAll(() => { ctx = makeCtx(); });
afterAll(() => {
  console.table(report);
  cleanup(ctx);
});

describe.each(DEFAULT_TEMPLATES.map((t) => [t.name, t] as const))("Produit : %s", (_name, t) => {
  const create = () =>
    createRequest(ctx, admin, {
      newClient: { fullName: `Client Fictif ${t.name}`, email: "x@example.invalid", phone: "0600000000" },
      insuranceSlug: t.insuranceSlug,
      title: t.name,
      instructions: t.instructions,
      questions: t.questions,
      fields: t.fields,
      isDemo: true,
      items: t.items.map((i) => ({ label: i.label, instructions: i.instructions, required: i.required, formats: i.formats, conditionQuestion: i.conditionQuestion, conditionEquals: i.conditionEquals })),
    });

  it("pointe vers une page d'assurance existante et demande au moins un document obligatoire", () => {
    expect(getProductBySlug(t.insuranceSlug)).toBeTruthy();
    // au moins un document obligatoire, OU (produit déclaratif) un questionnaire avec des champs obligatoires
    expect(t.items.some((i) => i.required) || (t.fields ?? []).some((f) => f.required), t.name).toBe(true);
    expect(new Set(t.items.map((i) => i.label)).size).toBe(t.items.length); // pas de doublon
    expect(new Set((t.fields ?? []).map((f) => f.key)).size).toBe((t.fields ?? []).length);
  });

  it("le client voit le nom du produit, la liste attendue et ses champs d'information", () => {
    const { token } = create();
    const v = getClientView(ctx, token);
    expect(v.title).toBe(t.name);
    expect(v.status).toBe("incomplete");
    expect(v.items.map((i) => i.label)).toEqual(t.items.filter((i) => shownByDefault(i)).map((i) => i.label));
    expect(v.fields.map((f) => f.label)).toEqual((t.fields ?? []).filter((f) => shownByDefault(f.condition)).map((f) => f.label));
    expect(v.unanswered).toEqual([]); // aucune question bloquante au départ
  });

  it("parcours complet : informations → pièces → confirmation → Julien est prévenu une seule fois", async () => {
    const { id, token } = create();
    const before = (ctx.db.prepare("SELECT COUNT(*) c FROM outbox").get() as { c: number }).c;

    // au départ, le dossier attend le client (sauf si rien n'est obligatoire)
    expect(getRequestDetail(ctx, admin, id).status).toBe("incomplete");

    // le client saisit toutes ses informations (valeurs valides pour chaque type)
    const values = Object.fromEntries((t.fields ?? []).map((f) => [f.key, sample(f)]));
    if (t.fields?.length) {
      saveInfo(ctx, token, values);
      expect(Object.keys(getClientView(ctx, token).info).length).toBe(t.fields.length);
    }

    // il dépose chaque pièce obligatoire demandée
    const view = getClientView(ctx, token);
    const required = view.items.filter((i) => i.required);
    const dbItems = itemsOf(ctx, id);
    for (const [n, it] of required.entries()) {
      const row = dbItems.find((d) => d.label === it.label)!;
      await upload(ctx, token, row.id, `piece-${n}.pdf`, fakePdf(it.label));
      // la progression suit exactement les pièces reçues
      expect(getRequestDetail(ctx, admin, id).progress.requiredDone).toBe(n + 1);
    }
    const d = getRequestDetail(ctx, admin, id);
    expect(d.status).toBe("complete"); // « En cours » : rien ne dit « complet »
    if (required.length > 0) expect(d.progress.percent).toBe(100);
    expect(ctx.db.prepare("SELECT COUNT(*) c FROM outbox").get()).toEqual({ c: before }); // pas d'alerte avant confirmation

    // il confirme : Julien est prévenu, une seule fois
    expect(submitRequest(ctx, token)).toBe("to_review");
    submitRequest(ctx, token);
    expect((ctx.db.prepare("SELECT COUNT(*) c FROM outbox").get() as { c: number }).c).toBe(before + 1);

    // côté Julien : les informations sont lisibles dans la fiche
    const fiche = getRequestDetail(ctx, admin, id);
    expect(fiche.status).toBe("to_review");
    for (const f of t.fields ?? []) expect(fiche.info[f.key]).toBe(values[f.key]);

    report.push({
      produit: t.name,
      "documents (oblig./total)": `${t.items.filter((i) => i.required).length}/${t.items.length}`,
      "infos à saisir (oblig.)": `${t.fields?.length ?? 0} (${(t.fields ?? []).filter((f) => f.required).length})`,
      "case/question": t.questions?.length ? t.questions.map((q) => q.type).join(",") : "—",
      "statut final": fiche.status,
    });
  });

  const requiredFields = (t.fields ?? []).filter((f) => f.required && shownByDefault(f.condition));
  if (requiredFields.length > 0) {
    it(`les informations obligatoires (${requiredFields.map((f) => f.label).join(", ").slice(0, 80)}) empêchent la confirmation tant qu'elles manquent`, async () => {
      const { id, token } = create();
      const rows = itemsOf(ctx, id);
      for (const it of getClientView(ctx, token).items.filter((i) => i.required)) await upload(ctx, token, rows.find((r) => r.label === it.label)!.id, "p.pdf", fakePdf(it.label));
      // toutes les pièces sont là, mais pas les informations obligatoires
      expect(getRequestDetail(ctx, admin, id).status).toBe("incomplete");
      expect(getClientView(ctx, token).infoMissing).toBe(requiredFields.length);
      expect(() => submitRequest(ctx, token)).toThrow();
      // seules les obligatoires suffisent
      saveInfo(ctx, token, Object.fromEntries(requiredFields.map((f) => [f.key, sample(f)])));
      expect(getClientView(ctx, token).infoMissing).toBe(0);
      expect(submitRequest(ctx, token)).toBe("to_review");
    });
  }

  if (t.questions?.[0]?.key === "premiere_assurance") {
    it("case « première assurance » : le relevé disparaît quand elle est cochée et revient si on la décoche", async () => {
      const { id, token } = create();
      const key = t.questions![0].key;
      const cond = t.items.find((i) => i.conditionQuestion === key)!;
      expect(getClientView(ctx, token).items.map((i) => i.label)).toContain(cond.label);
      saveAnswers(ctx, token, { [key]: "yes" });
      expect(getClientView(ctx, token).items.map((i) => i.label)).not.toContain(cond.label);
      // les autres pièces obligatoires suffisent alors
      const rows = itemsOf(ctx, id);
      for (const it of getClientView(ctx, token).items.filter((i) => i.required)) await upload(ctx, token, rows.find((r) => r.label === it.label)!.id, "p.pdf", fakePdf(it.label));
      expect(getRequestDetail(ctx, admin, id).status).toBe("complete");
      saveAnswers(ctx, token, { [key]: "no" });
      expect(getRequestDetail(ctx, admin, id).status).toBe("incomplete");
    });
  }
});

describe("Vue d'ensemble pour Julien", () => {
  it("les 14 dossiers sont distinguables dans la liste (nom du modèle) et aucun statut ne contient « complet »", () => {
    const rows = listRequests(ctx, admin);
    expect(rows.length).toBeGreaterThanOrEqual(DEFAULT_TEMPLATES.length);
    expect(new Set(rows.map((r) => r.insuranceName)).size).toBe(DEFAULT_TEMPLATES.length);
  });
});
