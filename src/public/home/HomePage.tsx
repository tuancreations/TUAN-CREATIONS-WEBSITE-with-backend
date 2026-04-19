import { Link } from "react-router-dom";

const discovery = [
  { title: "Explore Our Vision", to: "/about", description: "Understand what TUAN is building and how it creates value for communities and businesses." },
  { title: "Explore Divisions", to: "/divisions", description: "See the full range of services from software and telecom to media, academy, and innovation." },
  { title: "Start Learning", to: "/academy", description: "Join live classes, learn from trusted instructors, and replay lessons anytime." },
  { title: "Watch TUAN TV", to: "/media", description: "Follow live programs, partner channels, and recorded shows in one place." },
  { title: "Hire Trusted Partners", to: "/marketplace", description: "Choose verified ICT companies and freelancers for your next project." },
  { title: "Join as Student, Client, Partner, or Investor", to: "/auth", description: "Create your account and access services tailored to your role." },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="logo-container logo-container-sm">
            <img
              src="/tuan-logo.png"
              alt="TUAN Creations Company Ltd Logo"
            />
          </span>
          <div>
            <p className="eyebrow">TUAN Digital Platform</p>
            <p className="mt-1 text-xs text-[var(--text-soft)]">[The United African Nation - "All-in-One Digital Space"]</p>
          </div>
        </div>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-tight sm:text-6xl">
          One trusted place for learning, business services, media, innovation, and partnerships.
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-[var(--text-soft)]">
          TUAN Digital is a product of TUAN Creations Company Ltd, designed to help clients, students, investors, and partners connect, grow, and succeed with confidence.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/auth">Create Your Account</Link>
          <Link className="btn-ghost" to="/blog">Read Ecosystem Stories</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 pb-20 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {discovery.map((item) => (
          <Link key={item.title} to={item.to} className="card card-hover">
            <h3 className="font-display text-xl">{item.title}</h3>
            <p className="mt-2 text-sm text-[var(--text-soft)]">{item.description}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="card">
          <p className="eyebrow">Core Components</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <h3 className="font-display text-xl">Software & ICT Services</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Practical digital services for businesses, institutions, and organizations ready to scale.</p>
            </div>
            <div>
              <h3 className="font-display text-xl">TUAN Live Academy</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Trusted learning paths for students and professionals, with live sessions and replays.</p>
            </div>
            <div>
              <h3 className="font-display text-xl">TUAN Marketplace</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">A verified space where clients can find reliable freelancers, firms, and digital solutions.</p>
            </div>
            <div>
              <h3 className="font-display text-xl">Collaboration Tools</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Simple teamwork tools for project updates, communication, and shared delivery.</p>
            </div>
            <div>
              <h3 className="font-display text-xl">TUAN TV</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Media that educates, promotes partner work, and keeps communities informed.</p>
            </div>
            <div>
              <h3 className="font-display text-xl">TUAN Innovations</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Hands-on innovation tracks in IoT, robotics, and chip design for future-ready builders.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
