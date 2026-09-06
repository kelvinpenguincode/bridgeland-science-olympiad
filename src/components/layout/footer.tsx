import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/shared/logo";

const columns = [
  {
    title: "Team",
    links: [
      { href: "/about", label: "About" },
      { href: "/team", label: "Officers & Coaches" },
      { href: "/results", label: "Results & History" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Compete",
    links: [
      { href: "/events", label: "Events" },
      { href: "/competitions", label: "Competitions" },
      { href: "/placement", label: "Placement Testing" },
      { href: "/calendar", label: "Team Calendar" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resources", label: "Resource Library" },
      { href: "/meetings", label: "Meetings" },
      { href: "/login", label: "Member Login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-navy-light bg-brand-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="max-w-sm space-y-4">
            <Logo variant="light" />
            <p className="text-sm text-slate-400">
              Bridgeland High School&apos;s competitive STEM team, proudly representing the Bears
              in Cypress, Texas. Compete. Discover. Innovate.
            </p>
            <div className="space-y-1.5 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-brand-orange" aria-hidden="true" />
                <span>9640 FM 529, Cypress, TX 77433</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-brand-orange" aria-hidden="true" />
                <a href="mailto:scioly@bridgelandbears.example.org" className="hover:text-white">
                  scioly@bridgelandbears.example.org
                </a>
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Bridgeland Science Olympiad. Go Bears!</p>
          <p>
            Not affiliated with{" "}
            <a
              href="https://www.soinc.org/"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-white"
            >
              Science Olympiad, Inc.
            </a>{" "}
            — event rules &amp; manuals belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
