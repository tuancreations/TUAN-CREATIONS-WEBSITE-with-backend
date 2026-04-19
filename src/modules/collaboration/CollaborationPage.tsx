const projects = [
  { name: "Cross-border Payments UX", team: 7, status: "In Progress" },
  { name: "Telecom Rollout Dashboard", team: 5, status: "Planning" },
  { name: "Agritech IoT Pilot", team: 11, status: "Delivery" },
];

export default function CollaborationPage() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-display text-3xl">Collaboration Workspace</h2>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Start projects, invite teams, and keep communication and delivery in one shared workspace.
        </p>
        <p className="mt-3 text-sm text-[var(--text-soft)]">
          This space helps partners, freelancers, and clients stay aligned from kickoff to delivery.
        </p>
        <div className="mt-4 flex gap-2">
          <button className="btn-primary text-xs">Create Project</button>
          <button className="btn-ghost text-xs">Invite Team</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.name} className="card">
            <h3 className="font-display text-xl">{project.name}</h3>
            <p className="mt-2 text-sm text-[var(--text-soft)]">Team size: {project.team}</p>
            <p className="mt-2 text-sm text-[var(--gold)]">Status: {project.status}</p>
            <p className="mt-1 text-xs text-[var(--text-soft)]">Track tasks, communicate quickly, and keep projects on time</p>
            <div className="mt-4 flex gap-2">
              <button className="btn-ghost text-xs">Open Chat</button>
              <button className="btn-ghost text-xs">Manage Tasks</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
