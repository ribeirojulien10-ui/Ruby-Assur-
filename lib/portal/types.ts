export type ItemState = "to_provide" | "received" | "to_replace" | "validated";
export type RequestStatus = "incomplete" | "complete" | "to_review" | "validated" | "closed";
export type LinkState = "active" | "expired" | "revoked" | "none";

/**
 * Question posée au client avant la liste de pièces.
 *  - "yesno"   : réponse obligatoire (oui / non) avant d'afficher les pièces conditionnelles ;
 *  - "checkbox": case à cocher ; décochée = « non » par défaut (ex. « C'est ma première assurance »).
 */
export interface Question {
  key: string;
  label: string;
  type?: "yesno" | "checkbox";
}

/** Information à saisir par le client (en plus des documents). */
export interface InfoField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "tel" | "email" | "choice";
  options?: string[]; // pour « choice »
  unit?: string; // ex. m²
  required?: boolean;
  hint?: string;
}

export interface ItemRow {
  id: string;
  request_id: string;
  label: string;
  instructions: string | null;
  required: number;
  sort: number;
  allowed_formats: string;
  max_bytes: number;
  condition_question: string | null;
  condition_equals: string | null;
  state: ItemState;
  reject_reason: string | null;
  reject_note: string | null;
  reviewed_at: string | null;
  validated_at: string | null;
}

export interface FileRow {
  id: string;
  request_id: string;
  item_id: string;
  storage_key: string;
  original_name: string;
  size: number;
  detected_type: string;
  sha256: string;
  scan_status: string;
  created_at: string;
  deleted_at: string | null;
}

export interface RequestRow {
  id: string;
  client_id: string;
  insurance_slug: string;
  title: string;
  instructions: string | null;
  questions: string;
  answers: string;
  fields: string;
  info: string;
  token_hash: string | null;
  token_enc: string | null;
  token_issued_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  submitted_at: string | null;
  completed_notified_at: string | null;
  closed_at: string | null;
  is_demo: number;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

export interface ClientRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  is_demo: number;
  created_at: string;
}

export interface EventRow {
  id: string;
  request_id: string;
  item_id: string | null;
  actor: "julien" | "client" | "system";
  type: string;
  meta: string;
  created_at: string;
}

export class PortalError extends Error {
  constructor(
    public code:
      | "unauthorized"
      | "not_found"
      | "invalid_link"
      | "expired_link"
      | "revoked_link"
      | "closed"
      | "forbidden_format"
      | "too_large"
      | "too_many_files"
      | "bad_upload"
      | "infected"
      | "rate_limited"
      | "invalid_input"
      | "conflict",
    message?: string,
  ) {
    super(message ?? code);
    this.name = "PortalError";
  }
}

/** Session administrateur (Julien). Seul `requireAdmin()` doit en fabriquer une. */
export interface AdminSession {
  userId: string;
  email: string;
}

export function assertAdmin(admin: AdminSession | null | undefined): asserts admin is AdminSession {
  if (!admin || !admin.userId) throw new PortalError("unauthorized");
}
