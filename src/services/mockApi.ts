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
