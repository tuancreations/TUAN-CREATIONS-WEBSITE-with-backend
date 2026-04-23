import { dashboardMetrics as fallbackMetrics, courses as fallbackCourses, listings as fallbackListings } from "./mockApi";

export type UserRole = "student" | "partner" | "client" | "investor" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type DashboardMetric = {
  label: string;
  value: string;
  trend: string;
  order?: number;
};

export type Course = {
  id: number;
  title: string;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  enrolled: number;
};

export type Listing = {
  id: number;
  name: string;
  type: "Service" | "Product";
  provider: string;
  verified: boolean;
  price: string;
};

export type MediaChannel = {
  id: number;
  name: string;
  audience: string;
  status: string;
  recordingUrl?: string | null;
  followers: number;
  featuredBroadcast: string;
  recordingCount: number;
};

export type CollaborationProject = {
  id: number;
  name: string;
  team: number;
  status: string;
  owner: string;
  tasks: number;
  channel: string;
};

export type InnovationProgram = {
  id: number;
  title: string;
  mode: string;
  seats: number;
  enrolled: number;
  summary: string;
};

export type SessionMeta = {
  courseId: number;
  title: string;
  instructor: string;
  topic?: string;
  startTime?: string | null;
  durationMinutes?: number;
  status: "scheduled" | "live" | "ended";
  recordingUrl?: string | null;
  resources?: { title: string; url: string }[];
  previousSessions?: { title: string; recordingUrl: string }[];
  participants?: Array<{ id: string; name: string; role: string; isOnline?: boolean; isSpeaking?: boolean }>;
  chatMessages?: Array<{ id: string | number; senderId?: string; senderName: string; text: string; time: string; isInstructor?: boolean }>;
};

export type AdminOverview = {
  stats: {
    users: number;
    actions: number;
    metrics: number;
    courses: number;
    listings: number;
    liveSessions: number;
    enrollments: number;
    liveJoins: number;
  };
  roleCounts: Array<{ _id: string; count: number }>;
  recentUsers: AuthUser[];
  recentActions: Array<{
    id: string;
    kind: string;
    actorName: string | null;
    actorEmail: string | null;
    createdAt: string;
  }>;
};

export type AcademyEnrollment = {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  courseId: number;
  courseTitle: string | null;
  enrolledAt: string;
  liveJoinCount: number;
  lastJoinedLiveAt: string | null;
};

const AUTH_KEY = "tuan_os_auth_session";
const DEFAULT_API_BASE = "http://localhost:4000/api";
const API_BASE = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE).replace(/\/$/, "");

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

type StoredSession = {
  user: AuthUser;
  token: string;
};

const readSession = (): StoredSession | null => {
  if (typeof localStorage === "undefined") return null;

  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
};

export const getStoredSession = () => readSession();
export const getStoredToken = () => readSession()?.token ?? null;

