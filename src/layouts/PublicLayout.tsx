import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BackButton from "../components/BackButton";

const publicNav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/divisions", label: "Divisions" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text)]">
      <div className="hero-glow" aria-hidden />

      <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:rgba(8,17,29,0.78)] border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <BackButton fallbackTo="/" label="Back" className="shrink-0" />
            <Link to="/" className="flex items-center gap-2 text-center text-[var(--gold)] sm:gap-3 lg:text-left">
              <span className="logo-container logo-container-sm">
                <img src="/tuan-logo.png" alt="TUAN Creations Company Ltd Logo" />
              </span>
              <span className="font-display text-base tracking-wide sm:text-lg lg:text-xl">TUAN Creations Company Ltd</span>
            </Link>
          </div>

          <nav className="hidden flex-wrap justify-center gap-2 md:justify-end lg:flex">
            {publicNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-xs transition sm:px-4 sm:text-sm ${
                    isActive
                      ? "bg-[var(--gold)] text-[var(--ink)]"
                      : "text-[var(--text-soft)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link className="btn-primary hidden text-xs sm:text-sm lg:inline-flex" to="/dashboard">
            <span className="block text-center">Explore TUAN Digital Platform</span>
          </Link>

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-full border border-[var(--line)] p-2 text-[var(--gold-soft)] transition hover:border-[var(--gold)] hover:text-[var(--text)] lg:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[var(--line)] px-4 py-3 sm:px-6 lg:hidden">
            <nav className="flex flex-col gap-2">
              {publicNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-[var(--gold)] text-[var(--ink)]"
                        : "text-[var(--text-soft)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link className="btn-primary mt-1 text-center text-sm" to="/dashboard" onClick={closeMobileMenu}>
                Explore TUAN Digital Platform
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-[var(--line)] bg-[color:rgba(7,14,24,0.9)]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-10 text-center text-sm text-[var(--text-soft)] sm:px-6 lg:grid-cols-3 lg:px-8 lg:text-left">
          <div>
            <p>TUAN Digital Platform - a product by TUAN Creations Company Ltd.</p>
            <p className="mt-1 text-xs">[The United African Nation - "All-in-One Digital Space"]</p>
          </div>
          <div className="space-y-1">
            <p>tuancreations.africa@gmail.com</p>
            <p>+256 753 414 058</p>
            <p>Kampala, Uganda</p>
          </div>
          <p className="lg:text-right">Copyright 2026 TUAN Creations Company Ltd</p>
        </div>
      </footer>
    </div>
  );
}
