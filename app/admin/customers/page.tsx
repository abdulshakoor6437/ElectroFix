"use client";

import { useState, useEffect } from "react";

interface CustomerItem {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
  totalAppointments: number;
  lastAppointmentDate: string | null;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch("/api/admin/customers");
        const data = await res.json();
        if (data.customers) {
          setCustomers(data.customers);
        }
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy font-display">
          Customers
        </h1>
        <p className="text-gray-500 text-xs mt-1">
          Directory of customers with logged booking history.
        </p>
      </div>

      {/* Plain Table */}
      <div className="bg-white rounded-lg border border-navy overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-navy">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Phone</th>
                  <th className="py-3 px-6">Booking Count</th>
                  <th className="py-3 px-6">Last Booking Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-navy">{c.name}</td>
                    <td className="py-3.5 px-6 font-mono text-gray-700">{c.phone}</td>
                    <td className="py-3.5 px-6 font-mono text-gray-750">{c.totalAppointments}</td>
                    <td className="py-3.5 px-6 font-mono text-gray-600">
                      {c.lastAppointmentDate
                        ? new Date(c.lastAppointmentDate).toLocaleDateString()
                        : "N/A"}
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
