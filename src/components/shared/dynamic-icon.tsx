import { FlaskConical, type LucideIcon, type LucideProps } from "lucide-react";
import * as icons from "lucide-react";

/** Renders a lucide-react icon by its string name (as stored in the DB). */
export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = (icons as unknown as Record<string, LucideIcon>)[name] ?? FlaskConical;
  return <Icon {...props} />;
}
