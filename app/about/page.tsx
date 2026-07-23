import Link from "next/link";
import { ArrowRight, MapPin, Clock, Zap, Phone } from "lucide-react";
import { BUSINESS_NAME, ELECTRICIAN_NAME, SERVICE_AREA, WHATSAPP_LINK, PHONE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${ELECTRICIAN_NAME}, the licensed electrician behind ${BUSINESS_NAME}. ${SERVICE_AREA}'s trusted electrical expert with 10+ years of experience.`,
};

const serviceAreaList = [
  "Saddar",
  "Bahria Town",
  "DHA Rawalpindi",
  "Satellite Town",
  "Westridge",
  "Chaklala Scheme",
];

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "500+", label: "Jobs Completed" },
  { value: "4.9★", label: "Average Rating" },
  { value: "24hr", label: "Response Time" },
];

export default function AboutPage() {
  return (
    <>
      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <section className="bg-navy text-white py-16 md:py-20 border-b border-gray-800">
        <div className="container-wide">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber/10 border border-amber/30 rounded-full text-amber text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            About {BUSINESS_NAME}
          </div>
          <h1
            className="text-4xl md:text-5xl font-black text-white mb-4 max-w-2xl font-display"
          >
            {ELECTRICIAN_NAME} — Certified Electrician in Rawalpindi
          </h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Over a decade of reliable, safe, and quality electrical services for homes and businesses.
          </p>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="bg-navy border-b border-gray-800">
        <div className="container-wide py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-3xl font-black text-amber mb-1 font-mono"
                >
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIO SECTION ──────────────────────────────────────── */}
      <section className="section bg-[#F7F5EF]">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Bio box */}
            <div className="bg-white rounded-lg p-8 border border-navy shadow-none">
              <h2 className="text-2xl font-bold text-navy font-display mb-4">
                Hi, I&apos;m {ELECTRICIAN_NAME}
              </h2>
              <p className="text-sm text-gray-500 font-mono mb-4">
                Lead Electrician & Founder
              </p>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                <p>
                  With over 10 years of experience in the electrical trade, I have built {BUSINESS_NAME} on honest advice, high workmanship standards, and reliable timelines. I work directly on every job in Rawalpindi so that you receive professional service.
                </p>
                <p>
                  I specialize in fault finding, distribution board repairs, surge protection installation, and inverter/solar backup systems configuration.
                </p>
              </div>
            </div>

            {/* Service details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-amber" />
                  <h2 className="text-2xl font-black text-navy font-display">
                    Service Areas in Rawalpindi
                  </h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  I cover {SERVICE_AREA}. If you need immediate assistance or are unsure if your location is covered, call or WhatsApp directly.
                </p>
                <ul className="grid grid-cols-2 gap-2 text-sm font-mono text-gray-700">
                  {serviceAreaList.map((area) => (
                    <li key={area} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber rounded-full" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-white rounded-lg border border-navy">
                <div className="flex items-center gap-2 text-sm font-bold text-navy mb-2 font-display">
                  <Clock className="w-4 h-4 text-amber" />
                  Operating Hours
                </div>
                <p className="text-gray-600 text-xs leading-relaxed font-mono">
                  Monday – Saturday: 8:00 AM – 6:00 PM<br />
                  Sunday: Emergency WhatsApp support only
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="section bg-navy text-white border-t border-gray-800" aria-label="Call to action">
        <div className="container-wide text-center">
          <Zap className="w-10 h-10 text-amber mx-auto mb-4 rounded-full" strokeWidth={1.5} />
          <h2 className="text-3xl md:text-4xl font-black !text-white mb-4 font-display">
            Ready to Get Your Electrical Issue Sorted?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Book online in minutes. We&apos;ll review your request and confirm your appointment by phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                Book Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white hover:text-navy">
                <Phone className="w-4 h-4" />
                Call Directly
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
