import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { HideOnAdmin } from "@/components/layout/HideOnAdmin";

// ── Self-hosted, optimised fonts via next/font ─────────────────
// Each font generates a CSS variable that maps 1-to-1 with the
// --font-* tokens already declared in globals.css @theme, so all
// Tailwind utilities (font-sans, font-display, font-mono) keep
// working without any changes to the theme.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
  preload: false, // monospace is not render-critical
});

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "ElectroFix";
const serviceArea =
  process.env.NEXT_PUBLIC_SERVICE_AREA ?? "Cape Town & Surrounding Areas";

export const metadata: Metadata = {
  title: {
    default: `${businessName} — Licensed Electrician in ${serviceArea}`,
    template: `%s | ${businessName}`,
  },
  description: `${businessName} is a trusted, licensed electrician serving ${serviceArea}. Book an appointment online for fault finding, DB board upgrades, solar installation, and more.`,
  keywords: [
    "electrician",
    serviceArea,
    "electrical services",
    "book electrician",
    "DB board",
    "solar installation",
    "certificate of compliance",
  ],
  openGraph: {
    type: "website",
    siteName: businessName,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <HideOnAdmin>
          <Navbar />
        </HideOnAdmin>
        <main className="flex-1">{children}</main>
        <HideOnAdmin>
          <Footer />
          <WhatsAppButton />
        </HideOnAdmin>
      </body>
    </html>
  );
}
