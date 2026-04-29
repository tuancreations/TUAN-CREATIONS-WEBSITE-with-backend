export type ManagementTeamMember = {
  id: string;
  name: string;
  position: string;
  nationality: string;
  dateOfBirth: string;
  photo: string;
  description: string;
  experience: string[];
  email: string;
  phone: string;
  linkedin?: string;
  twitter?: string;
};

export const MANAGEMENT_TEAM_STORAGE_KEY = "tuan_management_team";

const avatarPalette = ["#1f2937", "#0f766e", "#92400e", "#1d4ed8", "#7c3aed", "#be123c", "#0f172a", "#166534", "#b45309"];

function createFacelessAvatar(seed: string, accent: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="Faceless profile avatar">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e5e7eb" />
          <stop offset="100%" stop-color="#cbd5e1" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="32" fill="url(#g)" />
      <circle cx="128" cy="104" r="42" fill="#94a3b8" opacity="0.95" />
      <path d="M64 214c14-38 41-58 64-58s50 20 64 58" fill="#64748b" opacity="0.95" />
      <circle cx="92" cy="88" r="10" fill="${accent}" opacity="0.9" />
      <circle cx="164" cy="88" r="10" fill="${accent}" opacity="0.9" />
      <path d="M104 120c10 8 38 8 48 0" fill="none" stroke="#475569" stroke-width="10" stroke-linecap="round" />
      <text x="18" y="238" font-family="Arial, sans-serif" font-size="16" fill="#334155" opacity="0.4">${seed}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const DEFAULT_MANAGEMENT_TEAM: ManagementTeamMember[] = [
  {
    id: "behangana-keneth",
    name: "BEHANGANA KENETH",
    position: "Software Developer",
    nationality: "Ugandan",
    dateOfBirth: "03/09/1997",
    photo: createFacelessAvatar("BK", avatarPalette[0]),
    description: "Builds product experiences and helps ship reliable platform features.",
    experience: ["Software systems development", "Platform implementation and support"],
    email: "grandeekeneth@gmail.com",
    phone: "+256 753 414 058",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
  {
    id: "nakimuli-hanifah",
    name: "NAKIMULI HANIFAH",
    position: "Accountant",
    nationality: "Ugandan",
    dateOfBirth: "01/05/1995",
    photo: createFacelessAvatar("NH", avatarPalette[1]),
    description: "Leads finance operations, reporting, and accountability processes.",
    experience: ["Financial reporting", "Budget control and bookkeeping"],
    email: "hanifahnakimuli95@gmail.com",
    phone: "+256 706 965 504",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
  {
    id: "butera-marcel",
    name: "BUTERA MARCEL",
    position: "Software Developer",
    nationality: "Congolese",
    dateOfBirth: "21/12/2005",
    photo: createFacelessAvatar("BM", avatarPalette[2]),
    description: "Supports engineering delivery and builds dependable digital services.",
    experience: ["Application development", "System testing and integrations"],
    email: "buteramarcel@gmail.com",
    phone: "+256 783 858 472",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
  {
    id: "ofwono-godwin",
    name: "OFWONO GODWIN",
    position: "Software Developer",
    nationality: "Ugandan",
    dateOfBirth: "02/06/2003",
    photo: createFacelessAvatar("OG", avatarPalette[3]),
    description: "Focuses on product engineering and feature delivery for the platform.",
    experience: ["Frontend and backend development", "Maintenance and debugging"],
    email: "godwinofwono933@gmail.com",
    phone: "+256 757 013 189",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
  {
    id: "nuwahereza-peter",
    name: "NUWAHEREZA PETER",
    position: "Software Developer",
    nationality: "Ugandan",
    dateOfBirth: "24/04/1998",
    photo: createFacelessAvatar("NP", avatarPalette[4]),
    description: "Works on robust software delivery and supports growth initiatives.",
    experience: ["Product support and feature delivery", "Service integration"],
    email: "nuwaherezapeter34@gmail.com",
    phone: "+256 779 081 600",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
  {
    id: "nakiyingi-irene",
    name: "NAKIYINGI IRENE",
    position: "Doctor",
    nationality: "Ugandan",
    dateOfBirth: "03/09/1998",
    photo: createFacelessAvatar("NI", avatarPalette[5]),
    description: "Advises on wellbeing, care, and human-centered support for the team.",
    experience: ["Medical practice", "Health guidance and advisory work"],
    email: "iryntracy@gmail.com",
    phone: "+256 786 691 998",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
  {
    id: "agaba-francis",
    name: "AGABA FRANCIS",
    position: "Manager",
    nationality: "Ugandan",
    dateOfBirth: "17/11/1989",
    photo: createFacelessAvatar("AF", avatarPalette[6]),
    description: "Coordinates delivery, team operations, and execution across projects.",
    experience: ["Team management", "Operations coordination"],
    email: "francisagaba137@gmail.com",
    phone: "+256 783 387 303",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
  {
    id: "mugumya-benard",
    name: "MUGUMYA BENARD",
    position: "Manager",
    nationality: "Ugandan",
    dateOfBirth: "23/02/1995",
    photo: createFacelessAvatar("MB", avatarPalette[7]),
    description: "Supports administration, planning, and the delivery of internal programs.",
    experience: ["Program management", "Administrative leadership"],
    email: "benardmugumya@gmail.com",
    phone: "+256 777 997 258",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
  {
    id: "akankwatssa-amon",
    name: "AKANKWATSA AMON",
    position: "Accountant",
    nationality: "Ugandan",
    dateOfBirth: "04/04/1995",
    photo: createFacelessAvatar("AA", avatarPalette[8]),
    description: "Manages reporting, financial records, and operational accountability.",
    experience: ["Accounts management", "Reporting and reconciliation"],
    email: "amonbobia2017@gmail.com",
    phone: "+256 787 666 907",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
];

export function loadManagementTeam(): ManagementTeamMember[] {
  try {
    const raw = localStorage.getItem(MANAGEMENT_TEAM_STORAGE_KEY);
    if (!raw) return DEFAULT_MANAGEMENT_TEAM;

    const parsed = JSON.parse(raw) as ManagementTeamMember[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MANAGEMENT_TEAM;
  } catch {
    return DEFAULT_MANAGEMENT_TEAM;
  }
}

export function saveManagementTeam(members: ManagementTeamMember[]) {
  localStorage.setItem(MANAGEMENT_TEAM_STORAGE_KEY, JSON.stringify(members));
}
