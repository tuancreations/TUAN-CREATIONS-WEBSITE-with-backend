export default function AboutPage() {
  const pillars = [
    {
      title: "The Problem",
      text: "Africa's digital ecosystem is fragmented, expensive, and exposed to scams, unverified providers, and scattered tools.",
    },
    {
      title: "The Solution",
      text: "TUAN Digital unifies services, learning, media, innovation, and collaboration in one trusted environment.",
    },
    {
      title: "Shared Partner Model",
      text: "Partners operate through a single dashboard to deliver classes, services, adverts, and client work professionally.",
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
      <h1 className="mt-4 max-w-3xl font-display text-5xl">Building Africa's trusted digital operating platform.</h1>
      <p className="mt-6 max-w-4xl text-[var(--text-soft)]">
        TUAN Digital is designed for African realities: high data costs, fragmented systems, unverified services, and the need for a central trusted space for skills, services, media, and innovation.
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
        <h2 className="font-display text-3xl">Why TUAN Digital Is 10x Better</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <p className="text-sm text-[var(--text-soft)]">Integration: one place for skills, services, collaboration, marketplace, IoT, and media.</p>
          <p className="text-sm text-[var(--text-soft)]">Trust: verified identities reduce fraud and improve quality of delivery.</p>
          <p className="text-sm text-[var(--text-soft)]">Affordability: shared infrastructure lowers costs for providers and users.</p>
          <p className="text-sm text-[var(--text-soft)]">Scalability: built to support thousands of providers across multiple African countries.</p>
        </div>
      </div>

      <div className="mt-10 card">
        <h2 className="font-display text-3xl">Unified Revenue Model</h2>
        <ul className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
          {revenuePillars.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
