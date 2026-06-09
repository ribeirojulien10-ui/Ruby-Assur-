import Link from "next/link";

export default function CtaBand({
  title,
  text,
  cta = "Demander un devis",
}: {
  title: string;
  text: string;
  cta?: string;
}) {
  return (
    <div className="cta-band">
      <h2>{title}</h2>
      <p>{text}</p>
      <Link href="/contact" className="btn btn-gold">
        {cta}
      </Link>
    </div>
  );
}
