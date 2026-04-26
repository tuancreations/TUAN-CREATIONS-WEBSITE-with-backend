import { useEffect, useState } from "react";
import { Bot, Cpu, SatelliteDish, Sparkles } from "lucide-react";
import { enrollInnovationProgram, getInnovationPrograms, type InnovationProgram } from "../../services/api";

const iconByProgram = {
  1: Bot,
  2: SatelliteDish,
  3: Cpu,
  4: Cpu,
};

const outcomes = [
  "Hands-on kits and guided build sessions",
  "Mentorship for student and community teams",
  "Prototype reviews and showcase opportunities",
  "Semiconductor chip design pathway with manufacturing partners",
  "Pathways into academy, media, and marketplace services",
];

export default function IotPage() {
  const [programs, setPrograms] = useState<InnovationProgram[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getInnovationPrograms().then((items) => {
      if (!isMounted) return;
      setPrograms(items);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEnroll = async (programId: number, title: string) => {
    try {
      const response = await enrollInnovationProgram(programId);
      setPrograms((prev) => prev.map((program) => (program.id === programId ? response.program : program)));
      setMessage(`You enrolled in ${title}.`);
    } catch {
      setMessage(`Could not enroll in ${title} right now.`);
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[color:rgba(220,173,75,0.14)] via-[color:rgba(38,139,210,0.08)] to-[color:rgba(8,17,29,0.9)] p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 text-[var(--gold)]">
          <Sparkles className="h-5 w-5" />
          <p className="eyebrow m-0">Build. Test. Launch.</p>
        </div>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl">TUAN Innovations Hub</h2>
        <p className="mt-3 max-w-3xl text-sm text-[var(--text-soft)] sm:text-base">
          A practical innovation space for robotics, IoT, and real-world prototyping. Students, founders, and institutions can explore guided tracks,
          access kits, and turn ideas into solutions that solve real problems.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn-primary text-sm">Join Innovation Program</button>
          <button className="btn-ghost text-sm">Request Starter Kit</button>
        </div>
        {message && <p className="mt-4 text-sm text-emerald-300">{message}</p>}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="card">
          <h3 className="font-display text-2xl">What you can do here</h3>
          <ul className="mt-4 space-y-2 text-sm text-[var(--text-soft)]">
            {outcomes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--gold)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h3 className="font-display text-2xl">Who this supports</h3>
          <p className="mt-4 text-sm text-[var(--text-soft)]">
            Students, schools, innovators, youth groups, partners, and investors looking for practical innovation outcomes.
          </p>
          <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">Access Model</p>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Browse as a guest, then sign in when you are ready to enroll, submit projects, and track progress.
            </p>
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => {
          const Icon = iconByProgram[program.id as keyof typeof iconByProgram] ?? Cpu;
          return (
            <article key={program.title} className="card card-hover">
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:rgba(220,173,75,0.16)] text-[var(--gold)]">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--text-soft)]">{program.mode}</span>
              </div>
              <h3 className="mt-4 font-display text-lg sm:text-xl">{program.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">{program.summary}</p>
              <p className="mt-3 text-sm text-[var(--gold)]">Available seats: {program.seats - program.enrolled} of {program.seats}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-primary text-xs" onClick={() => handleEnroll(program.id, program.title)}>Enroll</button>
                <button className="btn-ghost text-xs">View Resources</button>
                <button className="btn-ghost text-xs">Submit Project</button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="card">
        <h3 className="font-display text-2xl">Need a custom innovation program?</h3>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          TUAN can design a tailored robotics or IoT journey for your school, institution, or community project.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn-primary text-sm">Request Program Design</button>
          <button className="btn-ghost text-sm">Talk to Innovation Team</button>
        </div>
      </section>
    </div>
  );
}
