import { Link } from "react-router-dom";

const posts = [
  {
    title: "How Verified Profiles Help Clients Choose the Right Partner",
    excerpt: "See how trust and clear identity help clients, students, and partners make better decisions.",
  },
  {
    title: "Why Learning and Marketplace Services Work Better Together",
    excerpt: "Discover how academy learning can lead directly to practical service opportunities.",
  },
  {
    title: "How TUAN TV Helps Partners Reach New Clients",
    excerpt: "Learn how media visibility can turn stories into real business results.",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">Blog</p>
      <h1 className="mt-4 font-display text-5xl">Stories, insights, and practical ideas for our community.</h1>

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
