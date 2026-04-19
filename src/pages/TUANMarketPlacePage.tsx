import React from "react";
import { ShoppingBag, Code2, Briefcase, Globe, Search } from "lucide-react";

const TUANMarketPlacePage: React.FC = () => {
  const companies = [
    {
      name: "TUAN Creations Company Ltd",
      description:
        "Creators of Africa-inspired digital solutions - software, telecom, media and creative technology.",
      category: "Software, Telecom & Media",
      image: "/tuan-logo.svg",
    },
    {
      name: "NexTech Uganda",
      description:
        "Leading provider of enterprise AI, cloud, and IoT solutions for modern businesses.",
      category: "AI & Cloud",
      image: "https://via.placeholder.com/80",
    },
    {
      name: "AfriCode Systems",
      description:
        "Building scalable web platforms and custom mobile apps for African startups.",
      category: "Web & Mobile",
      image: "https://via.placeholder.com/80",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Hero Section */}
      <section className="bg-yellow-600 text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold mb-4">
            TUAN <span className="text-black">MarketPlace</span>
          </h1>
          <p className="text-lg font-light">
            The virtual hub where African Tech Companies and Innovators meet,
            sell, and collaborate.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-6 -mt-8 mb-12">
        <div className="bg-white shadow-lg rounded-full flex items-center p-3">
          <Search className="text-gray-400 ml-3" size={20} />
          <input
            type="text"
            placeholder="Search companies, software, or innovations..."
            className="flex-1 bg-transparent focus:outline-none px-3 text-gray-700"
          />
          <button className="bg-yellow-600 text-white px-6 py-2 rounded-full hover:bg-yellow-500 transition">
            Search
          </button>
        </div>
      </div>

      {/* Marketplace Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="bg-gray-50 p-6 flex items-center justify-center">
              <img
                src={company.image}
                alt={company.name}
                className="h-20 w-20 object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {company.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {company.description}
              </p>
              <span className="inline-block text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full px-3 py-1">
                {company.category}
              </span>
              <div className="mt-4 flex gap-3">
                <button className="bg-yellow-600 text-white text-sm px-4 py-2 rounded-full hover:bg-yellow-500 transition flex items-center gap-2">
                  <ShoppingBag size={16} /> Visit Store
                </button>
                <button className="border border-yellow-500 text-yellow-600 text-sm px-4 py-2 rounded-full hover:bg-yellow-50 transition flex items-center gap-2">
                  <Briefcase size={16} /> Hire Company
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Info Section */}
      <section className="bg-black text-yellow-400 py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">
            Powered by African Innovation 🌍
          </h2>
          <p className="text-sm text-yellow-200">
            TUAN MarketPlace is a home for African Techpreneurs — connecting
            digital creators with enterprises and global opportunities.
          </p>
          <div className="flex justify-center gap-6 mt-6 text-yellow-300">
            <Code2 />
            <Briefcase />
            <Globe />
          </div>
        </div>
      </section>
    </div>
  );
};

export default TUANMarketPlacePage;
