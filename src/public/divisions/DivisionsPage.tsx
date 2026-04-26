import { Link } from "react-router-dom";
import { Brain, Tv, Wifi, Rocket, Shield, GraduationCap } from "lucide-react";

const divisions = [
  {
    icon: Brain,
    name: "Software, AI & Robotics Lab",
    description: "Build apps, SaaS tools, AI systems, and robotics software under one engineering unit.",
    color: "from-blue-500 to-blue-600",
    services: ["Custom Software Development", "AI/ML Solutions", "Robotics Control Software", "Mobile Applications", "Web Platforms"],
    to: "/dashboard",
  },
  {
    icon: Tv,
    name: "Media Studio & TUAN TV",
    description: "Produce films, animations, campaign media, and operate TUAN's broadcast channels.",
    color: "from-purple-500 to-purple-600",
    services: ["Film Production", "Animation Studio", "Live Broadcasting", "Media Campaigns", "Content Distribution"],
    to: "/media",
  },
  {
    icon: Wifi,
    name: "Telecom & IoT Division",
    description: "Deliver connectivity infrastructure, IoT deployments, and telecom operations support.",
    color: "from-green-500 to-green-600",
    services: ["Telecommunications Operations", "Network Infrastructure", "IoT Solutions", "Rural Connectivity", "Smart City Integration"],
    to: "/iot",
  },
  {
    icon: Rocket,
    name: "Aerospace, Embedded & Semiconductor Systems",
    description: "Lead research, design and development of spacecrafts, satellites, UAVs, embedded electronics, and computer chips.",
    color: "from-red-500 to-red-600",
    services: ["Satellite Technology", "UAV Development", "Embedded Systems Engineering", "Semiconductor Chip Design", "Chip Manufacturing Partnerships"],
    to: "/dashboard",
  },
  {
    icon: Shield,
    name: "Cloud & Cybersecurity Unit",
    description: "Provide secure cloud architecture, cyber defense, hosting, and data intelligence services.",
    color: "from-indigo-500 to-indigo-600",
    services: ["Cloud Infrastructure", "Cybersecurity", "Security Operations", "Data Analytics", "Secure Hosting"],
    to: "/dashboard",
  },
  {
    icon: GraduationCap,
    name: "Digital Academy & Incubator",
    description: "Train developers and creatives, then incubate startups building on TUAN standards.",
    color: "from-yellow-500 to-yellow-600",
    services: ["Skills Training", "Certification Programs", "Mentorship", "Startup Incubation", "Innovation Labs"],
    to: "/academy",
  },
];

export default function DivisionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">Divisions</p>
      <h1 className="mt-4 font-display text-2xl leading-tight sm:text-3xl">Our innovation divisions work together under one trusted platform.</h1>
      <p className="mt-6 max-w-3xl text-[var(--text-soft)]">
        TUAN Creations Company Ltd leads these divisions, while TUAN Digital Platform connects their services in one user journey.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {divisions.map((division) => {
          const Icon = division.icon;
          return (
            <Link key={division.name} to={division.to} className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
              <div className={`bg-gradient-to-r ${division.color} p-6`}>
                <div className="flex items-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/25">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{division.name}</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="mb-6 text-[var(--text-soft)]">{division.description}</p>
                <div>
                  <h4 className="mb-3 text-lg font-semibold text-[var(--text)]">Key Services</h4>
                  <div className="space-y-2">
                    {division.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-center space-x-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-[var(--gold)]"></div>
                        <span className="text-[var(--text-soft)]">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="mt-20">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-5 text-2xl font-bold text-[var(--text)] sm:mb-6 sm:text-3xl">How the company and platform work together</h2>
          <p className="mx-auto max-w-3xl text-[var(--text-soft)]">
            TUAN Creations Company Ltd owns and governs the divisions. TUAN Digital Platform is the product layer that presents these services to users in one trusted flow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="card text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-500">
              <span className="text-xl font-bold text-white">🌳</span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-[var(--text)]">Company layer</h3>
            <p className="text-[var(--text-soft)]">TUAN Creations Company Ltd designs, governs, and scales every division.</p>
          </div>
          <div className="card text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500">
              <span className="text-xl font-bold text-white">🧑‍💼</span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-[var(--text)]">Product layer</h3>
            <p className="text-[var(--text-soft)]">TUAN Digital Platform is the user-facing product where clients discover and consume division services.</p>
          </div>
          <div className="card text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500">
              <span className="text-xl font-bold text-white">⟳</span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-[var(--text)]">Delivery flow</h3>
            <p className="text-[var(--text-soft)]">Users enter once through the platform and are routed to the right division without duplication.</p>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="rounded-2xl bg-[var(--card)] p-5 shadow-lg sm:p-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-[var(--text)] sm:text-3xl">Example delivery flow</h2>
          <p className="mx-auto mb-8 max-w-3xl text-center text-[var(--text-soft)]">
            A client request enters via TUAN Digital Platform, then TUAN Creations Company Ltd assigns the right divisions to deliver a complete project.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="card">
              <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">Step 1</p>
              <h4 className="mt-2 font-semibold text-[var(--text)]">Client enters platform</h4>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Service request starts on TUAN Digital Platform.</p>
            </div>
            <div className="card">
              <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">Step 2</p>
              <h4 className="mt-2 font-semibold text-[var(--text)]">Company assigns division</h4>
              <p className="mt-2 text-sm text-[var(--text-soft)]">TUAN Creations Company Ltd routes work to the responsible division.</p>
            </div>
            <div className="card">
              <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">Step 3</p>
              <h4 className="mt-2 font-semibold text-[var(--text)]">Execution and collaboration</h4>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Teams deliver through platform tools with partner collaboration where needed.</p>
            </div>
            <div className="card">
              <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">Step 4</p>
              <h4 className="mt-2 font-semibold text-[var(--text)]">Tracking and growth</h4>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Clients track outcomes while services scale across divisions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
