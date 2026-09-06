import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Bridgeland Science Olympiad wordmark. A minimalist orbital emblem
 * (no clipart) paired with a two-line wordmark. `variant="light"` is
 * used on dark backgrounds (navy navbar/footer).
 */
export function Logo({
  variant = "dark",
  className,
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const isLight = variant === "light";
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2",
        isLight && "focus-visible:ring-offset-brand-navy",
        className
      )}
      aria-label="Bridgeland Science Olympiad home"
    >
      <LogoMark light={isLight} />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-heading text-base font-bold tracking-tight",
            isLight ? "text-white" : "text-brand-navy"
          )}
        >
          Bridgeland
        </span>
        <span
          className={cn(
            "text-[11px] font-semibold tracking-[0.18em] uppercase",
            isLight ? "text-orange-300" : "text-brand-orange"
          )}
        >
          Science Olympiad
        </span>
      </span>
    </Link>
  );
}

export function LogoMark({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-navy transition-transform duration-200 group-hover:scale-105",
        light && "ring-1 ring-white/15",
        className
      )}
    >
      <svg viewBox="0 0 32 32" className="size-6" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="2.4" fill="#F97316" />
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="5.2"
          stroke="#F97316"
          strokeWidth="1.6"
          transform="rotate(0 16 16)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="5.2"
          stroke="#F8FAFC"
          strokeOpacity="0.85"
          strokeWidth="1.6"
          transform="rotate(60 16 16)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="5.2"
          stroke="#F8FAFC"
          strokeOpacity="0.55"
          strokeWidth="1.6"
          transform="rotate(120 16 16)"
        />
      </svg>
    </span>
  );
}
