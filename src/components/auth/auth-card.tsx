import type { ReactNode } from "react";

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
      {eyebrow && (
        <p className="mb-1.5 text-xs font-semibold tracking-[0.18em] text-brand-orange uppercase">{eyebrow}</p>
      )}
      <h1 className="font-heading text-2xl font-bold text-brand-navy">{title}</h1>
      {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-6">{children}</div>
      {footer && <div className="mt-6 border-t border-border pt-5 text-center text-sm">{footer}</div>}
    </div>
  );
}
