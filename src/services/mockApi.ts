export type Metric = {
  label: string;
  value: string;
  trend: string;
};

export type Course = {
  id: number;
  title: string;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  enrolled: number;
  content?: {
    description?: string;
    syllabus?: string;
    prerequisites?: string[];
    learningObjectives?: string[];
    thumbnail?: string;
  };
};

export type Listing = {
  id: number;
  name: string;
  type: "Service" | "Product";
  provider: string;
  verified: boolean;
  price: string;
};

export const dashboardMetrics: Metric[] = [
  { label: "Active Learners", value: "12,480", trend: "+18% this month" },
  { label: "Marketplace Orders", value: "3,920", trend: "+11% this month" },
  { label: "Live Media Reach", value: "84K", trend: "+22% this month" },
  { label: "Project Collaborations", value: "3", trend: "+2 this month" },
  { label: "Innovation Programs", value: "46", trend: "+9% this month" },
];

export const courses: Course[] = [
  {
    id: 1,
    title: "AI Product Design for African Markets",
    instructor: "Eng. Godwin Ofwono",
    level: "Advanced",
    duration: "10 weeks",
    enrolled: 1280,
    content: {
      description: "Learn to design AI-powered products tailored for African market contexts, including low-bandwidth environments and diverse user needs.",
      syllabus: "Week 1-2: AI Fundamentals for Product Teams\nWeek 3-4: Market Research & User Research in Africa\nWeek 5-6: Prototyping AI Features\nWeek 7-8: Localization & Multilingual Support\nWeek 9-10: Launch Strategy & Scaling",
      prerequisites: ["Basic understanding of AI concepts", "Product design fundamentals"],
      learningObjectives: ["Design culturally-adapted AI products", "Understand African market dynamics", "Build inclusive AI systems", "Navigate ethical considerations"],
    },
  },
  {
    id: 2,
    title: "Cloud Security Essentials",
    instructor: "Eng. Behangana Keneth",
    level: "Intermediate",
    duration: "8 weeks",
    enrolled: 990,
    content: {
      description: "Master cloud security best practices, identity management, and compliance frameworks for AWS, GCP, and Azure environments.",
      syllabus: "Week 1: Cloud Security Fundamentals\nWeek 2-3: Identity & Access Management\nWeek 4: Network Security & Encryption\nWeek 5-6: Compliance & Governance\nWeek 7-8: Incident Response & Monitoring",
      prerequisites: ["Basic cloud computing knowledge", "Networking fundamentals"],
      learningObjectives: ["Implement secure cloud architectures", "Manage identity & access", "Handle compliance requirements", "Monitor and respond to incidents"],
    },
  },
  {
    id: 3,
    title: "IoT Build Lab: Smart Farming Kits",
    instructor: "Eng. Butera Marcel",
    level: "Beginner",
    duration: "6 weeks",
    enrolled: 760,
    content: {
      description: "Build and deploy IoT solutions for smart farming, including soil sensors, weather monitoring, and automated irrigation systems.",
      syllabus: "Week 1-2: IoT & Hardware Basics\nWeek 3: Sensor Integration & Data Collection\nWeek 4: Cloud Connectivity & APIs\nWeek 5: Dashboard Development\nWeek 6: Deployment & Maintenance",
      prerequisites: ["Basic electronics", "Introduction to programming"],
      learningObjectives: ["Build IoT sensor systems", "Integrate hardware with cloud", "Develop monitoring dashboards", "Deploy production solutions"],
    },
  },
];

export const listings: Listing[] = [
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
