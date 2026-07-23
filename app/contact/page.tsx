import Link from "next/link";
import { Phone, MapPin, Clock, Zap, ArrowRight } from "lucide-react";
import { BUSINESS_NAME, PHONE, SERVICE_AREA, WHATSAPP_LINK, ELECTRICIAN_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${BUSINESS_NAME} in ${SERVICE_AREA}. Call or WhatsApp directly. ${ELECTRICIAN_NAME} responds promptly.`,
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F7F5EF] pb-16">
      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <section className="bg-navy text-white py-14 border-b border-gray-800">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber/10 border border-amber/30 rounded-full text-amber text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white font-display">
            Contact {BUSINESS_NAME}
          </h1>
          <p className="text-gray-300 text-sm mt-2 max-w-md mx-auto">
            Choose direct phone contact for immediate response, or leave a backup message below.
          </p>
        </div>
      </section>

      {/* ── PROMINENT DIRECT CONTACT (TOP) ─────────────────── */}
      <section className="py-12">
        <div className="container-wide max-w-2xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-navy font-display">Direct Contact Options</h2>
            <p className="text-xs text-gray-500">For fastest dispatch and pricing in Rawalpindi</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WhatsApp CTA (Primary Accent) */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-[#25D366] hover:bg-[#25D366]/5 transition-all text-center group"
            >
              <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center mb-3">
                <img src="/whatsapp.png" alt="WhatsApp" className="w-8 h-8 object-contain" />
              </div>
              <div className="font-bold text-navy text-base group-hover:text-[#25D366] transition-colors">
                WhatsApp Us
              </div>
              <div className="text-xs text-gray-500 mt-1">Fastest Response (Instant Reply)</div>
              <div className="text-xs font-mono font-semibold text-[#25D366] mt-2">{PHONE}</div>
            </a>

            {/* Phone CTA (Secondary Accent) */}
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-navy hover:bg-amber-soft/20 transition-all text-center group"
            >
              <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center mb-3 text-amber">
                <Phone className="w-6 h-6" />
              </div>
              <div className="font-bold text-navy text-base group-hover:text-amber transition-colors">
                Call Directly
              </div>
              <div className="text-xs text-gray-500 mt-1">Direct scheduling with {ELECTRICIAN_NAME}</div>
              <div className="text-xs font-mono font-semibold text-navy mt-2">{PHONE}</div>
            </a>
          </div>

          {/* Hours & Area Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-white border border-navy/20 rounded-lg flex items-start gap-3">
              <MapPin className="w-5 h-5 text-navy shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-navy uppercase">Service Area</div>
                <div className="text-xs text-gray-500 mt-0.5">{SERVICE_AREA}</div>
              </div>
            </div>

            <div className="p-4 bg-white border border-navy/20 rounded-lg flex items-start gap-3">
              <Clock className="w-5 h-5 text-navy shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-navy uppercase">Hours of Operation</div>
                <div className="text-xs text-gray-500 mt-0.5 font-mono">Mon – Sat: 8:00 AM – 6:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BACKUP CONTACT FORM (BOTTOM - SECONDARY) ───────── */}
      <section className="border-t border-gray-200 pt-10">
        <div className="container-wide max-w-xl mx-auto px-4">
          <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-300">
            <div className="mb-6">
              <h2 className="text-base font-bold text-navy font-display">Backup Message Request</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                If unable to call or use WhatsApp, submit your information below and Shakoor will contact you.
              </p>
            </div>

            <form className="space-y-4" aria-label="Backup contact form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  id="contact-name"
                  placeholder="e.g. Ali Ahmed"
                  required
                />
                <Input
                  label="Phone Number *"
                  id="contact-phone"
                  type="tel"
                  placeholder="+923175198445"
                  required
                />
              </div>
              <Input
                label="Subject / Electrical Requirement *"
                id="contact-subject"
                placeholder="e.g. Short Circuit diagnosis or Socket fitting"
                required
              />
              <Textarea
                label="Message & Address *"
                id="contact-message"
                placeholder="Provide details about your request..."
                rows={3}
                required
              />
              <Button type="submit" size="md" variant="outline" className="w-full border-navy text-navy hover:bg-navy hover:text-white">
                Submit Backup Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
