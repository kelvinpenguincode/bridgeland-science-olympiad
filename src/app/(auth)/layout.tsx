import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-brand-navy"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to site
          </Link>
        </div>
      </header>
      <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
