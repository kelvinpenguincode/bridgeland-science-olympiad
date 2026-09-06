import { Download, ExternalLink, FileText, Lock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RESOURCE_DIFFICULTY_LABELS, RESOURCE_TYPE_LABELS } from "@/types/domain";
import type { ResourceDifficulty, ResourceType, ResourceVisibility } from "@/types/database";

export interface ResourceCardData {
  id: string;
  title: string;
  description: string | null;
  type: ResourceType;
  year: number;
  url: string | null;
  visibility: ResourceVisibility;
  difficulty: ResourceDifficulty | null;
  event?: { name: string; slug: string } | null;
  author?: { full_name: string } | null;
}

const VISIBILITY_ICON = {
  public: null,
  members: Users,
  officers: Lock,
} as const;

export function ResourceCard({ resource }: { resource: ResourceCardData }) {
  const VisIcon = VISIBILITY_ICON[resource.visibility];
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange-dark">
            <FileText className="size-4" aria-hidden="true" />
          </span>
          {VisIcon && (
            <Badge variant="outline" className="gap-1 bg-muted text-xs">
              <VisIcon className="size-3" />
              {resource.visibility === "members" ? "Members" : "Officers"}
            </Badge>
          )}
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-brand-navy">{resource.title}</h3>
          {resource.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{resource.description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          <Badge variant="outline" className="bg-muted">
            {RESOURCE_TYPE_LABELS[resource.type]}
          </Badge>
          {resource.event && (
            <Badge variant="outline" className="bg-muted">
              {resource.event.name}
            </Badge>
          )}
          {resource.difficulty && (
            <Badge variant="outline" className="bg-muted">
              {RESOURCE_DIFFICULTY_LABELS[resource.difficulty]}
            </Badge>
          )}
          <Badge variant="outline" className="bg-muted">
            {resource.year}
          </Badge>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>{resource.author?.full_name ?? "Bridgeland SciOly"}</span>
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-medium text-brand-orange-dark hover:underline"
            >
              Open
              {resource.type === "video" || resource.type === "website" ? (
                <ExternalLink className="size-3" />
              ) : (
                <Download className="size-3" />
              )}
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