export const storeSession = (session: StoredSession) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(AUTH_KEY);
};

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");

  const token = getStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = "";

    try {
      const errorPayload = (await response.json()) as { message?: string };
      message = errorPayload.message || "";
    } catch {
      message = await response.text();
    }

    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function loginUser(payload: { name: string; email: string; role: UserRole; password?: string }) {
  try {
    const response = await apiRequest<{ user: AuthUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    storeSession(response);
    return response.user;
  } catch {
    const localUser: AuthUser = {
      id: createId(),
      name: payload.name || "TUAN Member",
      email: payload.email,
      role: payload.role,
    };

    storeSession({ user: localUser, token: "mock-session-token" });
    return localUser;
  }
}

export async function getCurrentUser() {
  try {
    const response = await apiRequest<{ user: AuthUser }>("/auth/me");
    return response.user;
  } catch {
    const session = getStoredSession();
    if (session?.user) {
      return session.user;
    }

    throw new Error("No active session");
  }
}

export async function logoutUser() {
  try {
    await apiRequest<{ ok: boolean }>("/auth/logout", { method: "POST" });
  } finally {
    clearSession();
  }
}

export async function getDashboardMetrics() {
  try {
    const response = await apiRequest<{ metrics: DashboardMetric[] }>("/dashboard/metrics");
    return response.metrics;
  } catch {
    return fallbackMetrics;
  }
}

export async function getCourses() {
  try {
    const response = await apiRequest<{ courses: Course[] }>("/courses");
    return response.courses;
  } catch {
    return fallbackCourses;
  }
}

export async function getListings() {
  try {
    const response = await apiRequest<{ listings: Listing[] }>("/listings");
    return response.listings;
  } catch {
    return fallbackListings;
  }
}

export async function getMediaChannels() {
  try {
    const response = await apiRequest<{ channels: MediaChannel[] }>("/media/channels");
    return response.channels;
  } catch {
    return [
      { id: 1, name: "TUAN Prime", audience: "42K followers", status: "Live now", recordingUrl: "/media?channel=1", followers: 42000, featuredBroadcast: "Africa Tech Frontlines", recordingCount: 12 },
      { id: 2, name: "Innovation Pulse", audience: "18K followers", status: "New episode", recordingUrl: "/media?channel=2", followers: 18000, featuredBroadcast: "Builders of Africa", recordingCount: 9 },
      { id: 3, name: "Builders of Africa", audience: "24K followers", status: "Recording archive", recordingUrl: "/media?channel=3", followers: 24000, featuredBroadcast: "Community Innovation Showcase", recordingCount: 15 },
    ];
  }
}

export async function followMediaChannel(channelId: number) {
  try {
    return await apiRequest<{ ok: boolean; channel: MediaChannel }>(`/media/channels/${channelId}/follow`, {
      method: "POST",
    });
  } catch {
    const channels = await getMediaChannels();
    const channel = channels.find((entry) => entry.id === channelId) ?? channels[0];

    return {
      ok: true,
      channel: {
        ...channel,
        followers: (channel?.followers ?? 0) + 1,
      },
    };
  }
}

export async function getCollaborationProjects() {
  try {
    const response = await apiRequest<{ projects: CollaborationProject[] }>("/collaboration/projects");
    return response.projects;
  } catch {
    return [
      { id: 1, name: "Cross-border Payments UX", team: 7, status: "In Progress", owner: "Partner Delivery Team", tasks: 18, channel: "Project Chat" },
      { id: 2, name: "Telecom Rollout Dashboard", team: 5, status: "Planning", owner: "TUAN Telecom Division", tasks: 11, channel: "Delivery Room" },
      { id: 3, name: "Agritech IoT Pilot", team: 11, status: "Delivery", owner: "TUAN Innovations", tasks: 24, channel: "Shared Workspace" },
    ];
  }
}

export async function createCollaborationProject(payload: { name: string; team?: number; status?: string; owner?: string; channel?: string }) {
  try {
    return await apiRequest<{ project: CollaborationProject }>("/collaboration/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      project: {
        id: Date.now(),
        name: payload.name,
        team: payload.team ?? 1,
        status: payload.status ?? "Planning",
        owner: payload.owner ?? "Community Team",
        tasks: 0,
        channel: payload.channel ?? "Shared Workspace",
      },
    };
  }
}

export async function recordCollaborationAction(projectId: number, kind: "collaboration.chat" | "collaboration.tasks") {
  try {
    return await apiRequest<{ ok: boolean; project: CollaborationProject }>(`/collaboration/projects/${projectId}/action`, {
      method: "POST",
      body: JSON.stringify({ kind }),
    });
  } catch {
    const projects = await getCollaborationProjects();
    const project = projects.find((entry) => entry.id === projectId) ?? projects[0];
    const increment = kind === "collaboration.tasks" ? 2 : 1;

    return {
      ok: true,
      project: {
        ...project,
        tasks: (project?.tasks ?? 0) + increment,
      },
    };
  }
}

export async function getInnovationPrograms() {
  try {
    const response = await apiRequest<{ programs: InnovationProgram[] }>("/iot/programs");
    return response.programs;
  } catch {
    return [
      { id: 1, title: "Smart Farming Kit Program", mode: "Hands-on", seats: 120, enrolled: 84, summary: "Build low-cost soil, weather, and irrigation kits for schools and local farmers." },
      { id: 2, title: "City Sensors Innovation Track", mode: "Hybrid", seats: 80, enrolled: 51, summary: "Prototype traffic, air-quality, and safety sensors that support local planning." },
      { id: 3, title: "Youth Robotics Sprint", mode: "On-site", seats: 60, enrolled: 42, summary: "Launch guided robotics builds with mentors, challenges, and demo day showcases." },
      { id: 4, title: "Semiconductor Design Pathway", mode: "Cohort", seats: 40, enrolled: 24, summary: "Train teams in chip architecture, FPGA prototyping, and fabrication partner readiness." },
    ];
  }
}

export async function enrollInnovationProgram(programId: number) {
  try {
    return await apiRequest<{ ok: boolean; program: InnovationProgram }>(`/iot/programs/${programId}/enroll`, {
      method: "POST",
    });
  } catch {
    const programs = await getInnovationPrograms();
    const program = programs.find((entry) => entry.id === programId) ?? programs[0];

    return {
      ok: true,
      program: {
        ...program,
        enrolled: Math.min(program.seats, program.enrolled + 1),
      },
    };
  }
}

