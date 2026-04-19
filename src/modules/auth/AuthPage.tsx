import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRole, useAuth } from "../../store/auth";

const roles: UserRole[] = ["student", "partner", "client", "investor"];

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("student");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ name: name.trim() || "TUAN Member", email: email.trim(), role });
    navigate(from, { replace: true });
  };

  return (
    <div className="mx-auto grid min-h-[80vh] w-full max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p className="eyebrow">Welcome</p>
        <h1 className="mt-4 font-display text-5xl leading-tight">Identity unlocks the full TUAN Digital Platform.</h1>
        <p className="mt-5 max-w-xl text-[var(--text-soft)]">
          Sign in to access your role-based platform space, verification status, and services across academy,
          marketplace, media, collaboration, and innovation programs.
        </p>
      </div>

      <form onSubmit={onSubmit} className="card space-y-5">
        <h2 className="font-display text-2xl">Continue to TUAN Digital</h2>
        <label className="field-label">
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="field-input" required />
        </label>

        <label className="field-label">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="field-input" required />
        </label>

        <label className="field-label">
          Role
          <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="field-input" required>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r[0].toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 text-sm text-[var(--text-soft)]">
          Student, Partner, Client, and Investor accounts give you the right tools and features for your journey on TUAN Digital.
        </div>

        <button className="btn-primary w-full" type="submit">
          Access TUAN Digital Platform
        </button>
      </form>
    </div>
  );
}
