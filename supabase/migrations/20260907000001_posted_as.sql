-- Announcement byline stored on the row so public visitors can read it
-- without joining private profile data.
alter table announcements add column if not exists posted_as text;
