"use client";

import { useState, useEffect } from "react";
import { Wrench, Plus, Edit2, ShieldAlert, CheckCircle, X, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface ServiceItem {
  id: number;
  serviceName: string;
  description: string;
  priceInternal: number | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [priceInternal, setPriceInternal] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
      }
    } catch (err) {
      console.error("Failed to fetch admin services", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setServiceName("");
    setDescription("");
    setPriceInternal("");
    setSortOrder("0");
    setIsModalOpen(true);
  };

  const openEditModal = (svc: ServiceItem) => {
    setEditingService(svc);
    setServiceName(svc.serviceName);
    setDescription(svc.description);
    setPriceInternal(svc.priceInternal !== null ? String(svc.priceInternal) : "");
    setSortOrder(String(svc.sortOrder));
    setIsModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !description) return;

    setSubmitting(true);

    try {
      if (editingService) {
        // PUT update
        const res = await fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingService.id,
            serviceName,
            description,
            priceInternal: priceInternal ? parseFloat(priceInternal) : null,
            sortOrder: parseInt(sortOrder, 10) || 0,
          }),
        });
        if (!res.ok) throw new Error("Failed to update service");
      } else {
        // POST create
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceName,
            description,
            priceInternal: priceInternal ? parseFloat(priceInternal) : null,
            sortOrder: parseInt(sortOrder, 10) || 0,
          }),
        });
        if (!res.ok) throw new Error("Failed to create service");
      }

      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error("Service save error", err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActiveStatus = async (svc: ServiceItem) => {
    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: svc.id,
          isActive: !svc.isActive,
        }),
      });
      if (res.ok) fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchServices();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete service.");
      }
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-display">
            Services & Internal Pricing
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Manage public electrical services and confidential internal cost estimates.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-navy hover:bg-navy-light text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4 text-amber" /> Add New Service
        </button>
      </div>

      {/* Warning Box */}
      <div className="p-4 bg-amber-soft border border-amber/25 rounded-lg text-navy text-xs flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber shrink-0" />
        <span>
          <strong>Price Leak Guard Active:</strong> The internal estimated prices configured below are strictly confidential and will never be exposed on public API endpoints.
        </span>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg border border-navy shadow-none overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No services created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-navy">
                  <th className="py-3 px-6">Order & ID</th>
                  <th className="py-3 px-6">Service Name & Description</th>
                  <th className="py-3 px-6">Internal Estimated Price</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 align-top font-mono text-xs font-bold text-navy">
                      #{svc.sortOrder} (ID:{svc.id})
                    </td>

                    <td className="py-4 px-6 align-top max-w-md">
                      <div className="font-bold text-navy text-base font-display">{svc.serviceName}</div>
                      <div className="text-xs text-gray-500 mt-1 leading-relaxed">{svc.description}</div>
                    </td>

                    <td className="py-4 px-6 align-top">
                      <span className="font-mono font-bold text-navy bg-amber-soft px-2.5 py-1 rounded-lg text-xs border border-amber/25">
                        {svc.priceInternal !== null ? `Rs. ${svc.priceInternal}` : "Not Set"}
                      </span>
                    </td>

                    <td className="py-4 px-6 align-top">
                      <button
                        onClick={() => toggleActiveStatus(svc)}
                        className="focus:outline-none"
                      >
                        <Badge variant={svc.isActive ? "approved" : "cancelled"}>
                          {svc.isActive ? "Active" : "Disabled"}
                        </Badge>
                      </button>
                    </td>

                    <td className="py-4 px-6 align-top text-right flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(svc)}
                        className="px-2.5 py-1.5 bg-gray-100 border border-navy/20 hover:bg-navy hover:text-white text-gray-805 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(svc.id)}
                        className="px-2.5 py-1.5 bg-gray-100 border border-muted-coral/20 hover:bg-muted-coral hover:text-white text-muted-coral rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {editingService ? "Edit Service & Price" : "Add Electrical Service"}
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Configure service details and internal estimates for Shakoor.
            </p>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wiring & Short Circuit Fault Finding"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber focus:border-amber focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Service Description *
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the scope of electrical work..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber focus:border-amber focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                    Internal Price (Rs.) - Strictly Confidential (Internal Only)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={priceInternal}
                    onChange={(e) => setPriceInternal(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber focus:border-amber focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400">Strictly confidential, never shown on public site</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber focus:border-amber focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-navy text-white hover:bg-navy-light font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Service Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
