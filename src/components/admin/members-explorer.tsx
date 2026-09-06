"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar, ALL_VALUE, type FilterConfig } from "@/components/shared/filter-bar";
import { DataTable } from "@/components/shared/data-table";
import { RoleBadge } from "@/components/shared/event-badge";
import { ROLE_LABELS } from "@/types/domain";
import { formatDate } from "@/lib/utils/date";
import { EditMemberButton } from "@/app/admin/members/member-dialogs";
import type { ProfileRow } from "@/types/database";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export function MembersExplorer({ members }: { members: ProfileRow[] }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState(ALL_VALUE);
  const [status, setStatus] = useState(ALL_VALUE);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (role !== ALL_VALUE && m.role !== role) return false;
      if (status === "active" && !m.is_active) return false;
      if (status === "inactive" && m.is_active) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!m.full_name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [members, search, role, status]);

  const filters: FilterConfig[] = [
    {
      key: "role",
      label: "Role",
      value: role,
      onChange: setRole,
      options: Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      key: "status",
      label: "Status",
      value: status,
      onChange: setStatus,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…" className="sm:max-w-xs" />
        <FilterBar filters={filters} onReset={() => { setRole(ALL_VALUE); setStatus(ALL_VALUE); }} />
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {members.length} members
      </p>

      <DataTable
        columns={[
          {
            key: "name",
            header: "Member",
            render: (m) => (
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage src={m.avatar_url ?? undefined} alt="" />
                  <AvatarFallback className="bg-brand-navy text-xs text-white">{initials(m.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-brand-navy">{m.full_name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
              </div>
            ),
          },
          { key: "role", header: "Role", render: (m) => <RoleBadge role={m.role} /> },
          { key: "grade", header: "Grade", render: (m) => m.grade ?? "—" },
          { key: "joined", header: "Joined", render: (m) => formatDate(m.joined_at) },
          {
            key: "status",
            header: "Status",
            render: (m) =>
              m.is_active ? (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  Inactive
                </Badge>
              ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (m) => (
              <div className="flex justify-end gap-1">
                <EditMemberButton member={m} />
              </div>
            ),
          },
        ]}
        data={filtered}
        getRowKey={(m) => m.id}
        emptyTitle="No members match your filters"
      />
    </div>
  );
}
