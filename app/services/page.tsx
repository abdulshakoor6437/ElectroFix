import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { BUSINESS_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Electrical Services",
  description: `Browse all electrical services offered by ${BUSINESS_NAME}. Fault finding, DB board upgrades, solar installation, geyser wiring, and more. No prices listed — request a free quote.`,
};

const services = [
  {
    id: "fault-finding",
    icon: "⚡",
    title: "Electrical Fault Finding",
    description:
      "Struggling with tripping breakers, flickering lights, or dead sockets? We systematically diagnose and trace electrical faults to keep your home or business safe.",
    includes: [
      "Full visual inspection of distribution board",
      "Circuit testing with professional equipment",
      "Written fault report provided",
      "Repair quote on the spot",
    ],
    badge: "Most Common",
  },
  {
    id: "db-board",
    icon: "🔌",
    title: "DB Board Upgrade & Repair",
    description:
      "Old fuse boards are a fire and safety hazard. We upgrade and repair distribution boards to modern standard-compliant electrical safety specifications.",
    includes: [
      "Full board replacement with circuit breakers",
      "Earth leakage protection installation",
      "Surge protection fitting",
      "Official safety standards compliance",
    ],
    badge: null,
  },
  {
    id: "plug-points",
    icon: "🔧",
    title: "New Plug & Light Points",
    description:
      "Need extra sockets or light fittings? We install additional power points and lighting circuits with clean conduit work.",
    includes: [
      "Single or double socket installation",
      "LED downlight & batten fitting",
      "Outdoor waterproof points",
      "Safe SANS-style wiring throughout",
    ],
    badge: null,
  },
  {
    id: "geyser",
    icon: "🚿",
    title: "Geyser Wiring & Replacement",
    description:
      "Full electrical side of geyser installations and replacements — wiring, isolator switches, and timer fitting.",
    includes: [
      "Geyser element & thermostat check",
      "Isolator switch installation",
      "Timer & controller fitting",
      "Compliance sign-off",
    ],
    badge: null,
  },
  {
    id: "solar",
    icon: "🌞",
    title: "Solar & Battery Storage",
    description:
      "Design and installation of grid-tied and hybrid PV systems with battery backup. We also commission and fault-find on existing solar systems.",
    includes: [
      "System design & sizing consultation",
      "Panel mounting & inverter installation",
      "Battery storage integration",
      "Grid tie-in & compliance checkout",
    ],
    badge: "Popular",
  },
  {
    id: "coc",
    icon: "📋",
    title: "Certificate of Compliance (COC)",
    description:
      "Selling your property? COCs are required by law for all property transfers. We conduct a thorough inspection and issue the certificate.",
    includes: [
      "Full electrical installation inspection",
      "Written inspection report",
      "Remedial work if needed (quoted separately)",
      "Official COC issued within 24 hours of clearance",
    ],
    badge: null,
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <section className="bg-navy text-white py-16 md:py-20">
        <div className="container-wide">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F5B400]/10 border border-[#F5B400]/30 rounded-full text-amber text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            Our Services
          </div>
          <h1
            className="text-4xl md:text-5xl font-black !text-white mb-4 max-w-2xl font-display"
          >
            Electrical Services for <span className="text-amber">Every Job</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mb-6">
            From a single socket to a full solar system. All work is compliant with local regulations, and we quote before we start.
          </p>
          <p className="text-sm text-gray-350 bg-white/5 border border-white/10 rounded-xl px-4 py-3 inline-block">
            💡 Pricing varies by job complexity. Contact us or book an inspection
            and we&apos;ll provide a written quote at no obligation.
          </p>
        </div>
      </section>

      {/* ── SERVICE CARDS (STYLIZED SWITCHBOARD) ───────────────── */}
      <section className="section bg-bg-page">
        <div className="container-wide max-w-4xl">
          <div className="flex flex-col gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                id={service.id}
                className="bg-white border border-navy rounded-lg p-6 flex flex-col md:flex-row gap-6 relative"
              >
                {service.badge && (
                  <span className="absolute top-4 right-4 bg-amber-soft text-navy border border-amber/30 text-xs font-bold px-2.5 py-1 rounded-full font-mono">
                    {service.badge.toUpperCase()}
                  </span>
                )}

                {/* Breaker Switch Graphic */}
                <div className="flex md:flex-col items-center justify-center shrink-0 w-full md:w-16 h-12 md:h-24 bg-navy border border-gray-800 rounded-md p-1 shadow-inner select-none">
                  <span className="hidden md:inline text-[8px] font-mono font-bold text-gray-500 uppercase tracking-widest">ON</span>
                  <div className="w-8 md:w-3.5 h-3.5 md:h-12 bg-gray-900 border border-gray-800 rounded relative mx-2 md:mx-0 my-0 md:my-1.5 shrink-0 flex md:block items-center">
                    {/* Flipped ON (UP) in Safety Amber */}
                    <div className="absolute top-0 bottom-0 md:bottom-auto left-0 md:left-auto right-auto md:right-0 w-4 md:w-full h-full md:h-6 bg-amber rounded-l md:rounded-t border-r md:border-r-0 md:border-b border-yellow-600 shadow-md"></div>
                  </div>
                  <span className="hidden md:inline text-[8px] font-mono font-bold text-gray-500 uppercase tracking-widest">OFF</span>
                </div>

                {/* Service Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{service.icon}</span>
                    <h2
                      className="text-xl font-bold text-navy font-display"
                    >
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-gray-650 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                      What&apos;s Included:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-4">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-gray-700">
                          <span className="text-muted-green font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs text-gray-400 max-w-sm">
                      * No upfront prices listed — exact quotes are provided based on your specific job needs.
                    </p>
                    <Link href={`/book?service=${service.id}`} className="shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        className="group flex items-center gap-1.5 font-bold"
                      >
                        Request a Quote
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="section bg-navy text-white">
        <div className="container-wide text-center">
          <h2
            className="text-3xl font-black !text-white mb-4 font-display"
          >
            Don&apos;t See Your Job Listed?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            We handle most residential and light-commercial electrical work.
            Describe your job and we&apos;ll let you know if we can help.
          </p>
          <Link href="/book">
            <Button size="lg" variant="primary">
              Book an Inspection
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
