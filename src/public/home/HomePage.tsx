import { Link } from "react-router-dom";

const discovery = [
  { title: "Explore Vision", to: "/about", description: "See the problem TUAN Digital solves and why the platform matters now." },
  { title: "Explore Services", to: "/divisions", description: "See everything TUAN Digital offers for learning, services, media, and innovation." },
  { title: "Start Learning", to: "/academy", description: "Access verified live academy lessons, partner classes, and recordings." },
  { title: "Watch TUAN TV", to: "/media", description: "Stream educational broadcasts, partner promotions, and recorded channels." },
  { title: "Hire Services", to: "/marketplace", description: "Find vetted freelancers, agencies, and digital service providers." },
  { title: "Join Ecosystem", to: "/auth", description: "Create a role-based identity and unlock the shared partner dashboard." },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="logo-oval-shell h-24">
            <img
              src="/tuan-logo.png"
              alt="TUAN Creations Company LTD Logo"
              className="logo-oval-shell-img"
            />
          </span>
          <p className="eyebrow">TUAN Digital Platform</p>
        </div>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-tight sm:text-6xl">
          One trusted platform for skills, services, media, innovation, and collaboration.
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-[var(--text-soft)]">
          TUAN Digital unifies Africa's fragmented digital ecosystem into one locally guided, affordable, and verified environment.
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
              <p className="mt-2 text-sm text-[var(--text-soft)]">Accessible tools and digital support for individuals, SMEs, creators, and institutions.</p>
            </div>
            <div>
              <h3 className="font-display text-xl">TUAN Live Academy</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Verified live courses and recordings hosted on the instructor or broadcaster page.</p>
            </div>
            <div>
              <h3 className="font-display text-xl">TUAN Marketplace</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">A vetted space for products, services, startups, and agencies with verified identities.</p>
            </div>
            <div>
              <h3 className="font-display text-xl">Collaboration Tools</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Project, messaging, and team tools for small groups and community organisations.</p>
            </div>
            <div>
              <h3 className="font-display text-xl">TUAN TV</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Education, innovation showcases, partner promotions, and recorded broadcasts.</p>
            </div>
            <div>
              <h3 className="font-display text-xl">IoT & Robotics Hub</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Practical resources, learning kits, and innovation content for young builders and schools.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
