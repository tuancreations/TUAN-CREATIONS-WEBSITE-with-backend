import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({
        name: name.trim() || "TUAN Member",
        email: email.trim(),
        role,
      });
      navigate(from, { replace: true });
    } catch (nextError) {
      const fallbackMessage = "Unable to sign in right now. Make sure the backend is running and MongoDB is connected.";
      setError(nextError instanceof Error && nextError.message ? nextError.message : fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[80vh] w-full max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p className="eyebrow">Welcome</p>
        <h1 className="mt-4 max-w-xl font-display text-2xl leading-tight sm:text-3xl lg:text-4xl">Identity unlocks the full TUAN Digital Platform.</h1>
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

        <p className="text-sm text-[var(--text-soft)]">
          Administrator? Use the dedicated <Link to="/admin/login" className="text-[var(--gold)] hover:underline">admin login</Link>.
        </p>

        {error && <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

        <button className="btn-primary w-full disabled:opacity-60" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Access TUAN Digital Platform"}
        </button>
      </form>
    </div>
  );
}
