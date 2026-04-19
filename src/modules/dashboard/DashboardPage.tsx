import { dashboardMetrics } from "../../services/mockApi";
import { useAuth } from "../../store/auth";

const roleTips = {
  student: "Continue learning, join live sessions, and access recorded lectures.",
  partner: "Publish courses, create listings, stream media, and manage clients from one dashboard.",
  client: "Browse verified providers, request services, and track project delivery.",
  investor: "Monitor verification, growth metrics, and ecosystem activity across services.",
};

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="card">
        <p className="text-sm text-[var(--text-soft)]">Welcome back</p>
        <h2 className="mt-2 font-display text-3xl">{user?.name}</h2>
        <p className="mt-2 text-sm text-[var(--text-soft)]">Your path: {roleTips[user?.role ?? "student"]}</p>
        <p className="mt-3 text-sm text-[var(--text-soft)]">
          This dashboard represents the shared partner model: one interface for classes, marketplace activity, TUAN TV publishing, projects, and innovation work.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <article key={metric.label} className="card">
            <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">{metric.label}</p>
            <p className="mt-3 font-display text-3xl text-[var(--gold)]">{metric.value}</p>
            <p className="mt-2 text-xs text-[var(--text-soft)]">{metric.trend}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
