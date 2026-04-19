import { Link } from "react-router-dom";

const divisions = [
  { name: "Software & ICT Services", summary: "Digital support, tools, and services for individuals, SMEs, and institutions.", to: "/dashboard" },
  { name: "TUAN Live Academy", summary: "Verified courses, live lectures, and recordings on the instructor or broadcaster page.", to: "/academy" },
  { name: "IoT & Robotics Innovation Hub", summary: "Learning kits, resources, and innovation content for schools and builders.", to: "/iot" },
  { name: "TUAN Marketplace", summary: "A vetted marketplace for services, products, startups, and agencies.", to: "/marketplace" },
  { name: "Collaboration Tools", summary: "Project and communication tools for small teams and community organisations.", to: "/collaboration" },
  { name: "TUAN TV", summary: "Educational broadcasts, partner promotions, and recorded content archives.", to: "/media" },
];

export default function DivisionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">Platform Components</p>
      <h1 className="mt-4 font-display text-5xl">Six core functions connected by one identity and trust layer.</h1>
      <p className="mt-6 max-w-3xl text-[var(--text-soft)]">
        TUAN Digital is designed as one central platform where learning, services, media, collaboration, and innovation operate together through the shared partner dashboard model.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {divisions.map((item) => (
          <Link key={item.name} to={item.to} className="card card-hover">
            <h2 className="font-display text-2xl">{item.name}</h2>
            <p className="mt-3 text-sm text-[var(--text-soft)]">{item.summary}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 card">
        <h2 className="font-display text-3xl">Shared Partner Dashboard</h2>
        <p className="mt-3 text-sm text-[var(--text-soft)]">
          Partners can operate professionally through one dashboard to deliver classes, sell products or services, publish TUAN TV content, and manage clients, learners, payments, and projects.
        </p>
      </div>
    </div>
  );
}
