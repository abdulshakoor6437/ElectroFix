"use client";

import { useState } from "react";
import { ShieldAlert, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { ELECTRICIAN_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export default function ComplaintPage() {
  const [step, setStep] = useState(1);
  const [appointmentId, setAppointmentId] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!appointmentId || !phone) {
      setErrorMsg("Please enter both the booking reference ID and registered phone number.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!description || description.trim().length < 10) {
      setErrorMsg("Please provide a detailed description (minimum 10 characters).");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: parseInt(appointmentId, 10),
          phone: phone.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit complaint.");
      }

      setSuccessMsg("Your complaint has been registered. Shakoor will review the record and contact you directly.");
      setAppointmentId("");
      setPhone("");
      setDescription("");
      setStep(1);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F5EF] py-12 md:py-20">
      <div className="container-wide max-w-xl mx-auto px-4">
        <div className="bg-white rounded-lg p-8 border border-navy shadow-none">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 border-b border-gray-150 pb-4">
            <ShieldAlert className="w-5 h-5 text-muted-coral" />
            <div>
              <h1 className="text-xl font-bold text-navy font-display">
                Service Issue Resolution
              </h1>
              <p className="text-gray-500 text-xs mt-0.5">
                Submit details regarding booking issues for investigation and correction.
              </p>
            </div>
          </div>

          {successMsg ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 bg-green-50 border border-muted-green rounded-full flex items-center justify-center mx-auto text-muted-green">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy font-display">Complaint Logged</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">{successMsg}</p>
              <Button
                onClick={() => setSuccessMsg("")}
                size="sm"
                variant="outline"
                className="mt-2 border-navy text-navy font-mono"
              >
                File Another Request
              </Button>
            </div>
          ) : (
            <div>
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-muted-coral/30 rounded-lg text-muted-coral text-xs leading-relaxed">
                  {errorMsg}
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleNextStep} className="space-y-4">
                  <div className="text-xs font-mono font-bold text-navy uppercase tracking-wider mb-2">
                    Step 1 of 2: Look Up Appointment
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Appointment Reference ID *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 0008"
                      value={appointmentId}
                      onChange={(e) => setAppointmentId(e.target.value)}
                      required
                      className="w-full p-3 border border-navy/20 rounded-lg text-xs font-mono focus:ring-1 focus:ring-navy focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Registered Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 03001234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full p-3 border border-navy/20 rounded-lg text-xs font-mono focus:ring-1 focus:ring-navy focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-navy hover:bg-navy-light text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      Find Booking & Continue <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-xs font-mono font-bold text-navy uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Step 2 of 2: Describe Issue</span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-gray-500 hover:text-navy flex items-center gap-1 font-sans text-[11px] font-bold"
                    >
                      <ArrowLeft className="w-3 h-3" /> Edit Lookup
                    </button>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-navy/10 text-xs space-y-1">
                    <div>
                      <span className="text-gray-500">Booking Reference:</span>{" "}
                      <span className="font-mono font-bold text-navy">#{appointmentId.padStart(4, "0")}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone Number:</span>{" "}
                      <span className="font-mono text-navy">{phone}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Describe the problem in detail *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Detail the issue with the booking, installation, pricing, or service delivery..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full p-3 border border-navy/20 rounded-lg text-xs focus:ring-1 focus:ring-navy focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-muted-coral hover:opacity-90 text-white font-bold rounded-lg text-xs transition-opacity disabled:opacity-50"
                    >
                      {submitting ? "Logging complaint..." : `Submit Issue to ${ELECTRICIAN_NAME}`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
