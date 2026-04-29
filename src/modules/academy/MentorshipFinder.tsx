import { useEffect, useState } from "react";
import { BookOpen, Mail, Sparkles, Users } from "lucide-react";
import { getCourses, getMentorshipPairings, requestMentor, type Course, type MentorshipPairing } from "../../services/api";
import { useAuth } from "../../store/auth";

export default function MentorshipFinder() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [pairings, setPairings] = useState<MentorshipPairing[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [goals, setGoals] = useState("");
  const [busyCourseId, setBusyCourseId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getCourses(), getMentorshipPairings()]).then(([items, itemsPairings]) => {
      if (!isMounted) return;
      setCourses(items);
      setPairings(itemsPairings);
      setSelectedCourseId(items[0]?.id ?? null);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRequest = async (course: Course) => {
    const mentorId = (course as Course & { instructorId?: string }).instructorId;
    if (!mentorId) {
      setMessage("This course does not expose a mentor record yet.");
      return;
    }

    setBusyCourseId(course.id);
    const pairing = await requestMentor(course.id, { mentorId, goals });
    if (pairing) {
      setPairings((prev) => [pairing, ...prev]);
      setMessage("Mentorship request sent.");
      setGoals("");
      setSelectedCourseId(course.id);
    } else {
      setMessage("Could not send mentorship request right now.");
    }
    setBusyCourseId(null);
  };

  return (
    <div className="space-y-6">
      <section className="card">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-soft)]">Tier 3</p>
        <h1 className="mt-2 font-display text-3xl">Mentorship Finder</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-soft)]">
          Browse courses by mentor, request support, and track active pairings from one place.
        </p>
        {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <article key={course.id} className="card card-hover">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase text-[var(--text-soft)]">Course Mentor</div>
                  <h2 className="mt-1 font-display text-xl">{course.title}</h2>
                </div>
                <Sparkles className="text-[var(--accent)]" size={18} />
              </div>
              <div className="mt-4 space-y-2 text-sm text-[var(--text-soft)]">
                <p className="flex items-center gap-2"><BookOpen size={14} /> {course.instructor}</p>
                <p className="flex items-center gap-2"><Users size={14} /> Level: {course.level}</p>
                <p className="flex items-center gap-2"><Mail size={14} /> Request a paired mentor</p>
              </div>
              <textarea value={selectedCourseId === course.id ? goals : ""} onChange={(event) => { setSelectedCourseId(course.id); setGoals(event.target.value); }} placeholder="Goals for mentorship" className="input-field mt-4 min-h-24" />
              <button className="btn-primary mt-4 w-full" onClick={() => handleRequest(course)} disabled={!user || busyCourseId === course.id}>
                {busyCourseId === course.id ? "Sending..." : "Request Mentor"}
              </button>
            </article>
          ))}
        </section>

        <aside className="card space-y-4">
          <h2 className="font-display text-xl">My Pairings</h2>
          <div className="space-y-3">
            {pairings.map((pairing) => (
              <div key={pairing._id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{pairing.mentorName}</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs uppercase">{pairing.status}</span>
                </div>
                <p className="mt-1 text-[var(--text-soft)]">Mentee: {pairing.menteeName}</p>
                <p className="mt-2 text-[var(--text-soft)]">{pairing.goals}</p>
              </div>
            ))}
            {pairings.length === 0 && <p className="text-sm text-[var(--text-soft)]">No pairings yet.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
