import { FlaskConical, type LucideIcon, type LucideProps } from "lucide-react";
import * as icons from "lucide-react";

function isLucideIcon(value: unknown): value is LucideIcon {
  return typeof value === "function" && typeof (value as { displayName?: string }).displayName === "string";
}

/** Renders a lucide-react icon by its string name (as stored in the DB). */
export function DynamicIcon({ name, ...props }: { name: string | null | undefined } & LucideProps) {
  const candidate = name ? (icons as unknown as Record<string, unknown>)[name] : null;
  const Icon = isLucideIcon(candidate) ? candidate : FlaskConical;
  return <Icon {...props} />;
}
