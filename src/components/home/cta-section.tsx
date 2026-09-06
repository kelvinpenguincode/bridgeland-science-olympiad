import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-brand-navy py-16">
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-[0.08]" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">READY TO COMPETE?</h2>
        <p className="max-w-xl text-base text-slate-300">
          Whether you love labs, builds, or ciphers — there&apos;s a Science Olympiad event for
          you. New members are welcome all year long.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="bg-brand-orange text-white hover:bg-brand-orange-dark"
            render={<Link href="/contact" />}
          >
            Join the Team
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/25 bg-white/5 text-white hover:bg-white/10"
            render={<Link href="/events" />}
          >
            Browse Events
          </Button>
        </div>
      </div>
    </section>
  );
}
