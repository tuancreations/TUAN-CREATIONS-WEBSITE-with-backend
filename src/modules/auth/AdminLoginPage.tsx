import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({
        name: "Platform Admin",
        email: email.trim(),
        role: "admin",
        password,
      });
      navigate(from, { replace: true });
    } catch (nextError) {
      const fallbackMessage = "Unable to sign in as admin right now. Check backend status and credentials.";
      setError(nextError instanceof Error && nextError.message ? nextError.message : fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[80vh] w-full max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p className="eyebrow">Admin Access</p>
        <h1 className="mt-4 max-w-xl font-display text-2xl leading-tight sm:text-3xl lg:text-4xl">Secure TUAN platform administration.</h1>
        <p className="mt-5 max-w-xl text-[var(--text-soft)]">
          This entry is restricted to configured admin credentials only. Sign in to manage users, platform activity,
          and operational visibility.
        </p>
      </div>

      <form onSubmit={onSubmit} className="card space-y-5">
        <h2 className="font-display text-2xl">Admin Sign In</h2>

        <label className="field-label">
          Admin email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="field-input"
            required
          />
        </label>

        <label className="field-label">
          Admin password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="field-input"
            required
          />
        </label>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 text-sm text-[var(--text-soft)]">
          Credentials must match `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured on the backend.
        </div>

        {error && <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

        <button className="btn-primary w-full disabled:opacity-60" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Access Admin Dashboard"}
        </button>

        <p className="text-sm text-[var(--text-soft)]">
          Need standard account access? <Link to="/auth" className="text-[var(--gold)] hover:underline">Go to member login</Link>.
        </p>
      </form>
    </div>
  );
}