import { loadManagementTeam } from "../../modules/admin/managementTeamData";

const TEAM = loadManagementTeam();

function isBOD(position?: string) {
  if (!position) return false;
  return /B\.O\.D|BOARD/i.test(position);
}

function seniorityScore(position?: string) {
  if (!position) return 0;
  const p = position.toUpperCase();
  if (/CHAIRMAN/.test(p)) return 100;
  if (/VICE CHAIRMAN|VICE CHAIR/.test(p)) return 90;
  if (/EXECUTIVE DIRECTOR|C.E.O|CEO/.test(p)) return 200; // highest within executives
  if (/HEAD OF|HEAD/.test(p)) return 180;
  if (/CHIEF/.test(p)) return 170;
  if (/MANAGEMENT ADVISOR|ADVISOR/.test(p)) return 120;
  if (/LEAD|MANAGER/.test(p)) return 160;
  if (/ASSISTANT/.test(p)) return 110;
  return 50;
}

function memberPriority(member) {
  // Explicit ordering overrides
  if (member.id === "behangana-keneth") return 1000; // Keneth first
  if (member.id === "mugumya-benard") return 950; // Benard second
  if (member.id === "nakiyingi-irene") return 900; // CEO after B.O.D
  if (member.id === "butera-marcel") return 850; // Tech lead immediately after CEO
  if (member.id === "nuwahereza-peter") return 845; // Assistant immediately after Tech lead

  // Fallback to position-based score
  return seniorityScore(member.position) || 0;
}

export default function ManagementTeam() {
  const board = TEAM.filter((m) => isBOD(m.position)).sort((a, b) => memberPriority(b) - memberPriority(a));
  const exec = TEAM.filter((m) => !isBOD(m.position)).sort((a, b) => memberPriority(b) - memberPriority(a));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">About — Management</p>
      <h1 className="mt-4 font-display text-2xl sm:text-3xl">Management Team</h1>

      <p className="mt-4 text-sm text-[var(--text-soft)] max-w-3xl">Meet the experienced leaders steering TUAN Creations Company Ltd. Each member brings deep sector experience and a commitment to our mission.</p>

      {board.length > 0 && (
        <section className="mt-8">
          <h3 className="font-display text-xl">Board of Directors</h3>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {board.map((m) => (
              <article key={m.id} className="card flex gap-4 items-start">
                <img src={m.photo} alt={m.name} className="h-24 w-24 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg text-[var(--text)]">{m.name}</h2>
                  <p className="text-sm font-medium text-[var(--text-soft)]">{m.position}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--text-soft)]">
                    <span className="rounded-full border border-[var(--line)] px-3 py-1">{m.occupation}</span>
                  </div>
                  {m.description && <p className="mt-2 text-sm text-[var(--text-soft)]">{m.description}</p>}
                  {m.experience && (
                    <ul className="mt-3 space-y-1 text-sm text-[var(--text-soft)]">
                      {m.experience.map((e) => (
                        <li key={e}>• {e}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {exec.length > 0 && (
        <section className="mt-8">
          <h3 className="font-display text-xl">Executive Team</h3>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {exec.map((m) => (
              <article key={m.id} className="card flex gap-4 items-start">
                <img src={m.photo} alt={m.name} className="h-24 w-24 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg text-[var(--text)]">{m.name}</h2>
                  <p className="text-sm font-medium text-[var(--text-soft)]">{m.position}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--text-soft)]">
                    <span className="rounded-full border border-[var(--line)] px-3 py-1">{m.occupation}</span>
                  </div>
                  {m.description && <p className="mt-2 text-sm text-[var(--text-soft)]">{m.description}</p>}
                  {m.experience && (
                    <ul className="mt-3 space-y-1 text-sm text-[var(--text-soft)]">
                      {m.experience.map((e) => (
                        <li key={e}>• {e}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
