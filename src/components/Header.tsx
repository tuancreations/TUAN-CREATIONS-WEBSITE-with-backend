import { memo, useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Globe, Mail, Menu, ShoppingBag, Tv, Users, X, Lightbulb, Handshake } from "lucide-react";
import { theme } from "../bright-gold/theme";

const navigation = [
  { name: "Home", href: "/", icon: Globe },
  { name: "About", href: "/about", icon: Users },
  { name: "Divisions", href: "/divisions", icon: Globe },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Contact", href: "/contact", icon: Mail },
  { name: "TUAN Academy", href: "/academy", icon: BookOpen },
  { name: "TUAN Marketplace", href: "/marketplace", icon: ShoppingBag },
  { name: "TUAN Live", href: "/media", icon: Tv },
  { name: "TUAN Innovations Hub", href: "/iot", icon: Lightbulb },
  { name: "TUAN Collaborations Hub", href: "/collaboration", icon: Handshake },
];

const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {navigation.map(({ name, href, icon: Icon }) => {
        const isActive = location.pathname === href;
        return (
          <Link
            key={name}
            to={href}
            onClick={onClick}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
              isActive ? "bg-yellow-500 text-black shadow-md" : "text-gray-900 hover:bg-yellow-400 hover:text-black"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <header
      className="sticky top-0 z-50 shadow-md transition-all duration-300"
      style={{
        backgroundColor: theme.colors.primary,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <span className="logo-container logo-container-sm shrink-0">
              <img src="/tuan-logo.png" alt="TUAN Creations Company Ltd Logo" />
            </span>
            <span className="text-base font-bold tracking-tight text-gray-900 sm:text-lg lg:text-xl">TUAN Creations Company Ltd</span>
          </Link>

          <nav className="hidden flex-wrap justify-end gap-2 md:flex">
            <NavLinks />
          </nav>

          <button
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            className="rounded-md p-2 transition-colors hover:bg-yellow-400 hover:text-black md:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="animate-slideDown pb-4 md:hidden">
            <nav className="flex flex-col gap-2">
              <NavLinks onClick={closeMenu} />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
