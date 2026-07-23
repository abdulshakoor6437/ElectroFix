"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  CheckSquare,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface AppointmentItem {
  id: number;
  date: string;
  timeWindow: string;
  address: string;
  notes: string | null;
  status: string;
  createdAt: string;
  customer: { id: number; name: string; phone: string };
  service: { id: number; serviceName: string; priceInternal: number | null };
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const url = statusFilter !== "all" ? `/api/admin/appointments?status=${statusFilter}` : "/api/admin/appointments";
      const res = await fetch(url);
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      fetchAppointments();
    } catch (err) {
      console.error("Status update error", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-display">
            Appointment Management
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Review, approve, reschedule, or complete electrical service bookings.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm text-sm">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-600">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent font-semibold text-gray-900 focus:outline-none text-xs cursor-pointer"
          >
            <option value="all">All Appointments</option>
            <option value="pending">Pending Only</option>
            <option value="approved">Approved Only</option>
            <option value="completed">Completed Only</option>
            <option value="cancelled">Cancelled Only</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg border border-navy shadow-none overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No appointments found matching filter "{statusFilter}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-navy">
                  <th className="py-3 px-6">ID & Date</th>
                  <th className="py-3 px-6">Customer & Phone</th>
                  <th className="py-3 px-6">Service & Internal Price</th>
                  <th className="py-3 px-6">Address & Notes</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* ID & Date */}
                    <td className="py-4 px-6 align-top">
                      <div className="font-mono text-xs font-bold text-navy">#{String(app.id).padStart(4, "0")}</div>
                      <div className="text-xs font-semibold text-gray-900 mt-1">
                        {new Date(app.date).toLocaleDateString()}
                      </div>
                      <div className="text-[11px] text-gray-500 capitalize flex items-center gap-1 mt-0.5 font-mono">
                        <Clock className="w-3 h-3 text-gray-450" /> {app.timeWindow} window
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6 align-top">
                      <div className="font-bold text-gray-900">{app.customer.name}</div>
                      <a
                        href={`tel:${app.customer.phone}`}
                        className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <Phone className="w-3 h-3" /> {app.customer.phone}
                      </a>
                    </td>

                    {/* Service */}
                    <td className="py-4 px-6 align-top">
                      <div className="font-semibold text-gray-900">{app.service.serviceName}</div>
                      <div className="text-xs text-gray-500 font-mono mt-1">
                        Est: {app.service.priceInternal ? `Rs. ${app.service.priceInternal}` : "N/A"}
                      </div>
                    </td>

                    {/* Address & Notes */}
                    <td className="py-4 px-6 align-top max-w-xs">
                      <div className="text-xs text-gray-900 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span>{app.address}</span>
                      </div>
                      {app.notes && (
                        <div className="text-[11px] text-gray-500 italic mt-1.5 bg-gray-50 p-2 rounded-lg border border-gray-200">
                          "{app.notes}"
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 align-top">
                      <Badge variant={app.status as any}>{app.status}</Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 align-top text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        {app.status === "pending" && (
                          <button
                            disabled={updatingId === app.id}
                            onClick={() => updateStatus(app.id, "approved")}
                            className="px-3 py-1.5 bg-navy hover:bg-navy-light text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}

                        {app.status === "approved" && (
                          <button
                            disabled={updatingId === app.id}
                            onClick={() => updateStatus(app.id, "completed")}
                            className="px-3 py-1.5 bg-navy hover:bg-navy-light text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                          >
                            <CheckSquare className="w-3.5 h-3.5" /> Complete
                          </button>
                        )}

                        {app.status !== "cancelled" && app.status !== "completed" && (
                          <button
                            disabled={updatingId === app.id}
                            onClick={() => updateStatus(app.id, "cancelled")}
                            className="px-2.5 py-1 bg-gray-150 border border-navy/20 hover:bg-muted-coral hover:text-white text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                        )}
                      </div>
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
