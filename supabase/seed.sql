-- ============================================================================
-- Bridgeland Science Olympiad — Development Seed Data
--
-- ⚠ ALL PEOPLE, EMAILS, AND SCORES BELOW ARE FICTIONAL DEMO DATA.
-- No real Bridgeland High School students are represented. Safe to reset.
--
-- Demo login password for every seeded account: Bridgeland2027!
-- (e.g. ava.thompson@demo.bridgelandscioly.org / Bridgeland2027!)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Division C Events (2027 season) — all 23 current events
-- ----------------------------------------------------------------------------
insert into scioly_events (name, slug, category, description, icon, official_rules_url, official_resources_url, display_order) values
  ('Anatomy and Physiology', 'anatomy-and-physiology', 'life_personal_social', 'Study the excretory, immune, and nervous systems, applying anatomical and physiological knowledge to solve problems and interpret clinical scenarios.', 'HeartPulse', 'https://www.soinc.org/anatomy-physiology-c', 'https://www.soinc.org/anatomy-physiology-c', 1),
  ('Botany', 'botany', 'life_personal_social', 'Explore plant structures, physiology, ecology, and diversity through identification, data analysis, and lab-style stations.', 'Leaf', 'https://www.soinc.org/botany-c', 'https://www.soinc.org/botany-c', 2),
  ('Designer Genes', 'designer-genes', 'life_personal_social', 'Apply concepts of genetics, heredity, and biotechnology to solve problems ranging from Punnett squares to CRISPR.', 'Dna', 'https://www.soinc.org/designer-genes-c', 'https://www.soinc.org/designer-genes-c', 3),
  ('Disease Detectives', 'disease-detectives', 'life_personal_social', 'Investigate an epidemiological scenario, analyzing data to identify outbreak sources, risk factors, and public health responses.', 'Microscope', 'https://www.soinc.org/disease-detectives-c', 'https://www.soinc.org/disease-detectives-c', 4),
  ('Water Quality', 'water-quality', 'life_personal_social', 'Evaluate freshwater and marine ecosystems, water chemistry, and human impact through data analysis and identification tasks.', 'Droplets', 'https://www.soinc.org/water-quality-c', 'https://www.soinc.org/water-quality-c', 5),
  ('Astronomy', 'astronomy', 'earth_space', 'Analyze stellar evolution, deep-sky objects, and observational astronomy data using star charts and astrophysics concepts.', 'Telescope', 'https://www.soinc.org/astronomy-c', 'https://www.soinc.org/astronomy-c', 6),
  ('Dynamic Planet', 'dynamic-planet', 'earth_space', 'This year''s focus rotates through Earth systems such as glaciers, oceanography, or freshwater processes and hazards.', 'Globe2', 'https://www.soinc.org/dynamic-planet-c', 'https://www.soinc.org/dynamic-planet-c', 7),
  ('Remote Sensing', 'remote-sensing', 'earth_space', 'Interpret satellite and aerial imagery to answer questions about Earth science, land use, and atmospheric phenomena.', 'Satellite', 'https://www.soinc.org/remote-sensing-c', 'https://www.soinc.org/remote-sensing-c', 8),
  ('Rocks and Minerals', 'rocks-and-minerals', 'earth_space', 'Identify rock and mineral samples and apply knowledge of the rock cycle, plate tectonics, and mineral properties.', 'Gem', 'https://www.soinc.org/rocks-and-minerals-c', 'https://www.soinc.org/rocks-and-minerals-c', 9),
  ('Chemistry Lab', 'chemistry-lab', 'physical_chemistry', 'Complete hands-on laboratory tasks covering stoichiometry, thermochemistry, kinetics, and analytical chemistry techniques.', 'FlaskConical', 'https://www.soinc.org/chemistry-lab-c', 'https://www.soinc.org/chemistry-lab-c', 10),
  ('Circuit Lab', 'circuit-lab', 'physical_chemistry', 'Design, analyze, and troubleshoot analog and digital circuits, applying Ohm''s and Kirchhoff''s laws to real hardware.', 'CircuitBoard', 'https://www.soinc.org/circuit-lab-c', 'https://www.soinc.org/circuit-lab-c', 11),
  ('Forensics', 'forensics', 'physical_chemistry', 'Use chromatography, chemical tests, and trace evidence analysis to solve a simulated crime scenario.', 'Fingerprint', 'https://www.soinc.org/forensics-c', 'https://www.soinc.org/forensics-c', 12),
  ('Hovercraft', 'hovercraft', 'physical_chemistry', 'Design and build a hovercraft vehicle that completes a course efficiently while meeting strict construction constraints.', 'Wind', 'https://www.soinc.org/hovercraft-c', 'https://www.soinc.org/hovercraft-c', 13),
  ('Protein Modeling', 'protein-modeling', 'physical_chemistry', 'Build a physical model of a protein structure and answer questions on structure, function, and molecular visualization.', 'Atom', 'https://www.soinc.org/protein-modeling-c', 'https://www.soinc.org/protein-modeling-c', 14),
  ('Thermodynamics', 'thermodynamics', 'physical_chemistry', 'Design and build an insulated device while answering conceptual questions on heat transfer and thermodynamic laws.', 'Thermometer', 'https://www.soinc.org/thermodynamics-c', 'https://www.soinc.org/thermodynamics-c', 15),
  ('Boomilever', 'boomilever', 'tech_engineering', 'Design, build, and test a wood cantilevered structure optimized for the best structural-efficiency-to-weight ratio.', 'Construction', 'https://www.soinc.org/boomilever-c', 'https://www.soinc.org/boomilever-c', 16),
  ('Electric Vehicle', 'electric-vehicle', 'tech_engineering', 'Build an electric-powered vehicle that travels a target distance and stops as close as possible to a target line.', 'Car', 'https://www.soinc.org/electric-vehicle-c', 'https://www.soinc.org/electric-vehicle-c', 17),
  ('Mission Possible', 'mission-possible', 'tech_engineering', 'Construct a Rube Goldberg-style device that completes a chain of tasks culminating in a final triggered action.', 'Cog', 'https://www.soinc.org/mission-possible-c', 'https://www.soinc.org/mission-possible-c', 18),
  ('Wright Stuff', 'wright-stuff', 'tech_engineering', 'Design, build, and fly a rubber-band-powered free-flight aircraft optimized for maximum time aloft.', 'Plane', 'https://www.soinc.org/wright-stuff-c', 'https://www.soinc.org/wright-stuff-c', 19),
  ('Engineering CAD', 'engineering-cad', 'tech_engineering', 'Interpret and produce computer-aided design drawings, applying orthographic projection and dimensioning standards.', 'Ruler', 'https://www.soinc.org/engineering-cad-c', 'https://www.soinc.org/engineering-cad-c', 20),
  ('Codebusters', 'codebusters', 'inquiry_nature', 'Decrypt classical and modern ciphers — including Aristocrats, Xenocrypts, and Hill/RSA — under time pressure.', 'KeyRound', 'https://www.soinc.org/codebusters-c', 'https://www.soinc.org/codebusters-c', 21),
  ('Experimental Design', 'experimental-design', 'inquiry_nature', 'Design, conduct, and analyze an original experiment on the spot, then defend the methodology and conclusions.', 'TestTube2', 'https://www.soinc.org/experimental-design-c', 'https://www.soinc.org/experimental-design-c', 22),
  ('Ping-Pong Parachute', 'ping-pong-parachute', 'inquiry_nature', 'Design a container and parachute system to protect a ping-pong ball and maximize time aloft after a drop.', 'CircleDot', 'https://www.soinc.org/ping-pong-parachute-c', 'https://www.soinc.org/ping-pong-parachute-c', 23);

