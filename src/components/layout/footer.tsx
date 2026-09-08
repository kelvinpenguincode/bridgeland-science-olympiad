import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { SITE } from "@/lib/content/site";

const columns = [
  {
    title: "Team",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/team", label: "Officers & Coaches" },
      { href: "/accomplishments", label: "Accomplishments" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Compete",
    links: [
      { href: "/events", label: "Events" },
      { href: "/competitions", label: "Competitions" },
      { href: "/calendar", label: "Team Calendar" },
      { href: "/meetings", label: "Meetings" },
    ],
  },
  {
    title: "Members",
    links: [
      { href: "/resources", label: "Resource Library" },
      { href: "/placement", label: "Placement Testing" },
      { href: "/results", label: "Live Results" },
      { href: "/login", label: "Member Login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="max-w-sm space-y-4">
            <Logo variant="light" />
            <p className="text-sm text-white/50">Excellence in Science, Together.</p>
            <div className="space-y-1.5 text-sm text-white/50">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-orange" aria-hidden="true" />
                <span>
                  {SITE.locationName}
                  <br />
                  {SITE.address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-brand-orange" aria-hidden="true" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/50 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Bridgeland Science Olympiad. All rights reserved.</p>
          <p>
            Not affiliated with{" "}
            <a href="https://www.soinc.org/" target="_blank" rel="noreferrer" className="underline hover:text-white">
              Science Olympiad, Inc.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