export async function getLiveSession(courseId: number) {
  try {
    const response = await apiRequest<{ session: SessionMeta }>(`/live-sessions/${courseId}`);
    return response.session;
  } catch {
    const selectedCourse = fallbackCourses.find((course) => course.id === courseId) ?? fallbackCourses[0];

    return {
      courseId: selectedCourse.id,
      title: selectedCourse.title,
      instructor: selectedCourse.instructor,
      topic: "Neural Networks and Deep Learning",
      startTime: new Date(Date.now() + 1000 * 60 * 2).toISOString(),
      durationMinutes: 120,
      status: "scheduled",
      recordingUrl: null,
      resources: [
        { title: "Lecture Slides", url: "/resources/slides.pdf" },
        { title: "Reference Paper", url: "/resources/paper.pdf" },
      ],
      previousSessions: [
        { title: "Intro to AI", recordingUrl: "/recordings/session1.mp4" },
        { title: "Machine Learning Basics", recordingUrl: "/recordings/session2.mp4" },
      ],
      participants: [
        { id: "u-1", name: "Eng. Godwin", role: "instructor", isOnline: true, isSpeaking: true },
        { id: "u-2", name: "Eng. Cissyln", role: "co-instructor", isOnline: true },
        { id: "u-3", name: "Sarah Nakato", role: "student", isOnline: true },
        { id: "u-you", name: "You", role: "student", isOnline: true },
      ],
      chatMessages: [
        { id: 1, senderName: "Eng. Godwin", text: "Welcome everyone!", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isInstructor: true },
      ],
    };
  }
}

export async function recordAction(kind: string, payload: Record<string, unknown>) {
  try {
    return await apiRequest<{ action: { kind: string } }>("/actions", {
      method: "POST",
      body: JSON.stringify({ kind, payload }),
    });
  } catch {
    return { action: { kind } };
  }
}

export async function getAdminOverview() {
  try {
    return await apiRequest<AdminOverview>("/admin/overview");
  } catch {
    return {
      stats: {
        users: 0,
        actions: 0,
        metrics: fallbackMetrics.length,
        courses: fallbackCourses.length,
        listings: fallbackListings.length,
        liveSessions: fallbackCourses.length,
        enrollments: 0,
        liveJoins: 0,
      },
      roleCounts: [],
      recentUsers: [],
      recentActions: [],
    };
  }
}

export async function getAdminUsers() {
  try {
    const response = await apiRequest<{ users: AuthUser[] }>("/admin/users");
    return response.users;
  } catch {
    return [];
  }
}

export async function getAdminActions() {
  try {
    const response = await apiRequest<{ actions: AdminOverview["recentActions"] }>("/admin/actions");
    return response.actions;
  } catch {
    return [];
  }
}

export async function enrollInCourse(courseId: number) {
  try {
    return await apiRequest<{ enrollment: AcademyEnrollment; course: Course; alreadyEnrolled: boolean }>(`/academy/enroll/${courseId}`, {
      method: "POST",
    });
  } catch {
    const courses = await getCourses();
    const course = courses.find((entry) => entry.id === courseId) ?? courses[0];

    return {
      enrollment: {
        id: createId(),
        userId: createId(),
        userName: getStoredSession()?.user?.name ?? "TUAN Member",
        userEmail: getStoredSession()?.user?.email ?? null,
        courseId: course.id,
        courseTitle: course.title,
        enrolledAt: new Date().toISOString(),
        liveJoinCount: 0,
        lastJoinedLiveAt: null,
      },
      course: {
        ...course,
        enrolled: course.enrolled + 1,
      },
      alreadyEnrolled: false,
    };
  }
}

export async function joinLiveSession(courseId: number) {
  try {
    return await apiRequest<{ ok: boolean; enrollment: AcademyEnrollment }>(`/academy/live/${courseId}/join`, {
      method: "POST",
    });
  } catch {
    return {
      ok: true,
      enrollment: {
        id: createId(),
        userId: createId(),
        userName: getStoredSession()?.user?.name ?? "TUAN Member",
        userEmail: getStoredSession()?.user?.email ?? null,
        courseId,
        courseTitle: null,
        enrolledAt: new Date().toISOString(),
        liveJoinCount: 1,
        lastJoinedLiveAt: new Date().toISOString(),
      },
    };
  }
}

export async function getMyEnrollments() {
  try {
    const response = await apiRequest<{ enrollments: AcademyEnrollment[] }>("/academy/enrollments/me");
    return response.enrollments;
  } catch {
    return [];
  }
}

export async function getAdminAcademyEnrollments() {
  try {
    const response = await apiRequest<{ enrollments: AcademyEnrollment[] }>("/admin/academy/enrollments");
    return response.enrollments;
  } catch {
    return [];
  }
}