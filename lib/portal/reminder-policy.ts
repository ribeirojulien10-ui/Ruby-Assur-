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
  /** Délai avant la première relance, en heures, depuis la dernière activité du client. */
  firstAfterHours: number;
  /** Délai minimal entre deux relances, en heures. */
  repeatEveryHours: number;
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

const HOUR = 3_600_000;

/** Réglage voulu par Julien : relance à 24 h, puis à 48 h après l'activité (soit 24 h plus tard), 2 relances maximum. */
export const DEFAULT_REMINDER_CONFIG: ReminderConfig = { enabled: false, firstAfterHours: 24, repeatEveryHours: 24, maxReminders: 2 };

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
      if (c.remindersSent === 0) return since >= cfg.firstAfterHours * HOUR;
      const sinceLast = now.getTime() - new Date(c.lastReminderAt ?? c.lastClientActivityAt).getTime();
      return sinceLast >= cfg.repeatEveryHours * HOUR;
    })
    .map((c) => c.id);
}
