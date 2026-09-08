import type { AppRole } from "@/types/database";

export type AnnouncementAuthor = {
  full_name: string | null;
  role: AppRole | null;
} | null | undefined;

/** Admin posts are attributed to the office; officer posts use the author's name. */
export function announcementByline(author: AnnouncementAuthor) {
  if (!author) return "Team";
  if (author.role === "admin" || author.role === "sponsor") return "Admins";
  return author.full_name?.trim() || "Team";
}