-- ----------------------------------------------------------------------------
-- 2. Teams
-- ----------------------------------------------------------------------------
insert into teams (name, season, description) values
  ('Varsity A', '2026-2027', 'Primary competition roster — highest overall placement priority at invitationals, regionals, and state.'),
  ('Varsity B', '2026-2027', 'Secondary competition roster — competes at invitationals and develops toward Varsity A.'),
  ('JV A', '2026-2027', 'Junior varsity roster for underclassmen building event experience.');

-- ----------------------------------------------------------------------------
-- 3. Demo people (auth.users + auth.identities -> profiles via trigger)
-- ----------------------------------------------------------------------------
do $$
declare
  v record;
  v_password text := 'Bridgeland2027!';
begin
  for v in select * from (values
    ('11111111-1111-1111-1111-111111111101'::uuid, 'ava.thompson@demo.bridgelandscioly.org', 'Ava Thompson'),
    ('11111111-1111-1111-1111-111111111102'::uuid, 'marcus.chen@demo.bridgelandscioly.org', 'Marcus Chen'),
    ('11111111-1111-1111-1111-111111111103'::uuid, 'priya.natarajan@demo.bridgelandscioly.org', 'Priya Natarajan'),
    ('11111111-1111-1111-1111-111111111104'::uuid, 'diego.ramirez@demo.bridgelandscioly.org', 'Diego Ramirez'),
    ('11111111-1111-1111-1111-111111111105'::uuid, 'sofia.alvarez@demo.bridgelandscioly.org', 'Sofia Alvarez'),
    ('11111111-1111-1111-1111-111111111106'::uuid, 'ethan.park@demo.bridgelandscioly.org', 'Ethan Park'),
    ('11111111-1111-1111-1111-111111111107'::uuid, 'lily.nguyen@demo.bridgelandscioly.org', 'Lily Nguyen'),
    ('11111111-1111-1111-1111-111111111108'::uuid, 'noah.patel@demo.bridgelandscioly.org', 'Noah Patel'),
    ('11111111-1111-1111-1111-111111111109'::uuid, 'grace.kim@demo.bridgelandscioly.org', 'Grace Kim'),
    ('11111111-1111-1111-1111-111111111110'::uuid, 'amanda.reyes@demo.bridgelandscioly.org', 'Dr. Amanda Reyes'),
    ('11111111-1111-1111-1111-111111111111'::uuid, 'james.whitfield@demo.bridgelandscioly.org', 'James Whitfield'),
    ('11111111-1111-1111-1111-111111111112'::uuid, 'olivia.martinez@demo.bridgelandscioly.org', 'Olivia Martinez'),
    ('11111111-1111-1111-1111-111111111113'::uuid, 'jackson.lee@demo.bridgelandscioly.org', 'Jackson Lee'),
    ('11111111-1111-1111-1111-111111111114'::uuid, 'emma.wilson@demo.bridgelandscioly.org', 'Emma Wilson'),
    ('11111111-1111-1111-1111-111111111115'::uuid, 'liam.johnson@demo.bridgelandscioly.org', 'Liam Johnson'),
    ('11111111-1111-1111-1111-111111111116'::uuid, 'chloe.davis@demo.bridgelandscioly.org', 'Chloe Davis'),
    ('11111111-1111-1111-1111-111111111117'::uuid, 'aiden.brooks@demo.bridgelandscioly.org', 'Aiden Brooks'),
    ('11111111-1111-1111-1111-111111111118'::uuid, 'zoey.carter@demo.bridgelandscioly.org', 'Zoey Carter'),
    ('11111111-1111-1111-1111-111111111119'::uuid, 'mason.rodriguez@demo.bridgelandscioly.org', 'Mason Rodriguez'),
    ('11111111-1111-1111-1111-111111111120'::uuid, 'isabella.foster@demo.bridgelandscioly.org', 'Isabella Foster')
  ) as t(id, email, full_name)
  loop
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000', v.id, 'authenticated', 'authenticated',
      v.email, crypt(v_password, gen_salt('bf')), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', v.full_name),
      now(), now(), '', '', '', ''
    )
    on conflict (id) do nothing;

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v.id, v.id::text,
      jsonb_build_object('sub', v.id::text, 'email', v.email),
      'email', now(), now(), now()
    )
    on conflict do nothing;
  end loop;
end;
$$;

