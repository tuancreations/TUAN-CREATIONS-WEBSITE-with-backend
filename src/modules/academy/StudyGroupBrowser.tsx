import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Users, PlusCircle, ShieldCheck } from "lucide-react";
import { createStudyGroup, getStudyGroups, joinStudyGroup, type StudyGroup } from "../../services/api";
import { useAuth } from "../../store/auth";

export default function StudyGroupBrowser() {
  const { courseId } = useParams<{ courseId: string }>();
  const courseIdNumber = Number(courseId);
  const { user } = useAuth();

  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [maxMembers, setMaxMembers] = useState(10);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = async () => {
    const items = await getStudyGroups(courseIdNumber);
    setGroups(items);
  };

  useEffect(() => {
    let isMounted = true;
    if (Number.isNaN(courseIdNumber)) return;

    getStudyGroups(courseIdNumber).then((items) => {
      if (isMounted) setGroups(items);
    });

    return () => {
      isMounted = false;
    };
  }, [courseIdNumber]);

  const handleCreate = async () => {
    if (!name.trim()) {
      setMessage("Group name is required.");
      return;
    }

    const created = await createStudyGroup(courseIdNumber, { name, description, topic, maxMembers });
    if (created) {
      setGroups((prev) => [created, ...prev]);
      setName("");
      setDescription("");
      setTopic("");
      setMessage("Study group created.");
    } else {
      setMessage("Could not create the group right now.");
    }
  };

  const handleJoin = async (groupId?: string) => {
    if (!groupId) return;
    setBusyId(groupId);
    const joined = await joinStudyGroup(groupId);
    if (joined) {
      await refresh();
      setMessage("Joined the group.");
    } else {
      setMessage("Unable to join the group.");
    }
    setBusyId(null);
  };

  return (
    <div className="space-y-6">
      <section className="card">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-soft)]">Tier 3</p>
        <h1 className="mt-2 font-display text-3xl">Study Groups</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-soft)]">
          Create a group for the course, join active circles, and collaborate around shared learning goals.
        </p>
        {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
      </section>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="card space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium"><PlusCircle size={16} /> Create Group</div>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Group name" className="input-field" />
          <input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Topic" className="input-field" />
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Group description" className="input-field min-h-28" />
          <label className="block text-sm text-[var(--text-soft)]">
            Max members
            <input type="number" min={2} max={50} value={maxMembers} onChange={(event) => setMaxMembers(Number(event.target.value))} className="input-field mt-2" />
          </label>
          <button className="btn-primary w-full" onClick={handleCreate} disabled={!user}>Create Group</button>
          {!user && <p className="text-xs text-[var(--text-soft)]">Sign in to create a group.</p>}
        </aside>

        <section className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <article key={group._id} className="card card-hover">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl">{group.name}</h2>
                  <p className="mt-1 text-sm text-[var(--text-soft)]">{group.topic || "General discussion"}</p>
                </div>
                <ShieldCheck className="text-emerald-300" size={18} />
              </div>
              <p className="mt-3 text-sm text-[var(--text-soft)]">{group.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-soft)]">
                <span className="flex items-center gap-2"><Users size={15} /> {group.members.length}/{group.maxMembers}</span>
                <span>{group.isActive ? "Active" : "Archived"}</span>
              </div>
              <button className="btn-ghost mt-4 w-full" onClick={() => handleJoin(group._id)} disabled={!user || busyId === group._id}>
                {busyId === group._id ? "Joining..." : "Join Group"}
              </button>
            </article>
          ))}
          {groups.length === 0 && <div className="card text-sm text-[var(--text-soft)]">No groups yet. Create the first one.</div>}
        </section>
      </div>
    </div>
  );
}
