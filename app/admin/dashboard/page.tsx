"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Wrench,
  Star,
  ChevronRight,
  TrendingUp,
  Phone,
} from "lucide-react";
import { ELECTRICIAN_NAME, SERVICE_AREA } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

interface AppointmentItem {
  id: number;
  date: string;
  timeWindow: string;
  address: string;
  status: string;
  customer: { name: string; phone: string };
  service: { serviceName: string; priceInternal: number | null };
}

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [avgRating, setAvgRating] = useState(5.0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const [appRes, custRes, revRes] = await Promise.all([
          fetch("/api/admin/appointments"),
          fetch("/api/admin/customers"),
          fetch("/api/reviews"),
        ]);

        const appData = await appRes.json();
        const custData = await custRes.json();
        const revData = await revRes.json();

        if (appData.appointments) {
          setAppointments(appData.appointments);

          setPendingCount(
            appData.appointments.filter((a: AppointmentItem) => a.status === "pending").length
          );
          setApprovedCount(
            appData.appointments.filter((a: AppointmentItem) => a.status === "approved").length
          );
        }

        if (custData.customers) {
          setTotalCustomers(custData.customers.length);
        }

        if (revData.reviews && revData.reviews.length > 0) {
          const sum = revData.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
          setAvgRating(parseFloat((sum / revData.reviews.length).toFixed(1)));
        }
      } catch (err) {
        console.error("Dashboard data load error", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-display">
          Welcome back, {ELECTRICIAN_NAME} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of appointments, customer requests, and service activity in {SERVICE_AREA}.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pending Card */}
        <div className="bg-white rounded-lg p-6 border border-navy flex items-center justify-between shadow-none">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
              Pending Requests
            </span>
            <div className="text-3xl font-black text-amber mt-1 font-mono">{pendingCount}</div>
            <span className="text-xs text-gray-400">Needs review</span>
          </div>
          <div className="w-12 h-12 bg-amber-soft rounded-lg flex items-center justify-center text-amber border border-amber/35">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Approved / Upcoming */}
        <div className="bg-white rounded-lg p-6 border border-navy flex items-center justify-between shadow-none">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
              Approved Jobs
            </span>
            <div className="text-3xl font-black text-muted-green mt-1 font-mono">{approvedCount}</div>
            <span className="text-xs text-gray-400">Scheduled visits</span>
          </div>
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-muted-green border border-muted-green/35">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-lg p-6 border border-navy flex items-center justify-between shadow-none">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
              Average Rating
            </span>
            <div className="text-3xl font-black text-navy mt-1 font-mono">{avgRating} / 5.0</div>
            <span className="text-xs text-gray-400">From feedback reviews</span>
          </div>
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-amber border border-navy/35">
            <Star className="w-6 h-6 fill-amber text-amber" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-lg p-6 border border-navy flex items-center justify-between shadow-none">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
              Total Clients
            </span>
            <div className="text-3xl font-black text-navy mt-1 font-mono">{totalCustomers}</div>
            <span className="text-xs text-gray-400">Registered phone clients</span>
          </div>
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-navy border border-navy/35">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/appointments"
          className="p-5 bg-navy text-white rounded-lg flex items-center justify-between hover:bg-navy-light transition-all group"
        >
          <div>
            <div className="font-bold text-base font-display">Manage Appointments</div>
            <div className="text-xs text-gray-300 mt-0.5">Approve, cancel, or reschedule</div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/services"
          className="p-5 bg-white border border-navy text-gray-900 rounded-lg flex items-center justify-between hover:bg-amber-soft/20 transition-all group"
        >
          <div>
            <div className="font-bold text-base font-display">Services & Pricing</div>
            <div className="text-xs text-gray-500 mt-0.5">Manage list & internal estimates</div>
          </div>
          <ChevronRight className="w-5 h-5 text-navy group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/reviews"
          className="p-5 bg-white border border-navy text-gray-900 rounded-lg flex items-center justify-between hover:bg-amber-soft/20 transition-all group"
        >
          <div>
            <div className="font-bold text-base font-display">Reviews & Complaints</div>
            <div className="text-xs text-gray-500 mt-0.5">View ratings and respond to feedback</div>
          </div>
          <ChevronRight className="w-5 h-5 text-navy group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-lg border border-navy shadow-none overflow-hidden">
        <div className="p-6 border-b border-navy flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-navy font-display">Recent Booking Requests</h2>
            <p className="text-xs text-gray-500">Latest guest appointment submissions</p>
          </div>
          <Link
            href="/admin/appointments"
            className="text-xs font-bold text-navy hover:underline flex items-center gap-1"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No appointment requests logged yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-navy">
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Service</th>
                  <th className="py-3 px-6">Date & Time</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Estimated Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {appointments.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-navy font-bold">#{String(app.id).padStart(4, "0")}</td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-navy">{app.customer.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {app.customer.phone}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {app.service.serviceName}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-navy font-medium">
                        {new Date(app.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{app.timeWindow} window</div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={app.status as any}>{app.status}</Badge>
                    </td>
                    <td className="py-4 px-6 font-mono font-semibold text-navy">
                      {app.service.priceInternal ? `Rs. ${app.service.priceInternal}` : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