-- Fill in role, grade, preferred name, joined date, short bios for dashboards.
update profiles set role = 'sponsor', grade = null, joined_at = '2019-08-01' where email = 'amanda.reyes@demo.bridgelandscioly.org';
update profiles set role = 'sponsor', grade = null, joined_at = '2021-08-01' where email = 'james.whitfield@demo.bridgelandscioly.org';
update profiles set role = 'officer', grade = 12, joined_at = '2023-08-15' where email = 'ava.thompson@demo.bridgelandscioly.org';
update profiles set role = 'officer', grade = 12, joined_at = '2023-08-15' where email = 'marcus.chen@demo.bridgelandscioly.org';
update profiles set role = 'officer', grade = 11, joined_at = '2024-08-15' where email = 'priya.natarajan@demo.bridgelandscioly.org';
update profiles set role = 'officer', grade = 11, joined_at = '2024-08-15' where email = 'diego.ramirez@demo.bridgelandscioly.org';
update profiles set role = 'event_captain', grade = 12, joined_at = '2023-08-15' where email = 'sofia.alvarez@demo.bridgelandscioly.org';
update profiles set role = 'event_captain', grade = 12, joined_at = '2023-08-15' where email = 'ethan.park@demo.bridgelandscioly.org';
update profiles set role = 'event_captain', grade = 11, joined_at = '2024-08-15' where email = 'lily.nguyen@demo.bridgelandscioly.org';
update profiles set role = 'event_captain', grade = 10, joined_at = '2025-08-15' where email = 'noah.patel@demo.bridgelandscioly.org';
update profiles set role = 'event_captain', grade = 12, joined_at = '2023-08-15' where email = 'grace.kim@demo.bridgelandscioly.org';
update profiles set role = 'member', grade = 10, joined_at = '2025-08-15' where email = 'olivia.martinez@demo.bridgelandscioly.org';
update profiles set role = 'member', grade = 9, joined_at = '2026-08-15' where email = 'jackson.lee@demo.bridgelandscioly.org';
update profiles set role = 'member', grade = 10, joined_at = '2025-08-15' where email = 'emma.wilson@demo.bridgelandscioly.org';
update profiles set role = 'member', grade = 9, joined_at = '2026-08-15' where email = 'liam.johnson@demo.bridgelandscioly.org';
update profiles set role = 'member', grade = 11, joined_at = '2024-08-15' where email = 'chloe.davis@demo.bridgelandscioly.org';
update profiles set role = 'member', grade = 9, joined_at = '2026-08-15' where email = 'aiden.brooks@demo.bridgelandscioly.org';
update profiles set role = 'member', grade = 10, joined_at = '2025-08-15' where email = 'zoey.carter@demo.bridgelandscioly.org';
update profiles set role = 'member', grade = 11, joined_at = '2024-08-15' where email = 'mason.rodriguez@demo.bridgelandscioly.org';
update profiles set role = 'member', grade = 9, joined_at = '2026-08-15' where email = 'isabella.foster@demo.bridgelandscioly.org';

update profiles set bio = 'Head Coach and lead sponsor teacher for Bridgeland Science Olympiad since 2019. AP Chemistry & Physics instructor.' where email = 'amanda.reyes@demo.bridgelandscioly.org';
update profiles set bio = 'Assistant Coach supporting engineering build events and tournament logistics.' where email = 'james.whitfield@demo.bridgelandscioly.org';

-- ----------------------------------------------------------------------------
-- 4. Officers directory (public team page)
-- ----------------------------------------------------------------------------
insert into officers (profile_id, full_name, role_title, category, grade, bio, fun_fact, display_order, is_active) values
  ((select id from profiles where email = 'ava.thompson@demo.bridgelandscioly.org'), 'Ava Thompson', 'Co-President', 'officer', '12th', 'Ava has competed in Science Olympiad for four years and leads officer meetings, team logistics, and tournament registration.', 'Has memorized the periodic table set to music.', 1, true),
  ((select id from profiles where email = 'marcus.chen@demo.bridgelandscioly.org'), 'Marcus Chen', 'Co-President', 'officer', '12th', 'Marcus oversees event captain coordination and represents the team at district STEM showcases.', 'Once built a working hovercraft out of a leaf blower.', 2, true),
  ((select id from profiles where email = 'priya.natarajan@demo.bridgelandscioly.org'), 'Priya Natarajan', 'Secretary', 'officer', '11th', 'Priya manages meeting notes, announcements, and the team calendar.', 'Speaks three languages fluently.', 3, true),
  ((select id from profiles where email = 'diego.ramirez@demo.bridgelandscioly.org'), 'Diego Ramirez', 'Treasurer', 'officer', '11th', 'Diego manages the team budget, fundraising, and tournament fee tracking.', 'Ran a 5K the morning of regionals last year.', 4, true),
  ((select id from profiles where email = 'sofia.alvarez@demo.bridgelandscioly.org'), 'Sofia Alvarez', 'Event Captain — Anatomy and Physiology', 'event_captain', '12th', 'Sofia leads Anatomy & Physiology practices and mentors underclassmen on the excretory and nervous systems.', 'Wants to become a trauma surgeon.', 5, true),
  ((select id from profiles where email = 'ethan.park@demo.bridgelandscioly.org'), 'Ethan Park', 'Event Captain — Chemistry Lab', 'event_captain', '12th', 'Ethan runs weekly Chemistry Lab practicals and titration drills.', 'Has a lab coat with his own periodic table pattern.', 6, true),
  ((select id from profiles where email = 'lily.nguyen@demo.bridgelandscioly.org'), 'Lily Nguyen', 'Event Captain — Codebusters', 'event_captain', '11th', 'Lily coaches the Codebusters squad on Aristocrats, Xenocrypts, and Hill ciphers.', 'Can solve a Rubik''s cube in under a minute.', 7, true),
  ((select id from profiles where email = 'noah.patel@demo.bridgelandscioly.org'), 'Noah Patel', 'Event Captain — Astronomy', 'event_captain', '10th', 'Noah organizes stargazing practices and deep-sky object study sessions.', 'Has his own telescope he built from a kit.', 8, true),
  ((select id from profiles where email = 'grace.kim@demo.bridgelandscioly.org'), 'Grace Kim', 'Event Captain — Engineering CAD', 'event_captain', '12th', 'Grace leads CAD practice sessions and reviews build-event drawings.', 'Designs 3D-printable board games for fun.', 9, true),
  ((select id from profiles where email = 'amanda.reyes@demo.bridgelandscioly.org'), 'Dr. Amanda Reyes', 'Head Coach', 'coach', null, 'Dr. Reyes has sponsored Bridgeland Science Olympiad since 2019 and teaches AP Chemistry and AP Physics.', 'Has a PhD in Analytical Chemistry.', 10, true),
  ((select id from profiles where email = 'james.whitfield@demo.bridgelandscioly.org'), 'James Whitfield', 'Assistant Coach', 'coach', null, 'Mr. Whitfield supports build-event mentorship and manages tournament travel logistics.', 'Former FIRST Robotics team mentor.', 11, true);

