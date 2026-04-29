import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Mail, Phone, MapPin } from "lucide-react";
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
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);

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
            {publicNav.map((item) => {
              if (item.to === "/about") {
                return (
                  <div key={item.to} className="relative">
                    <button
                      type="button"
                      onClick={() => setAboutMenuOpen((prev) => !prev)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs transition sm:px-4 sm:text-sm ${
                        location.pathname.startsWith("/about")
                          ? "bg-[var(--gold)] text-[var(--ink)]"
                          : "text-[var(--text-soft)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                      }`}
                    >
                      {item.label}
                      <ChevronDown size={14} />
                    </button>
                    {aboutMenuOpen && (
                      <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 shadow-xl">
                        <NavLink
                          to="/about"
                          onClick={() => setAboutMenuOpen(false)}
                          className={({ isActive }) =>
                            `block rounded-xl px-3 py-2 text-sm transition ${
                              isActive
                                ? "bg-[var(--gold)] text-[var(--ink)]"
                                : "text-[var(--text-soft)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                            }`
                          }
                        >
                          About Us
                        </NavLink>
                        <NavLink
                          to="/about/management-team"
                          onClick={() => setAboutMenuOpen(false)}
                          className={({ isActive }) =>
                            `block rounded-xl px-3 py-2 text-sm transition ${
                              isActive
                                ? "bg-[var(--gold)] text-[var(--ink)]"
                                : "text-[var(--text-soft)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                            }`
                          }
                        >
                          Management Team
                        </NavLink>
                      </div>
                    )}
                  </div>
                );
              }

              return (
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
              );
            })}
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
              {publicNav.map((item) =>
                item.to === "/about" ? (
                  <div key={item.to} className="rounded-2xl border border-[var(--line)] p-2">
                    <button
                      type="button"
                      onClick={() => setAboutMenuOpen((prev) => !prev)}
                      className={`flex w-full items-center justify-between rounded-full px-3 py-2 text-sm transition ${
                        location.pathname.startsWith("/about")
                          ? "bg-[var(--gold)] text-[var(--ink)]"
                          : "text-[var(--text-soft)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                      }`}
                    >
                      <span>About</span>
                      <ChevronDown size={14} />
                    </button>
                    {aboutMenuOpen && (
                      <div className="mt-2 flex flex-col gap-2 pl-2">
                        <NavLink
                          key="about-us-mobile"
                          to="/about"
                          onClick={closeMobileMenu}
                          className={({ isActive }) =>
                            `rounded-full px-3 py-2 text-sm transition ${
                              isActive
                                ? "bg-[var(--gold)] text-[var(--ink)]"
                                : "text-[var(--text-soft)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                            }`
                          }
                        >
                          About Us
                        </NavLink>
                        <NavLink
                          key="management-team-mobile"
                          to="/about/management-team"
                          onClick={closeMobileMenu}
                          className={({ isActive }) =>
                            `rounded-full px-3 py-2 text-sm transition ${
                              isActive
                                ? "bg-[var(--gold)] text-[var(--ink)]"
                                : "text-[var(--text-soft)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                            }`
                          }
                        >
                          Management Team
                        </NavLink>
                      </div>
                    )}
                  </div>
                ) : (
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
                ),
              )}
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
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-[var(--text-soft)] sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-display text-base tracking-wide text-[var(--gold)] sm:text-lg">
              TUAN Digital Platform
            </p>
            <p className="mt-1 text-xs text-[var(--text-soft)] sm:text-sm">
              {"[The United African Nation - \"All-in-One Digital Space\"]"}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3 text-center md:text-left md:justify-self-start md:max-w-md md:justify-items-start">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Mail className="h-4 w-4 text-teal-400" />
                <a href="mailto:tuancreations.africa@gmail.com" className="hover:underline">tuancreations.africa@gmail.com</a>
              </div>

              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Phone className="h-4 w-4 text-teal-400" />
                <a href="tel:+256753414058" className="hover:underline">+256 753 414 058</a>
              </div>

              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Phone className="h-4 w-4 text-teal-400" />
                <a href="tel:+256787882124" className="hover:underline">+256 787 882 124</a>
              </div>

              <div className="flex items-center justify-center gap-2 md:justify-start">
                <MapPin className="h-4 w-4 text-teal-400" />
                <span>Kampala, Uganda</span>
              </div>
            </div>

            <div className="text-center md:text-right md:justify-self-end md:max-w-md">
              <p className="font-medium text-[var(--text)]">© 2026 TUAN Creations Company Ltd</p>
              <p className="mt-1 text-xs leading-relaxed">
                Company registration number (URSB): 80034131408564. P.O.Box 207659 - Kampala.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
