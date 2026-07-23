import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Zap, Calendar, Users, Wrench, Star, LogOut, LayoutDashboard } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | ElectroFix",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Hard server-side guard — second wall after proxy.ts
  // If session is missing and we are not on the login page, redirect.
  if (!session && pathname !== "/admin/login") {
    redirect("/admin/login");
  }


  return (
    <div className="min-h-screen bg-bg-page flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-navy text-white sticky top-0 z-40 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/admin/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-navy" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg text-white font-display">
                ElectroFix <span className="text-xs bg-amber/20 text-amber px-2 py-0.5 rounded font-mono ml-1">ADMIN</span>
              </span>
            </Link>

            {/* Navigation links (only if authenticated) */}
            {session && (
              <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
                <Link
                  href="/admin/dashboard"
                  className="px-3.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber" /> Dashboard
                </Link>
                <Link
                  href="/admin/appointments"
                  className="px-3.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-all"
                >
                  <Calendar className="w-4 h-4 text-amber" /> Appointments
                </Link>
                <Link
                  href="/admin/customers"
                  className="px-3.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-all"
                >
                  <Users className="w-4 h-4 text-amber" /> Customers
                </Link>
                <Link
                  href="/admin/services"
                  className="px-3.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-all"
                >
                  <Wrench className="w-4 h-4 text-amber" /> Services
                </Link>
                <Link
                  href="/admin/reviews"
                  className="px-3.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-all"
                >
                  <Star className="w-4 h-4 text-amber" /> Reviews & Complaints
                </Link>
              </nav>
            )}

            {/* User Info & Sign Out */}
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 hidden sm:inline">{session.user?.email}</span>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/admin/login" });
                  }}
                >
                  <button
                    type="submit"
                    className="p-2 text-gray-300 hover:text-red-400 hover:bg-white/10 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/" className="text-xs text-gray-400 hover:text-white">
                Back to Public Site →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
