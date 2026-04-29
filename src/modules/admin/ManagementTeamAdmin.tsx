import { useEffect, useState } from "react";
import { User } from "lucide-react";
import {
  DEFAULT_MANAGEMENT_TEAM,
  loadManagementTeam,
  saveManagementTeam,
  type ManagementTeamMember,
} from "./managementTeamData";

export default function ManagementTeamAdmin() {
  const [members, setMembers] = useState<ManagementTeamMember[]>(() => loadManagementTeam());
  const [editing, setEditing] = useState<ManagementTeamMember | null>(null);

  useEffect(() => {
    saveManagementTeam(members);
  }, [members]);

  function resetForm() {
    setEditing(null);
  }

  function handleAdd() {
    const newMember: ManagementTeamMember = {
      id: String(Date.now()),
      name: "New member",
      position: "",
      nationality: "",
      occupation: "",
      photo: DEFAULT_MANAGEMENT_TEAM[0]?.photo ?? "",
      description: "",
      experience: [],
      email: "",
      phone: "",
      linkedin: "",
      twitter: "",
    };
    setMembers((s) => [newMember, ...s]);
    setEditing(newMember);
  }

  function handleSave(updated: ManagementTeamMember) {
    setMembers((s) => s.map((m) => (m.id === updated.id ? updated : m)));
    setEditing(null);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this team member?")) return;
    setMembers((s) => s.filter((m) => m.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  return (
    <section className="card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-2xl">Management Team (Admin)</h3>
          <p className="text-sm text-[var(--text-soft)]">Manage public team members shown on the About page.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAdd} className="btn">Add member</button>
          <button onClick={() => setMembers(DEFAULT_MANAGEMENT_TEAM)} className="btn border">Reset defaults</button>
        </div>
      </div>

      <div className="grid gap-3">
        {members.length === 0 ? (
          <div className="text-sm text-[var(--text-soft)]">No members yet. Click "Add member" to create one.</div>
        ) : (
          members.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2">
              <div className="flex items-center gap-3">
                {m.photo ? <img src={m.photo} alt={m.name} className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-[var(--line)] flex items-center justify-center"><User size={18} /></div>}
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-[var(--text-soft)]">{m.position}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(m)} className="btn">Edit</button>
                <button onClick={() => handleDelete(m.id)} className="btn border text-red-500">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && (
        <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
          <h4 className="font-medium">Edit member</h4>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" placeholder="Full name" />
            <input value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value })} className="input" placeholder="Position" />
            <input value={editing.occupation} onChange={(e) => setEditing({ ...editing, occupation: e.target.value })} className="input" placeholder="Occupation" />
            <input value={editing.photo} onChange={(e) => setEditing({ ...editing, photo: e.target.value })} className="input" placeholder="Photo URL (public or data URI)" />
            <input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="input" placeholder="Email" />
            <input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="input" placeholder="Phone" />
            <input value={editing.linkedin} onChange={(e) => setEditing({ ...editing, linkedin: e.target.value })} className="input" placeholder="LinkedIn URL" />
            <input value={editing.twitter} onChange={(e) => setEditing({ ...editing, twitter: e.target.value })} className="input" placeholder="Twitter URL" />
            <input value={editing.experience.join(", ")} onChange={(e) => setEditing({ ...editing, experience: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} className="input" placeholder="Experience (comma separated)" />
            <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input col-span-2" placeholder="Short description" />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => handleSave(editing)} className="btn">Save</button>
            <button onClick={resetForm} className="btn border">Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}
