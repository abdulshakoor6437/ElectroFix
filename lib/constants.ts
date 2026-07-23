// ─────────────────────────────────────────────────────────────
//  Business constants — sourced from env vars so real values
//  are never committed to source control.
// ─────────────────────────────────────────────────────────────

export const BUSINESS_NAME =
  process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "ElectroFix";

export const ELECTRICIAN_NAME =
  process.env.NEXT_PUBLIC_ELECTRICIAN_NAME ?? "Shakoor";

export const SERVICE_AREA =
  process.env.NEXT_PUBLIC_SERVICE_AREA ?? "Rawalpindi & Surrounding Areas";

export const PHONE = process.env.NEXT_PUBLIC_PHONE ?? "+923175198445";

// ─────────────────────────────────────────────────────────────
//  WhatsApp click-to-chat
// ─────────────────────────────────────────────────────────────
const WA_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+923175198445";

const WA_MESSAGE =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
  "Hi%2C+I%27d+like+to+ask+about+electrical+work+in+Rawalpindi";

export const WHATSAPP_LINK = `https://wa.me/${WA_NUMBER.replace(/\D/g, "")}?text=${WA_MESSAGE}`;

// ─────────────────────────────────────────────────────────────
//  Booking time windows (displayed to customers)
// ─────────────────────────────────────────────────────────────
export const TIME_WINDOWS = [
  {
    value: "morning",
    label: "Morning",
    description: "8:00 AM – 12:00 PM",
    icon: "🌅",
  },
  {
    value: "afternoon",
    label: "Afternoon",
    description: "12:00 PM – 4:00 PM",
    icon: "☀️",
  },
  {
    value: "evening",
    label: "Evening",
    description: "4:00 PM – 6:00 PM",
    icon: "🌇",
  },
] as const;

export type TimeWindowValue = (typeof TIME_WINDOWS)[number]["value"];

// ─────────────────────────────────────────────────────────────
//  Appointment status display helpers
// ─────────────────────────────────────────────────────────────
export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  cancelled: "Cancelled",
  completed: "Completed",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-green-100 text-green-800 border-green-200",
};
