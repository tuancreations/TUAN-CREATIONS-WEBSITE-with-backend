import { useEffect, useState } from "react";
import { Download, LineChart, TrendingUp, Users2 } from "lucide-react";
import { getAcademyAnalytics, type AnalyticsData } from "../../services/api";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getAcademyAnalytics().then((data) => {
      if (!isMounted) return;
      setAnalytics(data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExport = () => {
    if (!analytics) return;
    const csv = [
      ["Metric", "Value"],
      ["Total Courses", analytics.totalCourses],
      ["Total Enrollments", analytics.totalEnrollments],
      ["Total Users", analytics.totalUsers],
      ["Total Certificates", analytics.totalCertificates],
      ["Total Quiz Attempts", analytics.totalQuizAttempts],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "academy-analytics.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Exported CSV report.");
  };

  return (
    <div className="space-y-6">
      <section className="card">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-soft)]">Admin</p>
        <h1 className="mt-2 font-display text-3xl">Academy Analytics</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-soft)]">
          Track enrollment volume, completion patterns, and course popularity from one dashboard.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn-primary" onClick={handleExport}>
            <Download className="mr-2 inline-block" size={16} /> Export CSV
          </button>
          {message && <span className="text-sm text-emerald-300">{message}</span>}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Courses", value: analytics?.totalCourses ?? 0, icon: LineChart },
          { label: "Enrollments", value: analytics?.totalEnrollments ?? 0, icon: Users2 },
          { label: "Certificates", value: analytics?.totalCertificates ?? 0, icon: TrendingUp },
          { label: "Quiz Attempts", value: analytics?.totalQuizAttempts ?? 0, icon: LineChart },
        ].map((item) => (
          <article key={item.label} className="card">
            <div className="flex items-center justify-between text-sm text-[var(--text-soft)]">
              <span>{item.label}</span>
              <item.icon size={16} />
            </div>
            <div className="mt-3 font-display text-3xl">{item.value}</div>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="card">
          <h2 className="font-display text-xl">Popular Courses</h2>
          <div className="mt-4 space-y-3">
            {(analytics?.coursesData ?? []).map((course) => (
              <div key={course.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{course.title}</span>
                  <span className="text-[var(--text-soft)]">{course.enrolled.toLocaleString()} enrolled</span>
                </div>
              </div>
            ))}
            {(analytics?.coursesData ?? []).length === 0 && <p className="text-sm text-[var(--text-soft)]">No course metrics yet.</p>}
          </div>
        </section>

        <section className="card">
          <h2 className="font-display text-xl">Completion Rates</h2>
          <div className="mt-4 space-y-3">
            {(analytics?.completionRates ?? []).map((item) => (
              <div key={item._id}>
                <div className="flex items-center justify-between text-sm">
                  <span>Course {item._id}</span>
                  <span>{Math.round(item.completionRate * 100)}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-[var(--accent)]" style={{ width: `${Math.round(item.completionRate * 100)}%` }} />
                </div>
              </div>
            ))}
            {(analytics?.completionRates ?? []).length === 0 && <p className="text-sm text-[var(--text-soft)]">No completion data available.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
