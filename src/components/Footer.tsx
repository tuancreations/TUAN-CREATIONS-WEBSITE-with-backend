import { memo } from "react";
import { Link } from "react-router-dom";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { theme } from "../bright-gold/theme";
import { useSiteConfig } from "../hooks/useSiteConfig";

const Footer = memo(() => {
  const [config] = useSiteConfig();

  return (
    <footer style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }} className="text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4 md:text-left">
          <div className="col-span-1 flex flex-col items-center md:col-span-2 md:items-start">
            <span className="logo-container mb-4 h-16 w-[min(100%,12rem)] md:h-20 md:w-[16rem]">
              <img src="/tuan-logo.png" alt={`${config["site.name"] || "TUAN"} Logo`} />
            </span>
            <p className="mb-3 max-w-md text-sm text-gray-800 md:text-base">
              {config["site.description"] || "Building the United African Nation in Technology through practical learning, trusted services, and innovation."}
            </p>
            <p className="font-semibold italic text-teal-700">{config["site.tagline"] || "Africa Inspired!"}</p>
          </div>

          <div>
            <h4 className="mb-4 text-base font-semibold text-gray-900 md:text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-800 md:text-base">
              <li><Link to="/" className="transition-colors hover:text-teal-700">Home</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-teal-700">About</Link></li>
              <li><Link to="/divisions" className="transition-colors hover:text-teal-700">Divisions</Link></li>
              <li><Link to="/blog" className="transition-colors hover:text-teal-700">Blog</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-teal-700">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-base font-semibold text-gray-900 md:text-lg">Contact</h4>
            <div className="space-y-3 text-sm text-gray-800 md:text-base">
              {config["contact.email"] && (
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <Mail className="h-4 w-4 text-teal-700" />
                  <span>{config["contact.email"]}</span>
                </div>
              )}
              {config["contact.phone"] && (
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <Phone className="h-4 w-4 text-teal-700" />
                  <span>{config["contact.phone"]}</span>
                </div>
              )}
              {config["contact.location"] && (
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <MapPin className="h-4 w-4 text-teal-700" />
                  <span>{config["contact.location"]}</span>
                </div>
              )}
              {config["contact.region"] && (
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <Globe className="h-4 w-4 text-teal-700" />
                  <span>{config["contact.region"]}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-300 pt-6 text-center">
          <p className="text-sm font-medium text-gray-800 md:text-base">
            © {config["copyright.year"] || "2026"} {config["site.name"] || "TUAN Creations Company Ltd"}. All rights reserved.
          </p>

          <div className="mt-2 flex flex-col items-center gap-2 text-sm text-gray-800 md:flex-row md:justify-center md:gap-6">
            {config["contact.email"] && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-700" />
                <a href={`mailto:${config["contact.email"]}`} className="hover:underline">{config["contact.email"]}</a>
              </div>
            )}

            {(config["contact.phone"] || true) && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-700" />
                <a href={`tel:${config["contact.phone"] || "+256753414058"}`} className="hover:underline">{config["contact.phone"] || "+256 753 414 058"}</a>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-teal-700" />
              <a href="tel:+256787882124" className="hover:underline">+256 787 882 124</a>
            </div>

            {config["contact.location"] && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-700" />
                <span>{config["contact.location"]}</span>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-gray-700 md:text-sm">
            Company registration number (URSB): 80034131408564. P.O.Box 207659 - Kampala.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
