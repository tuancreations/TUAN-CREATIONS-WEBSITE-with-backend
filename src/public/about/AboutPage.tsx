export default function AboutPage() {
  const pillars = [
    {
      title: "The Problem",
      text: "Many people and businesses struggle with scattered digital tools, high costs, and unverified providers.",
    },
    {
      title: "The Solution",
      text: "TUAN Digital brings services, learning, media, and innovation together in one trusted platform.",
    },
    {
      title: "Shared Partner Model",
      text: "ICT companies and freelancers can partner with TUAN to deliver quality services through one coordinated system.",
    },
  ];

  const revenuePillars = [
    "Platform access revenue from subscriptions, institutional packages, and verification fees.",
    "Platform activity revenue from course sales, commissions, and premium digital content.",
    "Platform services revenue from TUAN TV advertising, IoT programs, and partnerships.",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">About TUAN</p>
      <h1 className="mt-4 max-w-3xl font-display text-2xl leading-tight sm:text-3xl">Building a trusted digital platform for growth and opportunity.</h1>
      <p className="mt-6 max-w-4xl text-[var(--text-soft)]">
        TUAN Creations Company Ltd builds and operates TUAN Digital Platform so clients can access trusted services, students can learn practical skills, investors can monitor growth, and partners can scale with confidence.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="card">
            <h2 className="font-display text-2xl text-[var(--gold)]">{pillar.title}</h2>
            <p className="mt-3 text-sm text-[var(--text-soft)]">{pillar.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 card">
        <h2 className="font-display text-2xl sm:text-3xl">Why People Choose TUAN Digital</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <p className="text-sm text-[var(--text-soft)]">One connected journey from learning to hiring, media exposure, and project delivery.</p>
          <p className="text-sm text-[var(--text-soft)]">Verified profiles and clear trust signals that help users choose with confidence.</p>
          <p className="text-sm text-[var(--text-soft)]">Affordable access for students, startups, and growing businesses.</p>
          <p className="text-sm text-[var(--text-soft)]">Built for scale across multiple sectors and regions.</p>
        </div>
      </div>

      <div className="mt-10 card">
        <h2 className="font-display text-2xl sm:text-3xl">Unified Revenue Model</h2>
        <ul className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
          {revenuePillars.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
