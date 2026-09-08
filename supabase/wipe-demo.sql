-- Wipe demo / placeholder content. Does not delete real auth accounts
-- unless they used the old @demo.bridgelandscioly.org emails.

delete from placement_results;
delete from placement_tests;
delete from competition_results;
delete from competition_assignments;
delete from competition_schedule;
delete from competition_teams;
delete from competitions;
delete from meeting_attendance;
delete from meeting_attachments;
delete from meeting_events;
delete from meetings;
delete from calendar_events;
delete from event_assignments;
delete from event_members;
delete from team_members;
delete from resources;
delete from announcements;
delete from officers;
delete from scioly_events;
delete from teams;

delete from auth.identities
where user_id in (select id from auth.users where email like '%@demo.bridgelandscioly.org');
delete from auth.users where email like '%@demo.bridgelandscioly.org';

alter table announcements add column if not exists posted_as text;
