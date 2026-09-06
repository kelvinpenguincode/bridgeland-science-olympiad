import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact | Bridgeland Science Olympiad",
  description: "Get in touch with Bridgeland Science Olympiad — meeting info, sponsor contact, and general questions.",
};

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "bridgelandscioly@bridgelandbears.org",
    href: "mailto:bridgelandscioly@bridgelandbears.org",
  },
  {
    icon: Phone,
    label: "Front Office",
    value: "(281) 555-0142",
    href: "tel:+12815550142",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Bridgeland High School, Room 214 — Cypress, TX",
    href: "https://maps.google.com/?q=Bridgeland+High+School+Cypress+TX",
  },
  {
    icon: Clock,
    label: "General Meetings",
    value: "Thursdays, 4:00–5:30 PM during the school year",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="We'd Love to Hear From You"
        title="Contact Us"
        description="Questions about joining, sponsoring, or visiting a meeting? Reach out below — an officer or coach will get back to you soon."
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <div className="space-y-4">
          {CONTACT_DETAILS.map((item) => {
            const content = (
              <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange-dark">
                  <item.icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{item.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-brand-navy">{item.value}</p>
                </div>
              </div>
            );
            return item.href ? (
              <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block transition-shadow hover:shadow-md">
                {content}
              </a>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
        </div>
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-brand-navy">Send a Message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We typically respond within 2–3 school days.
          </p>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
