"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";

/**
 * Fixed floating WhatsApp button — visible site-wide, bottom-right corner.
 * Uses a gentle bounce animation to draw attention without being intrusive.
 * Opens wa.me in a new tab with a pre-filled message.
 */
export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-float-btn"
      aria-label="Chat with us on WhatsApp"
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14
        bg-[#25D366] hover:bg-[#1ebe5d]
        text-white
        rounded-full
        flex items-center justify-center
        hover:scale-110
        active:scale-95
        transition-all duration-200
      "
    >
      <img src="/whatsapp.png" alt="WhatsApp" className="w-8 h-8 object-contain relative z-10" />

      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping"
        style={{ animationDuration: "2.5s" }}
        aria-hidden="true"
      />
    </a>
  );
}
