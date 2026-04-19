import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { theme } from "../bright-gold/theme"; // 🎨 Import bright gold theme

const Footer = memo(() => {
  return (
    <footer
      style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}
      className="text-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-start">
            <img
              src="/tuan-logo.svg"
              alt="TUAN Creations Company LTD Logo"
              className="h-16 w-auto mb-4"
            />
            <p className="text-gray-800 mb-4 max-w-md">
              Building the United African Nation in Technology — a Pan-African
              ICT innovation enterprise unifying and transforming the
              continent's digital economy.
            </p>
            <p className="text-teal-700 font-semibold italic">
              "Africa Inspired!"
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-800 hover:text-teal-700 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/divisions"
                  className="text-gray-800 hover:text-teal-700 transition-colors"
                >
                  Our Divisions
                </Link>
              </li>
              <li>
                <Link
                  to="/enrollment"
                  className="text-gray-800 hover:text-teal-700 transition-colors"
                >
                  Join Us
                </Link>
              </li>
              <li>
                <Link
                  to="/learning"
                  className="text-gray-800 hover:text-teal-700 transition-colors"
                >
                  Learning Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Contact
            </h4>
            <div className="space-y-3 text-gray-800">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-teal-700" />
                <span>tuancreations.africa@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-teal-700" />
                <span>+256 753 414 058</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>Kampala, Uganda</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-teal-700" />
                <span>Pan-African Operations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center">
          <p className="text-gray-800 font-medium">
            © 2025 TUAN Creations Company Ltd. All rights reserved. <br />
            <span className="italic">
              Building Africa's Digital Future Together!
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
