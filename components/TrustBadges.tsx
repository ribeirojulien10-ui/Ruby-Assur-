import { Shield, Clock, CheckCircle, Award } from "lucide-react";
const badges = [
  { icon: Shield, label: "ORIAS 24007878" },
  { icon: CheckCircle, label: "Devis gratuit" },
  { icon: Clock, label: "Réponse rapide" },
  { icon: Award, label: "Sans engagement" },
];
export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
      {badges.map(({ icon: Icon, label }) => (
        <span key={label} className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">
          <Icon className="h-3.5 w-3.5 text-gold" />{label}
        </span>
      ))}
    </div>
  );
}
