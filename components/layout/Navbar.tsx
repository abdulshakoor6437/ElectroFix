"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { BUSINESS_NAME } from "@/lib/constants";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-navy border-b border-gray-800 shadow-sm">
      <div className="container-wide py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Mobile CTA Row */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label={`${BUSINESS_NAME} home`}
            >
              <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap className="w-4.5 h-4.5 text-navy" strokeWidth={2.5} />
              </div>
              <span className="text-white font-display font-bold text-lg tracking-tight">
                {BUSINESS_NAME}
              </span>
            </Link>

            {/* Mobile Book Button */}
            <Link
              href="/book"
              className="md:hidden px-3.5 py-1.5 bg-amber text-navy rounded-lg text-xs font-bold hover:bg-[#d99f00] active:scale-[0.97] transition-all"
            >
              Book Now
            </Link>
          </div>

          {/* Navigation Links and Desktop CTA */}
          <div className="flex items-center justify-center md:justify-end gap-4">
            <nav className="flex items-center justify-center gap-1 sm:gap-2" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2 py-1 text-gray-300 hover:text-white rounded text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Book Button */}
            <Link
              href="/book"
              className="hidden md:inline-block px-4 py-2 bg-amber text-navy rounded-lg text-xs font-bold hover:bg-[#d99f00] active:scale-[0.97] transition-all"
            >
              Book Now
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
