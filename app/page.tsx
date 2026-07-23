import Link from "next/link";
import { ArrowRight, Shield, Clock, Award, Star, Zap, CheckCircle, Phone } from "lucide-react";
import { BUSINESS_NAME, ELECTRICIAN_NAME, SERVICE_AREA, PHONE, WHATSAPP_LINK } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Licensed Electrician in ${SERVICE_AREA}`,
  description: `${BUSINESS_NAME} — trusted, licensed electrician in ${SERVICE_AREA}. Fast fault-finding, DB board upgrades, solar installation & more. Book online today.`,
};

const previewServices = [
  {
    icon: "⚡",
    title: "Electrical Fault Finding",
    desc: "Tripping breakers, dead sockets, flickering lights — we trace and fix faults fast.",
  },
  {
    icon: "🔧",
    title: "DB Board Upgrade",
    desc: "Old fuse boards are a fire hazard. We upgrade to modern, compliant distribution boards.",
  },
  {
    icon: "🌞",
    title: "Solar & Battery Storage",
    desc: "Grid-tied and hybrid solar systems designed and installed for your home or business.",
  },
];

const trustSignals = [
  { icon: Shield, label: "Fully Licensed & Insured" },
  { icon: Award, label: "10+ Years Experience" },
  { icon: Clock, label: "Same-Day Response" },
  { icon: CheckCircle, label: "COC Issuing Electrician" },
];

const previewReviews = [
  {
    name: "Sarah K.",
    rating: 5,
    comment: "Incredibly professional. Sorted our DB board issue in under 2 hours. Highly recommend!",
    service: "DB Board Upgrade",
  },
  {
    name: "Mark T.",
    rating: 5,
    comment: "Came same day for an emergency fault. Fair pricing and no mess left behind.",
    service: "Fault Finding",
  },
  {
    name: "Priya M.",
    rating: 5,
    comment: "Very knowledgeable. Gave us a full inspection report and sorted everything quickly.",
    service: "Certificate of Compliance",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-navy text-white"
        aria-label="Hero section"
      >
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,215,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />

        {/* Yellow accent blob */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber opacity-[0.04] rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-wide relative z-10 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F5B400]/10 border border-[#F5B400]/30 rounded-full text-amber text-xs font-semibold mb-6 animate-fade-in">
              <Zap className="w-3.5 h-3.5" />
              Licensed Electrician · {SERVICE_AREA}
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black !text-white mb-5 leading-[1.1] animate-fade-up font-display"
            >
              Electrical Problems?{" "}
              <span className="text-amber">We Fix Them Fast.</span>
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {ELECTRICIAN_NAME} is a certified electrician serving {SERVICE_AREA}.
              From fault-finding to full solar installs — book online and get a confirmation
              within hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Link href="/book">
                <Button size="lg" variant="primary" className="w-full sm:w-auto group">
                  Book an Appointment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white hover:text-navy">
                  View Services
                </Button>
              </Link>
            </div>

            {/* Quick contact bar */}
            <div className="mt-10 flex flex-wrap gap-5 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 text-gray-300 hover:text-amber transition-colors text-sm">
                <Phone className="w-4 h-4" />
                {PHONE}
              </a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-[#25D366] transition-colors text-sm">
                <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                WhatsApp us now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────── */}
      <section className="bg-amber-soft" aria-label="Trust signals">
        <div className="container-wide py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trustSignals.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-navy shrink-0" strokeWidth={2} />
                <span className="text-navy font-semibold text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ─────────────────────────────────── */}
      <section className="section bg-bg-page" aria-label="Services preview">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-black text-navy mb-3"
            >
              What We Do
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Residential and commercial electrical services done right.
            </p>
          </div>

          <div className="flex flex-col gap-4 max-w-2xl mx-auto mb-10">
            {previewServices.map((service) => (
              <div
                key={service.title}
                className="flex items-center gap-4 p-5 bg-white border border-navy rounded-lg hover:bg-amber-soft/20 transition-all"
              >
                {/* Breaker Switch Motif */}
                <div className="flex flex-col items-center justify-center shrink-0 w-11 h-20 bg-navy border border-gray-800 rounded-md p-1 shadow-inner select-none">
                  <span className="text-[7px] font-mono font-bold text-gray-500 uppercase tracking-wider">ON</span>
                  <div className="w-3 h-10 bg-gray-900 border border-gray-805 rounded relative my-1 shrink-0">
                    <div className="absolute top-0 left-0 right-0 h-5 bg-amber rounded-t border-b border-yellow-600 shadow-md"></div>
                  </div>
                  <span className="text-[7px] font-mono font-bold text-gray-500 uppercase tracking-wider">OFF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-navy font-display mb-1">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
                <Link
                  href="/book"
                  className="text-sm font-bold text-navy hover:text-amber transition-colors shrink-0 flex items-center gap-1"
                >
                  Book
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/services">
              <Button variant="outline" size="lg">
                See All Services
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── REVIEWS PREVIEW ──────────────────────────────────── */}
      <section className="section bg-navy" aria-label="Customer reviews preview">
        <div className="container-wide">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber text-amber" />
              ))}
            </div>
            <h2
              className="text-3xl md:text-4xl font-black !text-white mb-3"
            >
              What Our Customers Say
            </h2>
            <p className="text-gray-400 text-lg">
              Verified reviews from real completed jobs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {previewReviews.map((review) => (
              <div
                key={review.name}
                className="flat-card-dark p-6 bg-navy-light border border-white/10"
              >
                <StarRating rating={review.rating} size="sm" />
                <p className="text-gray-300 text-sm leading-relaxed my-3 italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-sm">{review.name}</span>
                  <span className="text-gray-400 text-xs">{review.service}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/reviews">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-navy">
                Read All Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="section bg-navy text-white border-t border-gray-800" aria-label="Call to action">
        <div className="container-wide text-center">
          <Zap className="w-10 h-10 text-amber mx-auto mb-4 animate-pulse-glow rounded-full" strokeWidth={1.5} />
          <h2
            className="text-3xl md:text-4xl font-black !text-white mb-4 font-display"
          >
            Ready to Get Your Electrical Issue Sorted?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Book online in minutes. We&apos;ll review your request and confirm
            your appointment by phone.
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
