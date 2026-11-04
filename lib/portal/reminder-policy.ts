import type { LinkState, RequestStatus } from "./types";

/**
 * POLITIQUE de relances automatiques — PRÉPARÉE, NON BRANCHÉE.
 *
 * Cette fonction pure décide QUELS dossiers mériteraient une relance. Elle n'envoie rien et n'est appelée
 * par aucun planificateur : aucune relance automatique n'existe tant que Julien n'a pas validé les délais,
 * le texte et activé un envoi (voir docs/portail/architecture.md, « Relances automatiques »).
 *
 * Garanties prévues : arrêt immédiat dès que le dossier est complet / clôturé, jamais plus de `maxReminders`,
 * espacement minimal, désactivable dossier par dossier, historique conservé (table reminders).
 */
export interface ReminderConfig {
  enabled: boolean;
  /** Délai avant la première relance, en jours, depuis la dernière activité du client. */
  firstAfterDays: number;
  /** Délai minimal entre deux relances, en jours. */
  repeatEveryDays: number;
  /** Nombre maximal de relances automatiques par dossier. */
  maxReminders: number;
}

export interface Candidate {
  id: string;
  status: RequestStatus;
  linkState: LinkState;
  /** Désactivable par Julien pour un dossier précis. */
  autoRemindersAllowed: boolean;
  hasMissingOrToReplace: boolean;
  lastClientActivityAt: string;
  remindersSent: number;
  lastReminderAt: string | null;
}

const DAY = 86_400_000;

export function selectDueReminders(candidates: Candidate[], cfg: ReminderConfig, now: Date): string[] {
  if (!cfg.enabled) return [];
  return candidates
    .filter((c) => {
      if (!c.autoRemindersAllowed) return false;
      if (c.status !== "incomplete") return false; // complet / validé / terminé : on s'arrête immédiatement
      if (c.linkState !== "active") return false; // un lien expiré ou révoqué ne se relance pas
      if (!c.hasMissingOrToReplace) return false;
      if (c.remindersSent >= cfg.maxReminders) return false;
      const since = now.getTime() - new Date(c.lastClientActivityAt).getTime();
      if (c.remindersSent === 0) return since >= cfg.firstAfterDays * DAY;
      const sinceLast = now.getTime() - new Date(c.lastReminderAt ?? c.lastClientActivityAt).getTime();
      return sinceLast >= cfg.repeatEveryDays * DAY;
    })
    .map((c) => c.id);
}
