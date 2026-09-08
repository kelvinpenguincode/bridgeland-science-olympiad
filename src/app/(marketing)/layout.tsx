import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="marketing-surface flex min-h-full flex-1 flex-col">
      <ScrollProgress />
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
