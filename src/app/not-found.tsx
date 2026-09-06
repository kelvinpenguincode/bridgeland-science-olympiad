import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
          <span className="flex size-16 items-center justify-center rounded-full bg-brand-orange-light text-brand-orange-dark">
            <Compass className="size-8" aria-hidden="true" />
          </span>
          <p className="mt-6 font-heading text-6xl font-bold text-brand-navy">404</p>
          <h1 className="mt-2 font-heading text-2xl font-bold text-brand-navy">Page not found</h1>
          <p className="mt-3 text-sm text-slate-600">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button render={<Link href="/" />}>Back to home</Button>
            <Button variant="outline" render={<Link href="/events" />}>
              Browse events
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
