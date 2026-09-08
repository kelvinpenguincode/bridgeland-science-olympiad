/** Public copy taken from the current Bridgeland SciOly site (home, about, accomplishments, contact). */

export const SITE = {
  name: "Bridgeland Science Olympiad",
  shortName: "Bridgeland SciOly",
  school: "Bridgeland High School",
  tagline: "Pursuing excellence in science through competition, teamwork, and discovery.",
  description:
    "Fostering a passion for STEM through competitive events, collaborative learning, and hands-on experimentation.",
  heroBadge: "#1 in District & Regionals · Top 10 in Texas",
  joinLine: "No prior experience required — just curiosity. Meetings are every Monday after school at Bridgeland High School.",
  locationName: "Bridgeland High School",
  address: "10707 Mason Rd, Cypress, TX 77433",
  mapsUrl: "https://maps.google.com/?q=10707+Mason+Rd,+Cypress,+TX+77433",
  email: "bridgelandscienceolympiad@gmail.com",
  meetings: "Every Monday after school",
} as const;

export const ABOUT_CARDS = [
  {
    emoji: "🎯",
    title: "Our Mission",
    body: "To foster a passion for STEM among students at Bridgeland High School, and lead them through discovering advanced science topics through competitive Science Olympiad events, collaborative learning, and hands-on experimentation.",
  },
  {
    emoji: "🏆",
    title: "What We Do",
    body: "We compete in regional, invitational, and state-level Science Olympiad tournaments across 23 events spanning life science, earth science, physical science, and engineering. Our team has earned the #1 spot at both District and Regionals and is consistently ranked in the top 10 in the State of Texas.",
  },
  {
    emoji: "🤝",
    title: "Our Community",
    body: "More than a club — we're a family. Our members support each other in academics, competition prep, and beyond. Everyone is welcome regardless of experience level.",
  },
] as const;

export const HOME_ABOUT_CARDS = [
  {
    emoji: "🎯",
    title: "Our Mission",
    body: "Fostering a passion for STEM through competitive events, collaborative learning, and hands-on experimentation.",
  },
  {
    emoji: "🏆",
    title: "What We Do",
    body: "We compete across 23 events in regional, invitational, and state tournaments — consistently ranked top 10 in Texas.",
  },
  {
    emoji: "🤝",
    title: "Our Community",
    body: "More than a club — a family. Everyone is welcome, regardless of experience level.",
  },
] as const;

export const HOME_HIGHLIGHTS = [
  {
    eyebrow: "Texas State · 2025",
    title: "5th in Texas",
    body: "Our best finish yet, with three individual event podium finishes.",
  },
  {
    eyebrow: "Since 2022",
    title: "5-Year Streak",
    body: "1st place at both Regional and District, every year running.",
  },
  {
    eyebrow: "Golden Gate · Stanford",
    title: "1st & 5th Place",
    body: "Competing nationally at Stanford's prestigious invitational.",
  },
] as const;

export const STATE_RESULTS = [
  {
    year: "2023",
    title: "18th in Texas",
    field: "30 teams competing",
    body: "Our first appearance at the state level — establishing Bridgeland as a serious contender and setting the foundation for future success.",
    medals: [] as string[],
  },
  {
    year: "2024",
    title: "8th in Texas",
    field: "30 teams competing",
    body: "A massive 10-place jump. Our team earned multiple individual event medals and proved we belong among the state's elite programs.",
    medals: [] as string[],
  },
  {
    year: "2025",
    title: "5th in Texas",
    field: "30 teams competing",
    body: "Our best finish yet — cracking the top 5 with three individual event podium finishes, including a 1st, 2nd, and 3rd place medal.",
    medals: ["🥇 1st Place", "🥈 2nd Place", "🥉 3rd Place"],
  },
  {
    year: "2026",
    title: "7th in Texas",
    field: "30 teams competing",
    body: "Continuing to compete at the highest level with two individual event podium finishes, including a 1st and 3rd place medal.",
    medals: ["🥇 1st Place", "🥉 3rd Place"],
  },
] as const;

export const INVITATIONALS = [
  {
    eyebrow: "Golden Gate Invitational · Stanford",
    title: "1st & 5th Place Event Finishes",
    body: "Competing against top teams from across the country at Stanford's prestigious Golden Gate Science Olympiad Invitational, our members earned 1st and 5th place finishes in individual events — proving that Bridgeland can compete on a national stage.",
    medals: [] as string[],
  },
  {
    eyebrow: "UT Austin Invitational · 2025",
    title: "7th Place Overall / 40 teams",
    body: "Our Orange team placed 7th overall out of 40 teams, earning a 3rd place finish in an individual event. Our Blue team also competed, finishing in the top half of the field.",
    medals: ["🥉 3rd Place"],
  },
  {
    eyebrow: "Seven Lakes Invitational · 2025",
    title: "5th Place Overall / 52 teams",
    body: "Our A team placed 5th overall out of 52 teams with two podium finishes — a 1st and 3rd place medal in individual events. Our B team also competed, placing 15th.",
    medals: ["🥇 1st Place", "🥉 3rd Place"],
  },
  {
    eyebrow: "UT Austin Invitational · 2026",
    title: "7th Place Overall / 42 teams",
    body: "Both Bridgeland teams made their mark — Orange placed 7th with a 2nd place event medal, and Blue placed 11th with a 3rd place event medal.",
    medals: ["🥈 2nd Place", "🥉 3rd Place"],
  },
  {
    eyebrow: "Seven Lakes Invitational · 2026",
    title: "6th Place Overall / 55 teams",
    body: "Our strongest invitational showing — Team 1 placed 6th with a 2nd and 3rd place medal, while our Blue team earned 9th with a 1st and 2nd place medal. Four podium finishes across two teams.",
    medals: ["🥇 1st Place", "🥈 2nd Place × 2", "🥉 3rd Place"],
  },
] as const;
