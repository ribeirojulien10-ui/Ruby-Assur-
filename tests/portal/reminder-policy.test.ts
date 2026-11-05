import { describe, expect, it } from "vitest";
import { DEFAULT_REMINDER_CONFIG, selectDueReminders, type Candidate, type ReminderConfig } from "@/lib/portal/reminder-policy";

const now = new Date("2030-02-01T10:00:00Z");
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString();
const cfg: ReminderConfig = { enabled: true, firstAfterHours: 72, repeatEveryHours: 96, maxReminders: 2 };
const base: Candidate = { id: "a", status: "incomplete", linkState: "active", autoRemindersAllowed: true, hasMissingOrToReplace: true, lastClientActivityAt: daysAgo(5), remindersSent: 0, lastReminderAt: null };

describe("Politique de relances automatiques (non branchée)", () => {
  it("réglage voulu : relance à 24 h puis 48 h, 2 maximum, désactivé par défaut", () => {
    const c = { ...DEFAULT_REMINDER_CONFIG, enabled: true };
    const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString();
    expect(DEFAULT_REMINDER_CONFIG.enabled).toBe(false);
    expect(selectDueReminders([{ ...base, lastClientActivityAt: hoursAgo(23) }], c, now)).toEqual([]);
    expect(selectDueReminders([{ ...base, lastClientActivityAt: hoursAgo(25) }], c, now)).toEqual(["a"]);
    expect(selectDueReminders([{ ...base, remindersSent: 1, lastReminderAt: hoursAgo(10) }], c, now)).toEqual([]);
    expect(selectDueReminders([{ ...base, remindersSent: 1, lastReminderAt: hoursAgo(25) }], c, now)).toEqual(["a"]);
    expect(selectDueReminders([{ ...base, remindersSent: 2, lastReminderAt: hoursAgo(80) }], c, now)).toEqual([]);
  });
  it("désactivée par défaut : aucune relance", () => {
    expect(selectDueReminders([base], { ...cfg, enabled: false }, now)).toEqual([]);
  });
  it("première relance après le délai configuré, pas avant", () => {
    expect(selectDueReminders([base], cfg, now)).toEqual(["a"]);
    expect(selectDueReminders([{ ...base, lastClientActivityAt: daysAgo(2) }], cfg, now)).toEqual([]);
  });
  it("respecte l'espacement et le maximum", () => {
    expect(selectDueReminders([{ ...base, remindersSent: 1, lastReminderAt: daysAgo(2) }], cfg, now)).toEqual([]);
    expect(selectDueReminders([{ ...base, remindersSent: 1, lastReminderAt: daysAgo(5) }], cfg, now)).toEqual(["a"]);
    expect(selectDueReminders([{ ...base, remindersSent: 2, lastReminderAt: daysAgo(30) }], cfg, now)).toEqual([]);
  });
  it("s'arrête immédiatement quand le dossier est complet, validé ou clôturé", () => {
    for (const status of ["complete", "to_review", "validated", "closed"] as const)
      expect(selectDueReminders([{ ...base, status }], cfg, now)).toEqual([]);
  });
  it("jamais pour un lien expiré ou révoqué, ni si Julien a désactivé les relances du dossier", () => {
    expect(selectDueReminders([{ ...base, linkState: "expired" }], cfg, now)).toEqual([]);
    expect(selectDueReminders([{ ...base, linkState: "revoked" }], cfg, now)).toEqual([]);
    expect(selectDueReminders([{ ...base, autoRemindersAllowed: false }], cfg, now)).toEqual([]);
  });
});
