import { Link } from "react-router-dom";

const posts = [
  {
    title: "From Discovery to Transaction: How Identity Changes Platform Economics",
    excerpt: "How TUAN connects trust, onboarding, and income opportunities in one place.",
  },
  {
    title: "Live Learning as a Growth Engine for Marketplace Demand",
    excerpt: "Why academy sessions should feed directly into verified service orders.",
  },
  {
    title: "Media to Marketplace: Turning Storytelling into Economic Activity",
    excerpt: "How TUAN TV drives qualified traffic to partner offerings.",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">Blog</p>
      <h1 className="mt-4 font-display text-5xl">Ecosystem insights, strategy notes, and execution updates.</h1>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.title} className="card">
            <h2 className="font-display text-2xl">{post.title}</h2>
            <p className="mt-3 text-sm text-[var(--text-soft)]">{post.excerpt}</p>
            <div className="mt-5 flex gap-2">
              <Link className="btn-ghost text-xs" to="/academy">Enroll in Course</Link>
              <Link className="btn-ghost text-xs" to="/marketplace">Hire Partner</Link>
              <Link className="btn-ghost text-xs" to="/media">Watch TUAN TV</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
