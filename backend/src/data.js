export const dashboardMetrics = [
  { label: "Active Learners", value: "12,480", trend: "+18% this month", order: 1 },
  { label: "Marketplace Orders", value: "3,920", trend: "+11% this month", order: 2 },
  { label: "Live Media Reach", value: "84K", trend: "+22% this month", order: 3 },
  { label: "Innovation Programs", value: "46", trend: "+9% this month", order: 4 },
];

export const courses = [
  {
    id: 1,
    title: "AI Product Design for African Markets",
    instructor: "Eng. Godwin Ofwono",
    level: "Advanced",
    duration: "10 weeks",
    enrolled: 1280,
  },
  {
    id: 2,
    title: "Cloud Security Essentials",
    instructor: "Eng. Behangana Keneth",
    level: "Intermediate",
    duration: "8 weeks",
    enrolled: 990,
  },
  {
    id: 3,
    title: "IoT Build Lab: Smart Farming Kits",
    instructor: "Eng. Butera Marcel",
    level: "Beginner",
    duration: "6 weeks",
    enrolled: 760,
  },
];

export const listings = [
  {
    id: 1,
    name: "Custom ERP Build for SMEs",
    type: "Service",
    provider: "TUAN Software Lab",
    verified: true,
    price: "From $3,500",
  },
  {
    id: 2,
    name: "Rural Network Starter Kit",
    type: "Product",
    provider: "TUAN Telecom Division",
    verified: true,
    price: "$480",
  },
  {
    id: 3,
    name: "Media Production Sprint",
    type: "Service",
    provider: "TUAN TV Studio",
    verified: false,
    price: "From $1,200",
  },
];

export const mediaChannels = [
  {
    id: 1,
    name: "TUAN Prime",
    audience: "42K followers",
    status: "Live now",
    recordingUrl: "/media?channel=1",
    followers: 42000,
    featuredBroadcast: "Africa Tech Frontlines",
    recordingCount: 12,
  },
  {
    id: 2,
    name: "Innovation Pulse",
    audience: "18K followers",
    status: "New episode",
    recordingUrl: "/media?channel=2",
    followers: 18000,
    featuredBroadcast: "Builders of Africa",
    recordingCount: 9,
  },
  {
    id: 3,
    name: "Builders of Africa",
    audience: "24K followers",
    status: "Recording archive",
    recordingUrl: "/media?channel=3",
    followers: 24000,
    featuredBroadcast: "Community Innovation Showcase",
    recordingCount: 15,
  },
];

export const collaborationProjects = [
  {
    id: 1,
    name: "Cross-border Payments UX",
    team: 7,
    status: "In Progress",
    owner: "Partner Delivery Team",
    tasks: 18,
    channel: "Project Chat",
  },
  {
    id: 2,
    name: "Telecom Rollout Dashboard",
    team: 5,
    status: "Planning",
    owner: "TUAN Telecom Division",
    tasks: 11,
    channel: "Delivery Room",
  },
  {
    id: 3,
    name: "Agritech IoT Pilot",
    team: 11,
    status: "Delivery",
    owner: "TUAN Innovations",
    tasks: 24,
    channel: "Shared Workspace",
  },
];

export const innovationPrograms = [
  {
    id: 1,
    title: "Smart Farming Kit Program",
    mode: "Hands-on",
    seats: 120,
    enrolled: 84,
    summary: "Build low-cost soil, weather, and irrigation kits for schools and local farmers.",
  },
  {
    id: 2,
    title: "City Sensors Innovation Track",
    mode: "Hybrid",
    seats: 80,
    enrolled: 51,
    summary: "Prototype traffic, air-quality, and safety sensors that support local planning.",
  },
  {
    id: 3,
    title: "Youth Robotics Sprint",
    mode: "On-site",
    seats: 60,
    enrolled: 42,
    summary: "Launch guided robotics builds with mentors, challenges, and demo day showcases.",
  },
  {
    id: 4,
    title: "Semiconductor Design Pathway",
    mode: "Cohort",
    seats: 40,
    enrolled: 24,
    summary: "Train teams in chip architecture, FPGA prototyping, and fabrication partner readiness.",
  },
];

export const sessionSeeds = courses.map((course) => ({
  courseId: course.id,
  title: course.title,
  instructor: course.instructor,
  topic: course.id === 1 ? "Neural Networks and Deep Learning" : course.id === 2 ? "Identity, secrets, and cloud controls" : "Sensors, automation, and field deployment",
  startTime: new Date(Date.now() + course.id * 15 * 60 * 1000).toISOString(),
  durationMinutes: course.id === 1 ? 120 : course.id === 2 ? 90 : 75,
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
  ],
  chatMessages: [
    { id: 1, senderName: "Eng. Godwin", text: "Welcome everyone!", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isInstructor: true },
  ],
}));