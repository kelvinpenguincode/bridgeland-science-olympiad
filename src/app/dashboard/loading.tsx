import { CardGridSkeleton } from "@/components/shared/loading-skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-56 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <CardGridSkeleton count={8} />
    </div>
  );
}
