import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ClipboardList, Clock, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EmptyState } from "@/components/shared/empty-state";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { formatDate } from "@/lib/utils/date";
import { listPublicPlacementTests } from "@/lib/data/placement";

export const metadata: Metadata = {
  title: "Placement Testing | Bridgeland Science Olympiad",
  description: "Placement testing dates, instructions, and policies for Bridgeland Science Olympiad.",
};

export const revalidate = 60;

const FAQ = [
  {
    q: "How are events assigned after placement testing?",
    a: "Officers and coaches rank students by score within each event, then finalize team rosters considering scores, schedule conflicts, and team balance. Final assignments always require officer/coach review — the ranking is a strong recommendation, not an automatic assignment.",
  },
  {
    q: "Can I test for more than one event?",
    a: "Yes. You may sign up for as many placement tests as you'd like, as long as the test times don't conflict. We encourage new members to try a few different events before committing.",
  },
  {
    q: "Where can I see my results?",
    a: "Once an officer releases results for a session, sign in and visit your Dashboard → Placement Results page. Individual scores are never posted publicly.",
  },
  {
    q: "What if I miss a placement test?",
    a: "Contact an officer or your coach as soon as possible. Depending on the event and season timeline, a makeup test may be arranged.",
  },
];

export default async function PlacementPage() {
  const tests = await listPublicPlacementTests();

  return (
    <>
      <PageHeader
        eyebrow="Find Your Event"
        title="Placement Testing"
        description="Placement tests help new and returning members find the Science Olympiad events that fit their strengths. Here's everything you need to know before test day."
        actions={
          <Button render={<Link href="/dashboard/results" />} variant="outline">
            View my results
          </Button>
        }
      />

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-brand-orange-dark uppercase">
            Upcoming &amp; Recent Sessions
          </h2>
          {tests.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No placement sessions scheduled yet" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {tests.map((t) => {
                const event = t.event as { name: string; slug: string; icon: string } | null;
                return (
                  <div key={t.id} className="rounded-xl border border-border bg-white p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange-dark">
                          <DynamicIcon name={event?.icon ?? "FlaskConical"} className="size-4" />
                        </span>
                        <span className="text-sm font-semibold text-brand-navy">{event?.name ?? "Event"}</span>
                      </div>
                      {t.results_released ? (
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="size-3" data-icon="inline-start" /> Released
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-brand-orange" /> {formatDate(t.test_date)}
                      </p>
                      {t.location && (
                        <p className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-brand-orange" /> {t.location}
                        </p>
                      )}
                    </div>
                    {t.notes && <p className="mt-3 text-sm text-slate-600">{t.notes}</p>}
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Individual scores are private. Signed-in members can view their own results once released.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-5">
            <h3 className="font-heading text-base font-semibold text-brand-navy">What to Bring</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
              <li>Pencil, calculator (if permitted for the event)</li>
              <li>Student ID or name for sign-in</li>
              <li>Water bottle — tests can run 30–50 minutes</li>
              <li>A printed or digital copy of the event rules, if available</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <h3 className="font-heading text-base font-semibold text-brand-navy">Testing Policies</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
              <li>Arrive on time — late arrivals may not be able to test that session.</li>
              <li>No phones or unauthorized reference materials during closed-note tests.</li>
              <li>Results are used as a strong signal, alongside attendance and officer input.</li>
              <li>Retesting is allowed with officer approval in limited circumstances.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Frequently Asked Questions
          </h2>
          <Accordion>
            {FAQ.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-slate-600">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </>
  );
}
