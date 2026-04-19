const channels = [
  { name: "TUAN Prime", audience: "42K followers", status: "Live now" },
  { name: "Innovation Pulse", audience: "18K followers", status: "New episode" },
  { name: "Builders of Africa", audience: "24K followers", status: "Recording archive" },
];

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-display text-3xl">TUAN TV Media Service</h2>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Watch live shows, replay episodes, and follow channels that matter to your goals.
        </p>
        <p className="mt-3 text-sm text-[var(--text-soft)]">
          TUAN TV supports student learning, partner visibility, client education, and investor insight.
        </p>
      </div>

      <div className="card">
        <div className="aspect-video rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--panel)] to-[color:rgba(220,173,75,0.12)] p-6">
          <p className="text-sm text-[var(--text-soft)]">Live now</p>
          <h3 className="mt-2 font-display text-2xl">Africa Tech Frontlines</h3>
          <p className="mt-3 max-w-lg text-sm text-[var(--text-soft)]">Live programs appear here, and each broadcast stays available for easy replay.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {channels.map((channel) => (
          <article key={channel.name} className="card card-hover">
            <h3 className="font-display text-xl">{channel.name}</h3>
            <p className="mt-2 text-sm text-[var(--text-soft)]">{channel.audience}</p>
            <p className="mt-2 text-sm text-[var(--gold)]">{channel.status}</p>
            <p className="mt-1 text-xs text-[var(--text-soft)]">Saved on this channel for students, clients, and followers</p>
            <button className="btn-ghost mt-4 text-xs">Follow Channel</button>
          </article>
        ))}
      </div>
    </div>
  );
}
