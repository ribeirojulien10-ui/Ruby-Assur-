import { company } from "@/lib/company";

export default function OriasPill({
  className = "",
  long = false,
}: {
  className?: string;
  long?: boolean;
}) {
  return (
    <div className={`oriaspill ${className}`}>
      <span className="dot" />
      <span>
        {long ? "Courtier en assurance inscrit " : "Courtier inscrit "}
        <strong>ORIAS n° {company.orias}</strong>
      </span>
    </div>
  );
}
