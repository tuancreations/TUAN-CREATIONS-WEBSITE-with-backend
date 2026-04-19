const programs = [
  { title: "Smart Farming Kit Program", mode: "Hands-on", seats: 120 },
  { title: "City Sensors Innovation Track", mode: "Hybrid", seats: 80 },
  { title: "Youth Robotics Sprint", mode: "On-site", seats: 60 },
];

export default function IotPage() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-display text-3xl">IoT and Innovation Service</h2>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Discover innovation programs, access learning kits, and share prototypes with schools, young innovators, and partner organisations.
        </p>
        <p className="mt-3 text-sm text-[var(--text-soft)]">
          This hub is designed for robotics, IoT, and practical innovation content built for African learning environments.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => (
          <article key={program.title} className="card card-hover">
            <h3 className="font-display text-xl">{program.title}</h3>
            <p className="mt-2 text-sm text-[var(--text-soft)]">Mode: {program.mode}</p>
            <p className="mt-2 text-sm text-[var(--gold)]">Seats: {program.seats}</p>
            <p className="mt-1 text-xs text-[var(--text-soft)]">Includes kits, resources, and build support</p>
            <div className="mt-4 flex gap-2">
              <button className="btn-primary text-xs">Enroll</button>
              <button className="btn-ghost text-xs">Resources</button>
              <button className="btn-ghost text-xs">Share Build</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
