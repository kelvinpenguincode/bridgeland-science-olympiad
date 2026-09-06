"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3 } from "lucide-react";

export function BestEventsChart({ data }: { data: { event: string; count: number }[] }) {
  if (data.length === 0) {
    return <EmptyState icon={BarChart3} title="No medal data yet" className="h-full" />;
  }
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Medal-Earning Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="event" width={140} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, borderColor: "var(--border)", fontSize: 12 }}
                cursor={{ fill: "var(--muted)" }}
              />
              <Bar dataKey="count" name="Medals" fill="var(--brand-orange)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function MedalBreakdownChart({
  gold,
  silver,
  bronze,
}: {
  gold: number;
  silver: number;
  bronze: number;
}) {
  const data = [
    { medal: "Gold", count: gold, fill: "#eab308" },
    { medal: "Silver", count: silver, fill: "#94a3b8" },
    { medal: "Bronze", count: bronze, fill: "#c2703b" },
  ];
  if (gold + silver + bronze === 0) {
    return <EmptyState icon={BarChart3} title="No medals recorded yet" className="h-full" />;
  }
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Medal Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="medal" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, borderColor: "var(--border)", fontSize: 12 }}
                cursor={{ fill: "var(--muted)" }}
              />
              <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.medal} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