-- ----------------------------------------------------------------------------
-- 5. Team membership
-- ----------------------------------------------------------------------------
insert into team_members (team_id, profile_id)
select (select id from teams where name = 'Varsity A'), id from profiles
where email in (
  'ava.thompson@demo.bridgelandscioly.org','marcus.chen@demo.bridgelandscioly.org','priya.natarajan@demo.bridgelandscioly.org',
  'diego.ramirez@demo.bridgelandscioly.org','sofia.alvarez@demo.bridgelandscioly.org','ethan.park@demo.bridgelandscioly.org',
  'lily.nguyen@demo.bridgelandscioly.org','grace.kim@demo.bridgelandscioly.org'
);

insert into team_members (team_id, profile_id)
select (select id from teams where name = 'Varsity B'), id from profiles
where email in (
  'noah.patel@demo.bridgelandscioly.org','olivia.martinez@demo.bridgelandscioly.org','chloe.davis@demo.bridgelandscioly.org',
  'mason.rodriguez@demo.bridgelandscioly.org','emma.wilson@demo.bridgelandscioly.org','zoey.carter@demo.bridgelandscioly.org'
);

insert into team_members (team_id, profile_id)
select (select id from teams where name = 'JV A'), id from profiles
where email in (
  'jackson.lee@demo.bridgelandscioly.org','liam.johnson@demo.bridgelandscioly.org','aiden.brooks@demo.bridgelandscioly.org',
  'isabella.foster@demo.bridgelandscioly.org'
);

