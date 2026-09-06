import { Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OfficerRow } from "@/types/database";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function OfficerCard({ officer }: { officer: OfficerRow }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-14 border border-border">
            <AvatarImage src={officer.photo_url ?? undefined} alt="" />
            <AvatarFallback className="bg-brand-navy text-sm font-semibold text-white">
              {initials(officer.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-heading text-base font-semibold text-brand-navy">{officer.full_name}</h3>
            <p className="text-sm font-medium text-brand-orange-dark">{officer.role_title}</p>
            {officer.grade && (
              <Badge variant="outline" className="mt-1 bg-muted text-xs">
                Grade {officer.grade}
              </Badge>
            )}
          </div>
        </div>
        {officer.bio && <p className="text-sm text-slate-600">{officer.bio}</p>}
        {officer.fun_fact && (
          <p className="mt-auto flex items-start gap-1.5 rounded-lg bg-brand-orange-light p-2.5 text-xs text-brand-orange-dark">
            <Sparkles className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-semibold">Fun fact:</strong> {officer.fun_fact}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
