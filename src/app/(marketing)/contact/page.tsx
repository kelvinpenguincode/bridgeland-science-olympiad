import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { SITE } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Bridgeland Science Olympiad.",
};

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    label: "Location",
    value: `${SITE.locationName}\n${SITE.address}`,
    href: SITE.mapsUrl,
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    icon: Clock,
    label: "Meetings",
    value: SITE.meetings,
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reach Out"
        title="Contact Us"
        description="Whether you're a seasoned competitor or just curious about science, there's a place for you on our team. No prior experience required!"
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <div className="space-y-4">
          {CONTACT_DETAILS.map((item) => {
            const content = (
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/15 text-brand-orange">
                  <item.icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-white/50 uppercase">{item.label}</p>
                  <p className="mt-0.5 whitespace-pre-line text-sm font-medium text-white">{item.value}</p>
                </div>
              </div>
            );
            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="block transition-shadow hover:shadow-md"
              >
                {content}
              </a>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-heading text-lg font-semibold text-white">Send a Message</h2>
          <p className="mt-1 text-sm text-white/55">We typically respond within 2–3 school days.</p>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