-- ----------------------------------------------------------------------------
-- 6. Event roster (public "assigned members" per event) + season assignments
-- ----------------------------------------------------------------------------
insert into event_members (event_id, profile_id, role, partner_profile_id) values
  ((select id from scioly_events where slug = 'anatomy-and-physiology'), (select id from profiles where email = 'sofia.alvarez@demo.bridgelandscioly.org'), 'captain', (select id from profiles where email = 'olivia.martinez@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'anatomy-and-physiology'), (select id from profiles where email = 'olivia.martinez@demo.bridgelandscioly.org'), 'member', (select id from profiles where email = 'sofia.alvarez@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'chemistry-lab'), (select id from profiles where email = 'ethan.park@demo.bridgelandscioly.org'), 'captain', (select id from profiles where email = 'chloe.davis@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'chemistry-lab'), (select id from profiles where email = 'chloe.davis@demo.bridgelandscioly.org'), 'member', (select id from profiles where email = 'ethan.park@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'codebusters'), (select id from profiles where email = 'lily.nguyen@demo.bridgelandscioly.org'), 'captain', (select id from profiles where email = 'mason.rodriguez@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'codebusters'), (select id from profiles where email = 'mason.rodriguez@demo.bridgelandscioly.org'), 'member', (select id from profiles where email = 'lily.nguyen@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'astronomy'), (select id from profiles where email = 'noah.patel@demo.bridgelandscioly.org'), 'captain', (select id from profiles where email = 'zoey.carter@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'astronomy'), (select id from profiles where email = 'zoey.carter@demo.bridgelandscioly.org'), 'member', (select id from profiles where email = 'noah.patel@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'engineering-cad'), (select id from profiles where email = 'grace.kim@demo.bridgelandscioly.org'), 'captain', (select id from profiles where email = 'marcus.chen@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'engineering-cad'), (select id from profiles where email = 'marcus.chen@demo.bridgelandscioly.org'), 'member', (select id from profiles where email = 'grace.kim@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'disease-detectives'), (select id from profiles where email = 'priya.natarajan@demo.bridgelandscioly.org'), 'captain', (select id from profiles where email = 'emma.wilson@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'disease-detectives'), (select id from profiles where email = 'emma.wilson@demo.bridgelandscioly.org'), 'member', (select id from profiles where email = 'priya.natarajan@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'dynamic-planet'), (select id from profiles where email = 'diego.ramirez@demo.bridgelandscioly.org'), 'captain', (select id from profiles where email = 'jackson.lee@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'dynamic-planet'), (select id from profiles where email = 'jackson.lee@demo.bridgelandscioly.org'), 'member', (select id from profiles where email = 'diego.ramirez@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'boomilever'), (select id from profiles where email = 'ava.thompson@demo.bridgelandscioly.org'), 'captain', (select id from profiles where email = 'aiden.brooks@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'boomilever'), (select id from profiles where email = 'aiden.brooks@demo.bridgelandscioly.org'), 'member', (select id from profiles where email = 'ava.thompson@demo.bridgelandscioly.org'));

-- Season assignment matrix (event_assignments) — mirrors most of the roster
-- above, intentionally leaves a few events unfilled and gives one student
-- an overload (Marcus: 3 events) to exercise the admin matrix warnings.
insert into event_assignments (event_id, profile_id, team_id, partner_profile_id, season)
select em.event_id, em.profile_id,
  (select team_id from team_members tm where tm.profile_id = em.profile_id limit 1),
  em.partner_profile_id, '2026-2027'
from event_members em;

insert into event_assignments (event_id, profile_id, team_id, season) values
  ((select id from scioly_events where slug = 'water-quality'), (select id from profiles where email = 'liam.johnson@demo.bridgelandscioly.org'), (select id from teams where name = 'JV A'), '2026-2027'),
  ((select id from scioly_events where slug = 'forensics'), (select id from profiles where email = 'isabella.foster@demo.bridgelandscioly.org'), (select id from teams where name = 'JV A'), '2026-2027'),
  ((select id from scioly_events where slug = 'wright-stuff'), (select id from profiles where email = 'marcus.chen@demo.bridgelandscioly.org'), (select id from teams where name = 'Varsity A'), '2026-2027'),
  ((select id from scioly_events where slug = 'circuit-lab'), (select id from profiles where email = 'marcus.chen@demo.bridgelandscioly.org'), (select id from teams where name = 'Varsity A'), '2026-2027');

-- ----------------------------------------------------------------------------
-- 7. Meetings (relative to current_date so the "next meeting" is always live)
-- ----------------------------------------------------------------------------
insert into meetings (title, meeting_date, start_time, end_time, location, description, agenda, required_materials, attendance_required, notes, slide_url) values
  ('General Team Meeting', current_date + 4, '16:15', '17:30', 'Bridgeland HS — Room S204', 'Weekly all-team meeting covering announcements, event practice check-ins, and upcoming tournament logistics.', '1. Officer announcements\n2. Regional registration walkthrough\n3. Event captain check-ins\n4. Practice time by event', 'Laptop or notes, event binder', true, null, null),
  ('Officer Planning Meeting', current_date + 2, '16:00', '16:45', 'Bridgeland HS — Room S204', 'Officers align on agenda for the upcoming general meeting and review placement test logistics.', '1. Review placement results release\n2. Finalize regional roster\n3. Budget check-in', null, false, null, null),
  ('General Team Meeting', current_date - 3, '16:15', '17:30', 'Bridgeland HS — Room S204', 'Weekly all-team meeting.', '1. Announcements\n2. Invitational recap\n3. Event practice', 'Laptop or notes', true, 'Reviewed Cypress Ranch Invitational results. Reminder to submit medical forms before Klein Invitational.', 'https://drive.example.com/slides/general-meeting-week1.pdf'),
  ('General Team Meeting', current_date - 10, '16:15', '17:30', 'Bridgeland HS — Room S204', 'Weekly all-team meeting kicking off the second semester push.', '1. Welcome back\n2. Team assignment matrix walkthrough\n3. Event practice', 'Laptop or notes', true, 'Introduced the new event assignment matrix and answered questions about placement testing.', 'https://drive.example.com/slides/general-meeting-week0.pdf'),
  ('Build Event Work Session', current_date - 6, '15:45', '18:00', 'Bridgeland HS — Engineering Lab', 'Open build session for Boomilever, Hovercraft, and Wright Stuff teams.', 'Open build & test time — no formal agenda', 'Safety glasses, build materials', false, 'Boomilever prototype #3 held 11kg before failure — solid improvement.', null);

insert into meeting_events (meeting_id, event_id)
select m.id, e.id from meetings m, scioly_events e
where m.title = 'Build Event Work Session' and e.slug in ('boomilever', 'hovercraft', 'wright-stuff');

insert into meeting_attachments (meeting_id, name, url)
select id, 'Meeting Slides', slide_url from meetings where slide_url is not null;

-- Attendance for the two past general meetings.
insert into meeting_attendance (meeting_id, profile_id, status, marked_by)
select m.id, p.id,
  (array['present','present','present','late','present','excused','present','present','absent','present'])[((row_number() over (order by p.id))::int % 10) + 1]::attendance_status,
  (select id from profiles where email = 'ava.thompson@demo.bridgelandscioly.org')
from meetings m
cross join profiles p
where m.title = 'General Team Meeting' and m.meeting_date < current_date
  and p.role in ('member', 'officer', 'event_captain');

-- ----------------------------------------------------------------------------
-- 8. Calendar events
-- ----------------------------------------------------------------------------
insert into calendar_events (title, description, category, location, start_at, end_at, all_day, created_by) values
  ('General Team Meeting', 'Weekly all-team meeting.', 'general_meeting', 'Room S204', current_date + 4 + time '16:15', current_date + 4 + time '17:30', false, (select id from profiles where email = 'priya.natarajan@demo.bridgelandscioly.org')),
  ('Officer Planning Meeting', 'Officers align on agenda.', 'officer_meeting', 'Room S204', current_date + 2 + time '16:00', current_date + 2 + time '16:45', false, (select id from profiles where email = 'priya.natarajan@demo.bridgelandscioly.org')),
  ('Chemistry Lab Practice', 'Weekly Chemistry Lab practical run-through.', 'event_practice', 'Chem Lab 2', current_date + 5 + time '16:00', current_date + 5 + time '17:30', false, (select id from profiles where email = 'ethan.park@demo.bridgelandscioly.org')),
  ('Astronomy Practice', 'Star chart drills and deep-sky object review.', 'event_practice', 'Room S204', current_date + 6 + time '16:00', current_date + 6 + time '17:00', false, (select id from profiles where email = 'noah.patel@demo.bridgelandscioly.org')),
  ('Placement Test — Circuit Lab', 'Placement test for students interested in Circuit Lab.', 'placement_test', 'Room S204', current_date + 9 + time '16:00', current_date + 9 + time '17:30', false, (select id from profiles where email = 'amanda.reyes@demo.bridgelandscioly.org')),
  ('Practice Test — Anatomy and Physiology', 'Full-length timed practice test.', 'practice_test', 'Room S204', current_date + 8 + time '16:00', current_date + 8 + time '17:30', false, (select id from profiles where email = 'sofia.alvarez@demo.bridgelandscioly.org')),
  ('Build Event Work Session', 'Open build time for Boomilever, Hovercraft, Wright Stuff.', 'build_test_session', 'Engineering Lab', current_date + 7 + time '15:45', current_date + 7 + time '18:00', false, (select id from profiles where email = 'ava.thompson@demo.bridgelandscioly.org')),
  ('Klein Invitational Registration Deadline', 'Final day to confirm your roster spot for the Klein Invitational.', 'deadline', null, current_date + 5, current_date + 5, true, (select id from profiles where email = 'diego.ramirez@demo.bridgelandscioly.org')),
  ('Klein Invitational', 'Away tournament — departs from the Bridgeland HS bus loop.', 'competition', 'Klein High School', current_date + 20 + time '06:30', current_date + 20 + time '19:00', false, (select id from profiles where email = 'amanda.reyes@demo.bridgelandscioly.org')),
  ('Cypress Ranch Invitational', 'Away tournament.', 'competition', 'Cypress Ranch High School', current_date + 45 + time '06:30', current_date + 45 + time '19:00', false, (select id from profiles where email = 'amanda.reyes@demo.bridgelandscioly.org')),
  ('Region V Regional Tournament', 'Regional qualifier tournament.', 'competition', 'TBD Regional Site', current_date + 80 + time '06:00', current_date + 80 + time '20:00', false, (select id from profiles where email = 'amanda.reyes@demo.bridgelandscioly.org')),
  ('Build Event Work Session', 'Open build time.', 'build_test_session', 'Engineering Lab', current_date - 6 + time '15:45', current_date - 6 + time '18:00', false, (select id from profiles where email = 'ava.thompson@demo.bridgelandscioly.org'));

-- ----------------------------------------------------------------------------
-- 9. Competitions (multi-season history + upcoming season)
-- ----------------------------------------------------------------------------
insert into competitions (name, slug, type, competition_date, location, address, departure_time, return_estimate, description, registration_deadline, what_to_bring, forms_url, results_status) values
  ('Awty International Invitational', 'awty-international-invitational-2024', 'invitational', '2024-11-09', 'The Awty International School', '7455 Awty School Ln, Houston, TX 77055', '06:00', '7:00 PM', 'Season-opening invitational against a large field of Houston-area teams.', '2024-10-25', 'Event binders, calculator, closed-toe shoes, packed lunch', 'https://forms.example.com/awty-2024', 'released'),
  ('Region V Regional Tournament', 'region-v-regional-2025', 'regional', '2025-02-22', 'Cypress Woods High School', '10801 Woods Springs Ln, Cypress, TX 77433', '06:30', '6:00 PM', 'Regional qualifying tournament for the 2024-2025 season.', '2025-02-01', 'Event binders, calculator, team shirt', 'https://forms.example.com/regional-2025', 'released'),
  ('Awty International Invitational', 'awty-international-invitational-2025', 'invitational', '2025-11-08', 'The Awty International School', '7455 Awty School Ln, Houston, TX 77055', '06:00', '7:00 PM', 'Season-opening invitational.', '2025-10-24', 'Event binders, calculator, closed-toe shoes, packed lunch', 'https://forms.example.com/awty-2025', 'released'),
  ('Cypress Ranch Invitational', 'cypress-ranch-invitational-2025', 'invitational', '2025-12-06', 'Cypress Ranch High School', '10118 Fry Rd, Cypress, TX 77433', '06:30', '6:30 PM', 'Large invitational hosted by Cypress Ranch HS.', '2025-11-21', 'Event binders, calculator, team shirt', 'https://forms.example.com/cyranch-2025', 'released'),
  ('Region V Regional Tournament', 'region-v-regional-2026', 'regional', '2026-02-21', 'Cypress Woods High School', '10801 Woods Springs Ln, Cypress, TX 77433', '06:30', '6:00 PM', 'Regional qualifying tournament for the 2025-2026 season.', '2026-01-31', 'Event binders, calculator, team shirt', 'https://forms.example.com/regional-2026', 'released'),
  ('Texas State Tournament', 'texas-state-2026', 'state', '2026-04-18', 'University of Texas at Austin', '2515 Speedway, Austin, TX 78712', '05:30', '9:00 PM (overnight)', 'State tournament for teams that qualified via regionals.', '2026-03-28', 'Event binders, calculator, overnight bag, team shirt', 'https://forms.example.com/state-2026', 'released'),
  ('Klein Invitational', 'klein-invitational-2027', 'invitational', current_date + 20, 'Klein High School', '4906 FM 2920 Rd, Spring, TX 77388', '06:30', '7:00 PM', 'Early-season invitational against Klein ISD and Houston-area teams.', current_date + 5, 'Event binders, calculator, closed-toe shoes, packed lunch, permission form', 'https://forms.example.com/klein-2027', 'pending'),
  ('Cypress Ranch Invitational', 'cypress-ranch-invitational-2027', 'invitational', current_date + 45, 'Cypress Ranch High School', '10118 Fry Rd, Cypress, TX 77433', '06:30', '6:30 PM', 'Large invitational hosted by Cypress Ranch HS.', current_date + 30, 'Event binders, calculator, team shirt', 'https://forms.example.com/cyranch-2027', 'pending'),
  ('Region V Regional Tournament', 'region-v-regional-2027', 'regional', current_date + 80, 'TBD Regional Site', 'Location announced closer to the event', '06:00', '8:00 PM', 'Regional qualifying tournament for the 2026-2027 season.', current_date + 60, 'Event binders, calculator, team shirt', 'https://forms.example.com/regional-2027', 'pending');

insert into competition_teams (competition_id, team_id)
select c.id, t.id from competitions c
join teams t on t.name in ('Varsity A', 'Varsity B')
where c.slug in ('klein-invitational-2027', 'cypress-ranch-invitational-2027', 'region-v-regional-2027');

-- ----------------------------------------------------------------------------
-- 10. Historical competition results (for /results stats + charts)
-- ----------------------------------------------------------------------------
insert into competition_results (competition_id, event_id, team_id, placement, medal, score, notes) values
  ((select id from competitions where slug = 'awty-international-invitational-2024'), null, (select id from teams where name = 'Varsity A'), 6, 'none', null, 'Overall team placement'),
  ((select id from competitions where slug = 'awty-international-invitational-2024'), (select id from scioly_events where slug = 'codebusters'), (select id from teams where name = 'Varsity A'), 2, 'silver', 312, null),
  ((select id from competitions where slug = 'awty-international-invitational-2024'), (select id from scioly_events where slug = 'anatomy-and-physiology'), (select id from teams where name = 'Varsity A'), 4, 'none', 88, null),

  ((select id from competitions where slug = 'region-v-regional-2025'), null, (select id from teams where name = 'Varsity A'), 4, 'none', null, 'Overall team placement'),
  ((select id from competitions where slug = 'region-v-regional-2025'), (select id from scioly_events where slug = 'chemistry-lab'), (select id from teams where name = 'Varsity A'), 3, 'bronze', 91, null),
  ((select id from competitions where slug = 'region-v-regional-2025'), (select id from scioly_events where slug = 'engineering-cad'), (select id from teams where name = 'Varsity A'), 1, 'gold', 97, null),

  ((select id from competitions where slug = 'awty-international-invitational-2025'), null, (select id from teams where name = 'Varsity A'), 3, 'bronze', null, 'Overall team placement'),
  ((select id from competitions where slug = 'awty-international-invitational-2025'), (select id from scioly_events where slug = 'astronomy'), (select id from teams where name = 'Varsity A'), 1, 'gold', 95, null),
  ((select id from competitions where slug = 'awty-international-invitational-2025'), (select id from scioly_events where slug = 'codebusters'), (select id from teams where name = 'Varsity A'), 2, 'silver', 340, null),
  ((select id from competitions where slug = 'awty-international-invitational-2025'), null, (select id from teams where name = 'Varsity B'), 12, 'none', null, 'Overall team placement'),

  ((select id from competitions where slug = 'cypress-ranch-invitational-2025'), null, (select id from teams where name = 'Varsity A'), 2, 'silver', null, 'Overall team placement'),
  ((select id from competitions where slug = 'cypress-ranch-invitational-2025'), (select id from scioly_events where slug = 'disease-detectives'), (select id from teams where name = 'Varsity A'), 1, 'gold', 96, null),
  ((select id from competitions where slug = 'cypress-ranch-invitational-2025'), (select id from scioly_events where slug = 'engineering-cad'), (select id from teams where name = 'Varsity A'), 2, 'silver', 92, null),
  ((select id from competitions where slug = 'cypress-ranch-invitational-2025'), (select id from scioly_events where slug = 'boomilever'), (select id from teams where name = 'Varsity A'), 3, 'bronze', 88.5, null),
  ((select id from competitions where slug = 'cypress-ranch-invitational-2025'), null, (select id from teams where name = 'Varsity B'), 9, 'none', null, 'Overall team placement'),

  ((select id from competitions where slug = 'region-v-regional-2026'), null, (select id from teams where name = 'Varsity A'), 2, 'silver', null, 'Overall team placement — qualified for state'),
  ((select id from competitions where slug = 'region-v-regional-2026'), (select id from scioly_events where slug = 'anatomy-and-physiology'), (select id from teams where name = 'Varsity A'), 1, 'gold', 98, null),
  ((select id from competitions where slug = 'region-v-regional-2026'), (select id from scioly_events where slug = 'dynamic-planet'), (select id from teams where name = 'Varsity A'), 2, 'silver', 90, null),
  ((select id from competitions where slug = 'region-v-regional-2026'), (select id from scioly_events where slug = 'codebusters'), (select id from teams where name = 'Varsity A'), 1, 'gold', 355, null),

  ((select id from competitions where slug = 'texas-state-2026'), null, (select id from teams where name = 'Varsity A'), 8, 'none', null, 'Overall team placement at state'),
  ((select id from competitions where slug = 'texas-state-2026'), (select id from scioly_events where slug = 'codebusters'), (select id from teams where name = 'Varsity A'), 5, 'none', 330, null),
  ((select id from competitions where slug = 'texas-state-2026'), (select id from scioly_events where slug = 'engineering-cad'), (select id from teams where name = 'Varsity A'), 3, 'bronze', 89, null);

-- ----------------------------------------------------------------------------
-- 11. Resources
-- ----------------------------------------------------------------------------
insert into resources (title, description, event_id, year, type, url, author_id, visibility, difficulty) values
  ('Anatomy & Physiology: Nervous System Study Guide', 'Comprehensive study guide covering neuron structure, reflex arcs, and CNS/PNS organization.', (select id from scioly_events where slug = 'anatomy-and-physiology'), 2027, 'study_guide', 'https://drive.example.com/resources/ap-nervous-system-guide.pdf', (select id from profiles where email = 'sofia.alvarez@demo.bridgelandscioly.org'), 'members', 'intermediate'),
  ('A&P Practice Test #1 (Excretory System)', 'Timed 50-minute practice test with answer key on the excretory system.', (select id from scioly_events where slug = 'anatomy-and-physiology'), 2027, 'practice_test', 'https://drive.example.com/resources/ap-practice-1.pdf', (select id from profiles where email = 'sofia.alvarez@demo.bridgelandscioly.org'), 'members', 'advanced'),
  ('Chemistry Lab: Titration Technique Video', 'Short video demonstrating proper acid-base titration technique for lab practicals.', (select id from scioly_events where slug = 'chemistry-lab'), 2027, 'video', 'https://video.example.com/titration-technique', (select id from profiles where email = 'ethan.park@demo.bridgelandscioly.org'), 'public', 'intro'),
  ('Chemistry Lab Formula Reference Sheet', 'One-page reference sheet of key equations for stoichiometry and thermochemistry.', (select id from scioly_events where slug = 'chemistry-lab'), 2027, 'reference_sheet', 'https://drive.example.com/resources/chem-lab-formulas.pdf', (select id from profiles where email = 'ethan.park@demo.bridgelandscioly.org'), 'public', 'intro'),
  ('Codebusters Cipher Cheat Sheet', 'Quick-reference guide to Aristocrats, Xenocrypts, Baconian, and Hill cipher solving strategies.', (select id from scioly_events where slug = 'codebusters'), 2027, 'reference_sheet', 'https://drive.example.com/resources/codebusters-cheat-sheet.pdf', (select id from profiles where email = 'lily.nguyen@demo.bridgelandscioly.org'), 'public', 'intro'),
  ('Codebusters Practice Packet — RSA & Hill Ciphers', 'Advanced practice packet with worked solutions for modern cipher types.', (select id from scioly_events where slug = 'codebusters'), 2027, 'practice_test', 'https://drive.example.com/resources/codebusters-rsa-hill.pdf', (select id from profiles where email = 'lily.nguyen@demo.bridgelandscioly.org'), 'members', 'advanced'),
  ('Astronomy: Deep Sky Object Flashcards', 'Digital flashcard deck of Messier objects and their key properties.', (select id from scioly_events where slug = 'astronomy'), 2027, 'notes', 'https://cards.example.com/astronomy-deep-sky', (select id from profiles where email = 'noah.patel@demo.bridgelandscioly.org'), 'public', 'intro'),
  ('Astronomy Data Analysis Walkthrough', 'Slide deck walking through light curve and HR diagram data analysis questions.', (select id from scioly_events where slug = 'astronomy'), 2027, 'presentation', 'https://drive.example.com/resources/astronomy-data-analysis.pdf', (select id from profiles where email = 'noah.patel@demo.bridgelandscioly.org'), 'members', 'intermediate'),
  ('Engineering CAD Drawing Standards Notes', 'Notes on orthographic projection, dimensioning, and title block conventions.', (select id from scioly_events where slug = 'engineering-cad'), 2027, 'notes', 'https://drive.example.com/resources/cad-standards-notes.pdf', (select id from profiles where email = 'grace.kim@demo.bridgelandscioly.org'), 'members', 'intro'),
  ('Disease Detectives: Outbreak Investigation Framework', 'Step-by-step framework for analyzing epidemiological curves and calculating attack rates.', (select id from scioly_events where slug = 'disease-detectives'), 2027, 'study_guide', 'https://drive.example.com/resources/disease-detectives-framework.pdf', (select id from profiles where email = 'priya.natarajan@demo.bridgelandscioly.org'), 'members', 'intermediate'),
  ('Dynamic Planet: Glaciers Unit Notes', 'Notes covering glacial landforms, mass balance, and climate interactions.', (select id from scioly_events where slug = 'dynamic-planet'), 2027, 'notes', 'https://drive.example.com/resources/dynamic-planet-glaciers.pdf', (select id from profiles where email = 'diego.ramirez@demo.bridgelandscioly.org'), 'public', 'intro'),
  ('Boomilever Design Calculations Spreadsheet', 'Spreadsheet template for calculating structural-efficiency ratios during design iteration.', (select id from scioly_events where slug = 'boomilever'), 2027, 'reference_sheet', 'https://drive.example.com/resources/boomilever-calc-sheet.xlsx', (select id from profiles where email = 'ava.thompson@demo.bridgelandscioly.org'), 'officers', 'advanced'),
  ('Water Quality Macroinvertebrate ID Chart', 'Illustrated identification chart for common freshwater macroinvertebrates.', (select id from scioly_events where slug = 'water-quality'), 2027, 'reference_sheet', 'https://drive.example.com/resources/water-quality-id-chart.pdf', (select id from profiles where email = 'amanda.reyes@demo.bridgelandscioly.org'), 'public', 'intro'),
  ('Forensics Chromatography Lab Notes', 'Notes and diagrams on paper and thin-layer chromatography setup for forensics stations.', (select id from scioly_events where slug = 'forensics'), 2027, 'notes', 'https://drive.example.com/resources/forensics-chromatography.pdf', (select id from profiles where email = 'amanda.reyes@demo.bridgelandscioly.org'), 'members', 'intermediate'),
  ('Official Science Olympiad Website', 'Official national Science Olympiad site — rules manuals, event updates, and season info.', null, 2027, 'website', 'https://www.soinc.org/', (select id from profiles where email = 'amanda.reyes@demo.bridgelandscioly.org'), 'public', null);

-- ----------------------------------------------------------------------------
-- 12. Placement testing (one released, one pending — demonstrates privacy)
-- ----------------------------------------------------------------------------
insert into placement_tests (event_id, test_date, max_score, notes, results_released, released_at, created_by) values
  ((select id from scioly_events where slug = 'anatomy-and-physiology'), current_date - 14, 100, 'Placement test administered to determine the Anatomy & Physiology roster.', true, current_date - 10, (select id from profiles where email = 'amanda.reyes@demo.bridgelandscioly.org')),
  ((select id from scioly_events where slug = 'circuit-lab'), current_date + 9, 50, 'Placement test for Circuit Lab — results will be released after grading.', false, null, (select id from profiles where email = 'amanda.reyes@demo.bridgelandscioly.org'));

insert into placement_results (placement_test_id, profile_id, raw_score, status, recommended_assignment) values
  ((select id from placement_tests where event_id = (select id from scioly_events where slug = 'anatomy-and-physiology') and test_date = current_date - 14),
    (select id from profiles where email = 'sofia.alvarez@demo.bridgelandscioly.org'), 96, 'selected', 'Varsity A — Anatomy and Physiology'),
  ((select id from placement_tests where event_id = (select id from scioly_events where slug = 'anatomy-and-physiology') and test_date = current_date - 14),
    (select id from profiles where email = 'olivia.martinez@demo.bridgelandscioly.org'), 89, 'selected', 'Varsity A — Anatomy and Physiology'),
  ((select id from placement_tests where event_id = (select id from scioly_events where slug = 'anatomy-and-physiology') and test_date = current_date - 14),
    (select id from profiles where email = 'emma.wilson@demo.bridgelandscioly.org'), 81, 'alternate', 'Varsity B — Anatomy and Physiology (Alternate)'),
  ((select id from placement_tests where event_id = (select id from scioly_events where slug = 'anatomy-and-physiology') and test_date = current_date - 14),
    (select id from profiles where email = 'isabella.foster@demo.bridgelandscioly.org'), 68, 'not_assigned', null);

insert into placement_results (placement_test_id, profile_id, raw_score, status, hide_raw_score) values
  ((select id from placement_tests where event_id = (select id from scioly_events where slug = 'circuit-lab') and test_date = current_date + 9),
    (select id from profiles where email = 'marcus.chen@demo.bridgelandscioly.org'), 44, 'pending', true),
  ((select id from placement_tests where event_id = (select id from scioly_events where slug = 'circuit-lab') and test_date = current_date + 9),
    (select id from profiles where email = 'mason.rodriguez@demo.bridgelandscioly.org'), 39, 'pending', true);

-- ----------------------------------------------------------------------------
-- 13. Announcements
-- ----------------------------------------------------------------------------
insert into announcements (title, slug, summary, content, author_id, publish_at, priority, audience, is_pinned) values
  ('Klein Invitational Registration Now Open', 'klein-invitational-registration-open', 'Confirm your roster spot for the Klein Invitational before the deadline.', 'Registration for the Klein Invitational is now open. Please confirm your availability with your event captain and submit your permission form to Mr. Whitfield by the deadline shown on the team calendar. Bus departs from the Bridgeland HS bus loop at 6:30 AM.', (select id from profiles where email = 'diego.ramirez@demo.bridgelandscioly.org'), now() - interval '2 days', 'urgent', 'everyone', true),
  ('Welcome Back — Spring Semester Kickoff', 'spring-semester-kickoff', 'Here''s what to expect as we head into tournament season.', 'Welcome back, Bears! This semester we''re focused on tournament prep: Klein Invitational, Cypress Ranch Invitational, and Region V Regionals are all on the calendar. Check /dashboard/events for your assignments and reach out to your event captain with any questions.', (select id from profiles where email = 'ava.thompson@demo.bridgelandscioly.org'), now() - interval '9 days', 'important', 'everyone', false),
  ('Anatomy & Physiology Placement Results Released', 'ap-placement-results-released', 'Placement results for Anatomy and Physiology are now available.', 'Placement results for the Anatomy and Physiology test are now available under Dashboard → Placement Results. If you have questions about your placement, reach out to Dr. Reyes or your event captain.', (select id from profiles where email = 'amanda.reyes@demo.bridgelandscioly.org'), now() - interval '10 days', 'important', 'members', false),
  ('Officer Nominations Opening Soon', 'officer-nominations-opening-soon', 'Interested in a leadership role next year? Nominations open next month.', 'Officer nominations for the 2027-2028 season will open next month. Current officers will host an info session before nominations begin — details to follow.', (select id from profiles where email = 'ava.thompson@demo.bridgelandscioly.org'), now() - interval '1 day', 'normal', 'officers', false),
  ('Codebusters Extra Practice This Week', 'codebusters-extra-practice', 'Extra Codebusters practice added ahead of Klein Invitational.', 'We''re adding an extra Codebusters practice this week focused on Hill ciphers. Bring a laptop if you have one — we''ll be using online cipher tools.', (select id from profiles where email = 'lily.nguyen@demo.bridgelandscioly.org'), now() - interval '4 hours', 'normal', 'event', false);

update announcements set audience_event_id = (select id from scioly_events where slug = 'codebusters') where slug = 'codebusters-extra-practice';
