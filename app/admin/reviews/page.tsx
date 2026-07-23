"use client";

import { useState, useEffect } from "react";
import { Star, AlertTriangle, CheckCircle, MessageSquare, Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface ReviewItem {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  appointment: {
    id: number;
    customer: { name: string; phone: string };
    service: { serviceName: string };
  };
}

interface ComplaintItem {
  id: number;
  description: string;
  status: string;
  adminResponse: string | null;
  createdAt: string;
  appointment: {
    id: number;
    customer: { name: string; phone: string };
    service: { serviceName: string };
  };
}

export default function AdminReviewsComplaintsPage() {
  const [activeTab, setActiveTab] = useState<"reviews" | "complaints">("reviews");

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Complaint resolution modal
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [resolving, setResolving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [revRes, compRes] = await Promise.all([
        fetch("/api/admin/reviews"),
        fetch("/api/admin/complaints"),
      ]);

      const revData = await revRes.json();
      const compData = await compRes.json();

      if (revData.reviews) setReviews(revData.reviews);
      if (compData.complaints) setComplaints(compData.complaints);
    } catch (err) {
      console.error("Failed to load reviews/complaints data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolveComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setResolving(true);

    try {
      const res = await fetch("/api/admin/complaints", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedComplaint.id,
          status: "resolved",
          adminResponse: adminResponse.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to resolve complaint");

      setSelectedComplaint(null);
      setAdminResponse("");
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-display">
            Reviews & Service Complaints
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Monitor client feedback and resolve customer dissatisfaction promptly.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "reviews"
                ? "bg-white text-[#0a1628] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab("complaints")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "complaints"
                ? "bg-white text-[#0a1628] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Complaints ({complaints.filter((c) => c.status === "open").length} Open)
          </button>
        </div>
      </div>

      {/* Content View */}
      {activeTab === "reviews" ? (
        <div className="bg-white rounded-lg border border-navy shadow-none overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No customer reviews submitted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-navy">
                    <th className="py-3 px-6">Customer</th>
                    <th className="py-3 px-6">Service & Appt ID</th>
                    <th className="py-3 px-6">Rating</th>
                    <th className="py-3 px-6">Customer Comment</th>
                    <th className="py-3 px-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {reviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6 align-top font-bold text-gray-900">
                        {rev.appointment.customer.name}
                        <div className="text-xs font-normal text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {rev.appointment.customer.phone}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="font-semibold text-gray-900">
                          {rev.appointment.service.serviceName}
                        </div>
                        <div className="text-xs font-mono text-gray-400">Appt #{String(rev.appointment.id).padStart(4, "0")}</div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200 w-fit">
                          <Star className="w-4 h-4 fill-[#ffd700] text-[#ffd700]" />
                          <span className="text-xs font-bold text-yellow-800">{rev.rating}.0</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top italic text-gray-700 max-w-sm">
                        "{rev.comment || "No written comment provided."}"
                      </td>
                      <td className="py-4 px-6 align-top text-xs text-gray-500">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-navy shadow-none overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm">Loading complaints...</div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No complaints logged.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-navy">
                    <th className="py-3 px-6">ID & Date</th>
                    <th className="py-3 px-6">Customer</th>
                    <th className="py-3 px-6">Complaint Details</th>
                    <th className="py-3 px-6">Status & Response</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {complaints.map((comp) => (
                    <tr key={comp.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6 align-top font-mono text-xs text-navy font-bold">
                        #{String(comp.id).padStart(4, "0")}
                        <div className="text-gray-400 font-semibold mt-1 font-sans">
                          {new Date(comp.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top font-bold text-gray-900">
                        {comp.appointment.customer.name}
                        <div className="text-xs font-normal text-blue-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {comp.appointment.customer.phone}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top max-w-sm">
                        <div className="text-xs font-semibold text-gray-900 mb-1">
                          {comp.appointment.service.serviceName} (Appt #{String(comp.appointment.id).padStart(4, "0")})
                        </div>
                        <div className="text-xs text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-100">
                          {comp.description}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="mb-2">
                          <Badge variant={comp.status === "open" ? "open" : "resolved"}>{comp.status}</Badge>
                        </div>
                        {comp.adminResponse && (
                          <div className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <strong>Shakoor's Note:</strong> {comp.adminResponse}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 align-top text-right">
                        {comp.status === "open" && (
                          <button
                            onClick={() => {
                              setSelectedComplaint(comp);
                              setAdminResponse("");
                            }}
                            className="px-3 py-1.5 bg-[#0a1628] hover:bg-black text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all"
                          >
                            Resolve & Respond
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Resolve Complaint Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Resolve Complaint #{selectedComplaint.id}</h2>
            <p className="text-xs text-gray-500 mb-4">
              Client: {selectedComplaint.appointment.customer.name} ({selectedComplaint.appointment.customer.phone})
            </p>

            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800 mb-4">
              "{selectedComplaint.description}"
            </div>

            <form onSubmit={handleResolveComplaint} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Resolution / Admin Response Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Record action taken (e.g., Revisited site and replaced breaker free of charge)..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="w-1/2 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolving}
                  className="w-1/2 py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50"
                >
                  {resolving ? "Resolving..." : "Mark as Resolved"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
