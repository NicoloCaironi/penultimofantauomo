import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Giornate", href: "/giornate" },
  { label: "Squadre", href: "/squadre" },
  { label: "Mercato", href: "/mercato" },
  { label: "Firme", href: "/autori" },
  { label: "Archivio", href: "/archivio" },
];

export default function MastheadNav() {
  return (
    <nav className="flex justify-center divide-x divide-ink/30 border-b-4 border-double border-ink">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="px-6 py-3 font-sans font-semibold text-[12px] tracking-[.14em] uppercase text-ink hover:text-stamp transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}