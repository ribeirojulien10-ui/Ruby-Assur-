import { products } from "@/lib/products";
import { HeaderNav, type NavMenu } from "./HeaderNav";

const phone = process.env.NEXT_PUBLIC_PHONE ?? "0671551931";

/** Composant serveur : prépare les menus à partir du catalogue réel, puis délègue l'interactivité. */
export function Header() {
  const menus: NavMenu[] = [
    {
      key: "particuliers",
      label: "Particuliers",
      href: "/particuliers",
      allLabel: "Toutes les assurances particuliers",
      items: products.filter((p) => p.audience === "particulier").map((p) => ({ href: `/${p.slug}`, label: p.name, hint: p.tagline })),
    },
    {
      key: "professionnels",
      label: "Professionnels",
      href: "/professionnels",
      allLabel: "Toutes les assurances professionnelles",
      items: products.filter((p) => p.audience === "pro").map((p) => ({ href: `/${p.slug}`, label: p.name, hint: p.tagline })),
    },
  ];
  return <HeaderNav menus={menus} phone={phone} />;
}
