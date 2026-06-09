import { Shield, Clock, CheckCircle } from "lucide-react";
const badges = [
  { icon: Shield, label: "ORIAS 24007878" },
  { icon: CheckCircle, label: "Devis gratuit" },
  { icon: Clock, label: "Réponse rapide" },
];
export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:justify-start sm:gap-3">
      {badges.map(({ icon: Icon, label }) => (
        <span key={label} className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] font-medium text-white sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
          <Icon className="h-3 w-3 text-gold sm:h-3.5 sm:w-3.5" />{label}
        </span>
      ))}
    </div>
  );
}
