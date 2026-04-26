import { memo } from "react";
import { Link } from "react-router-dom";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { theme } from "../bright-gold/theme";

const Footer = memo(() => {
  return (
    <footer style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }} className="text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4 md:text-left">
          <div className="col-span-1 flex flex-col items-center md:col-span-2 md:items-start">
            <span className="logo-container mb-4 h-16 w-[min(100%,12rem)] md:h-20 md:w-[16rem]">
              <img src="/tuan-logo.png" alt="TUAN Creations Company Ltd Logo" />
            </span>
            <p className="mb-3 max-w-md text-sm text-gray-800 md:text-base">
              Building the United African Nation in Technology through practical learning, trusted services, and innovation.
            </p>
            <p className="font-semibold italic text-teal-700">Africa Inspired!</p>
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
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Mail className="h-4 w-4 text-teal-700" />
                <span>tuancreations.africa@gmail.com</span>
              </div>
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Phone className="h-4 w-4 text-teal-700" />
                <span>+256 753 414 058</span>
              </div>
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <MapPin className="h-4 w-4 text-teal-700" />
                <span>Kampala, Uganda</span>
              </div>
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Globe className="h-4 w-4 text-teal-700" />
                <span>Pan-African Operations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-300 pt-6 text-center">
          <p className="text-sm font-medium text-gray-800 md:text-base">
            Copyright 2026 TUAN Creations Company Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
