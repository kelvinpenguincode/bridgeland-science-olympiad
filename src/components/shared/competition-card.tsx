import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/date";
import { COMPETITION_TYPE_LABELS } from "@/types/domain";
import type { CompetitionRow } from "@/types/database";

export function CompetitionCard({ competition }: { competition: CompetitionRow }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="border-brand-navy/20 bg-brand-navy/5 text-brand-navy">
            {COMPETITION_TYPE_LABELS[competition.type]}
          </Badge>
          {competition.results_status === "released" && (
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
              Results Posted
            </Badge>
          )}
        </div>
        <h3 className="font-heading text-lg font-semibold text-brand-navy">{competition.name}</h3>
        <div className="space-y-1.5 text-sm text-slate-600">
          <p className="flex items-center gap-1.5">
            <Calendar className="size-4 text-brand-orange" aria-hidden="true" />
            {formatDate(competition.competition_date)}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="size-4 text-brand-orange" aria-hidden="true" />
            {competition.location}
          </p>
        </div>
        {competition.description && (
          <p className="line-clamp-2 text-sm text-slate-600">{competition.description}</p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="mt-auto w-fit self-end text-brand-orange-dark hover:bg-brand-orange-light hover:text-brand-orange-dark"
          render={<Link href={`/competitions/${competition.slug}`} />}
        >
          View Details
          <ArrowRight className="size-3.5" data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  );
}
