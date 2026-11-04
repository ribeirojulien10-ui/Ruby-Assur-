import { AlertCircle, CheckCircle2, CircleDashed, Clock3, FileCheck2, Lock, RefreshCcw } from "lucide-react";
import { ITEM_STATE_LABEL, ITEM_TONE, STATUS_LABEL, STATUS_TONE } from "@/lib/portal/ui";
import type { ItemState, RequestStatus } from "@/lib/portal/types";

const tones = {
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-night/5 text-ink-soft",
};

/** Un état est TOUJOURS indiqué par un libellé ET une icône : la couleur ne porte jamais seule l'information. */
function Badge({ tone, icon, children }: { tone: keyof typeof tones; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.78rem] font-semibold ${tones[tone]}`}>
      <span aria-hidden="true" className="shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
      {children}
    </span>
  );
}

const STATUS_ICON: Record<RequestStatus, React.ReactNode> = {
  incomplete: <CircleDashed />,
  complete: <FileCheck2 />,
  to_review: <Clock3 />,
  validated: <CheckCircle2 />,
  closed: <Lock />,
};
const ITEM_ICON: Record<ItemState, React.ReactNode> = {
  to_provide: <CircleDashed />,
  received: <FileCheck2 />,
  to_replace: <RefreshCcw />,
  validated: <CheckCircle2 />,
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return <Badge tone={STATUS_TONE[status]} icon={STATUS_ICON[status]}>{STATUS_LABEL[status]}</Badge>;
}
export function ItemBadge({ state }: { state: ItemState }) {
  return <Badge tone={ITEM_TONE[state]} icon={ITEM_ICON[state]}>{ITEM_STATE_LABEL[state]}</Badge>;
}
export function LinkBadge({ state }: { state: "active" | "expired" | "revoked" | "none" }) {
  const map = {
    active: ["ok", <CheckCircle2 key="i" />, "Lien actif"],
    expired: ["warn", <Clock3 key="i" />, "Lien expiré"],
    revoked: ["danger", <AlertCircle key="i" />, "Lien révoqué"],
    none: ["neutral", <CircleDashed key="i" />, "Aucun lien"],
  } as const;
  const [tone, icon, label] = map[state];
  return <Badge tone={tone} icon={icon}>{label}</Badge>;
}
