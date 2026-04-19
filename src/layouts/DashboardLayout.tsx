import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth";

const moduleNav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/academy", label: "Academy" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/media", label: "Media" },
  { to: "/collaboration", label: "Collaboration" },
  { to: "/iot", label: "TUAN Innovations" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isGuest = !user;
  const dashboardNote = isGuest
    ? "You are browsing the TUAN Digital Platform as a guest. Sign in or sign up to save your choices, submit requests, and manage your activity."
    : "Your TUAN workspace is ready. Use this space to manage learning, services, media, collaboration, and innovation from one account.";

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[250px_1fr] lg:px-8">
        <aside className="h-fit rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5">
          <Link to="/dashboard" className="flex flex-col items-center justify-center gap-2 text-center text-[var(--gold)]">
            <span className="logo-container logo-container-sm">
              <img src="/tuan-logo.png" alt="TUAN Creations Company Ltd Logo" />
            </span>
            <div>
              <span className="font-display text-lg">TUAN Digital Platform</span>
              <p className="mt-1 text-[11px] leading-tight text-[var(--text-soft)]">[The United African Nation - "All-in-One Digital Space"]</p>
            </div>
          </Link>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            {isGuest ? "Guest access" : `${user?.name} (${user?.role})`}
          </p>
          <p className="mt-2 text-xs text-[var(--text-soft)]">{dashboardNote}</p>

          <nav className="mt-6 flex flex-col gap-2">
            {moduleNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-[var(--gold)] text-[var(--ink)]"
                      : "text-[var(--text-soft)] hover:bg-[color:rgba(220,173,75,0.14)] hover:text-[var(--text)]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {isGuest ? (
            <div className="mt-6 space-y-3">
              <Link className="btn-primary block w-full text-center text-sm" to="/auth">
                Sign in / Sign up
              </Link>
              <Link className="btn-ghost block w-full text-center text-sm" to="/auth">
                Choose a service
              </Link>
            </div>
          ) : (
            <button className="mt-6 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm text-[var(--text-soft)] hover:bg-[var(--panel)]" onClick={logout}>
              Sign out
            </button>
          )}
        </aside>

        <section className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-[var(--line)] pb-4">
            <h1 className="font-display text-2xl">{moduleNav.find((i) => i.to === location.pathname)?.label ?? "Dashboard"}</h1>
            <div className="flex items-center gap-3">
              <Link className="text-sm text-[var(--gold)] hover:underline" to="/">
                Public Site
              </Link>
              {isGuest ? (
                <Link className="text-sm text-[var(--gold)] hover:underline" to="/auth">
                  Login / Signup
                </Link>
              ) : (
                <span className="text-sm text-[var(--text-soft)]">Signed in as {user?.role}</span>
              )}
            </div>
          </div>
          {isGuest && (
            <div className="mb-6 rounded-2xl border border-[color:rgba(220,173,75,0.35)] bg-[color:rgba(220,173,75,0.08)] p-4 text-sm text-[var(--text-soft)]">
              You are browsing as a guest. Log in or sign up when you are ready to choose a service, save progress, or submit a request.
            </div>
          )}
          {!isGuest && (
            <div className="mb-6 rounded-2xl border border-[color:rgba(70,216,195,0.28)] bg-[color:rgba(70,216,195,0.08)] p-4 text-sm text-[var(--text-soft)]">
              Signed in as {user?.name}. This is your private TUAN workspace for your selected role.
            </div>
          )}
          <Outlet />
        </section>
      </div>
    </div>
  );
}
