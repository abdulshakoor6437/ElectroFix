import Link from "next/link";
import { Zap, Phone, MapPin, MessageCircle } from "lucide-react";
import {
  BUSINESS_NAME,
  ELECTRICIAN_NAME,
  SERVICE_AREA,
  PHONE,
  WHATSAPP_LINK,
} from "@/lib/constants";

const serviceLinks = [
  { href: "/services#fault-finding", label: "Fault Finding" },
  { href: "/services#db-board", label: "DB Board Upgrade" },
  { href: "/services#plug-points", label: "Plug & Light Points" },
  { href: "/services#geyser", label: "Geyser Wiring" },
  { href: "/services#solar", label: "Solar & Battery" },
  { href: "/services#coc", label: "Certificate of Compliance" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-gray-300 border-t border-gray-800">
      {/* Main footer */}
      <div className="container-wide py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-amber rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-navy" strokeWidth={2.5} />
              </div>
              <span
                className="text-white font-bold text-xl font-display"
              >
                {BUSINESS_NAME}
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-5">
              Licensed and certified electrician serving {SERVICE_AREA}. Fast,
              reliable, and compliant electrical work for homes and businesses.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className="flex items-center gap-2 hover:text-amber transition-colors font-mono"
              >
                <Phone className="w-4 h-4 text-amber" />
                {PHONE}
              </a>
              <span className="flex items-center gap-2 font-mono">
                <MapPin className="w-4 h-4 text-amber" />
                {SERVICE_AREA}
              </span>
            </div>
          </div>

          {/* Services column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4 font-display">
              Services
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-amber transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4 font-display">
              Quick Links
            </h3>
            <ul className="space-y-2 font-mono">
              {[
                { href: "/book", label: "Book an Appointment" },
                { href: "/reviews", label: "Customer Reviews" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/complaint", label: "File a Complaint" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-amber transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-bold hover:bg-[#1ebe5d] transition-all w-fit"
            >
              <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 font-mono">
          <span>
            © {currentYear} {BUSINESS_NAME} · {ELECTRICIAN_NAME}. All rights reserved.
          </span>
          <span>Licensed Electrician · {SERVICE_AREA}</span>
        </div>
      </div>
    </footer>
  );
}
