import { Mail, Linkedin, Phone, Twitter } from "lucide-react";
import { loadManagementTeam } from "../../modules/admin/managementTeamData";

const TEAM = loadManagementTeam();

export default function ManagementTeam() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">About — Management</p>
      <h1 className="mt-4 font-display text-2xl sm:text-3xl">Management Team</h1>

      <p className="mt-4 text-sm text-[var(--text-soft)] max-w-3xl">Meet the experienced leaders steering TUAN Creations Company Ltd. Each member brings deep sector experience and a commitment to our mission.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {TEAM.map((m) => (
          <article key={m.id} className="card flex gap-4 items-start">
            <img src={m.photo} alt={m.name} className="h-24 w-24 rounded-2xl object-cover" />
            <div>
              <h2 className="font-display text-lg text-[var(--text)]">{m.name}</h2>
              <p className="text-sm text-[var(--text-soft)]">{m.position}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--text-soft)]">
                <span className="rounded-full border border-[var(--line)] px-3 py-1">{m.nationality}</span>
                <span className="rounded-full border border-[var(--line)] px-3 py-1">DOB: {m.dateOfBirth}</span>
              </div>
              {m.description && <p className="mt-2 text-sm text-[var(--text-soft)]">{m.description}</p>}

              {m.experience && (
                <ul className="mt-3 space-y-1 text-sm text-[var(--text-soft)]">
                  {m.experience.map((e) => (
                    <li key={e}>• {e}</li>
                  ))}
                </ul>
              )}

              <div className="mt-3 flex gap-3 text-[var(--text-soft)]">
                {m.email && (
                  <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1">
                    <Mail size={14} /> <span className="hidden sm:inline">{m.email}</span>
                  </a>
                )}
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1">
                    <Phone size={14} /> <span className="hidden sm:inline">{m.phone}</span>
                  </a>
                )}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                    <Linkedin size={14} /> <span className="hidden sm:inline">LinkedIn</span>
                  </a>
                )}
                {m.twitter && (
                  <a href={m.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                    <Twitter size={14} /> <span className="hidden sm:inline">Twitter</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
