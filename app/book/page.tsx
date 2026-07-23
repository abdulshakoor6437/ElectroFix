"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Zap,
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Phone,
} from "lucide-react";
import { TIME_WINDOWS, WHATSAPP_LINK, ELECTRICIAN_NAME, SERVICE_AREA } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

interface ServiceItem {
  id: number;
  serviceName: string;
  description: string;
  imageUrl: string | null;
}

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Form state
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedWindow, setSelectedWindow] = useState<string>("morning");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<{
    appointmentId: number;
    customerName: string;
    serviceName: string;
    date: string;
    timeWindow: string;
  } | null>(null);

  // Set default date to tomorrow YYYY-MM-DD
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // Fetch public services
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (data.services && data.services.length > 0) {
          setServices(data.services);
        } else {
          // Fallback list
          setServices([
            {
              id: 1,
              serviceName: "Wiring & Short Circuit Fault Finding",
              description: "Tripping breakers, flickering lights, or burnt socket diagnosis and repair.",
              imageUrl: null,
            },
            {
              id: 2,
              serviceName: "DB Board & Circuit Breaker Repair",
              description: "Distribution box upgrade, main breakers, and surge protection fitting.",
              imageUrl: null,
            },
            {
              id: 3,
              serviceName: "Ceiling Fan, Chandelier & Light Fixtures",
              description: "Professional installation for ceiling fans, SMD lights, and fancy chandeliers.",
              imageUrl: null,
            },
            {
              id: 4,
              serviceName: "Inverter, UPS & Solar Backup Wiring",
              description: "UPS and hybrid inverter connections for power backup.",
              imageUrl: null,
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoadingServices(false);
      }
    }
    loadServices();
  }, []);

  const handleNextStep = () => {
    setErrorMsg("");
    if (step === 1 && !selectedService) {
      setErrorMsg("Please select a service to continue.");
      return;
    }
    if (step === 2) {
      if (!selectedDate) {
        setErrorMsg("Please select an appointment date.");
        return;
      }
      if (!selectedWindow) {
        setErrorMsg("Please select a time window.");
        return;
      }
    }
    if (step === 3) {
      if (!name.trim() || name.trim().length < 2) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (!phone.trim() || phone.trim().length < 8) {
        setErrorMsg("Please enter a valid phone number so Shakoor can call you.");
        return;
      }
      if (!address.trim() || address.trim().length < 5) {
        setErrorMsg("Please enter your complete address in Rawalpindi.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setErrorMsg("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedDate || !selectedWindow || !name || !phone || !address) {
      setErrorMsg("Missing required booking information.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date: selectedDate,
          timeWindow: selectedWindow,
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit booking.");
      }

      setBookingSuccess({
        appointmentId: data.appointmentId,
        customerName: data.customerName,
        serviceName: data.serviceName,
        date: selectedDate,
        timeWindow: selectedWindow,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An error occurred while booking. Please try again or WhatsApp directly.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 md:py-16">
      <div className="container-wide max-w-4xl mx-auto px-4">
        {/* Header */}
        {!bookingSuccess && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber/20 text-navy rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-navy" /> Fast & Direct Guest Booking
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy font-display">
              Book an Electrical Appointment
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Quick 4-step booking with {ELECTRICIAN_NAME} in {SERVICE_AREA}. No login required!
            </p>
          </div>
        )}

        {/* Success Screen */}
        {bookingSuccess ? (
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl text-center border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Booking Received!
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-6 text-sm md:text-base">
              Thank you, <span className="font-semibold text-gray-900">{bookingSuccess.customerName}</span>. Your appointment request has been logged successfully with Reference ID <span className="font-mono font-bold text-navy">#{String(bookingSuccess.appointmentId).padStart(4, "0")}</span>.
            </p>

            {/* Details Card */}
            <div className="bg-[#ffffff] rounded-lg p-5 text-left max-w-md mx-auto mb-8 border border-navy text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Service:</span>
                <span className="font-semibold text-navy">{bookingSuccess.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-semibold text-navy">{bookingSuccess.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time Window:</span>
                <span className="font-semibold text-navy capitalize">{bookingSuccess.timeWindow}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status:</span>
                <Badge variant="pending">Pending Approval</Badge>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              Shakoor will call your phone number directly to confirm timing and travel details.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#25D366] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#1ebe5d] transition-all"
              >
                <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                Message Shakoor on WhatsApp
              </a>
              <button
                onClick={() => {
                  setBookingSuccess(null);
                  setStep(1);
                  setSelectedService(null);
                  setName("");
                  setPhone("");
                  setAddress("");
                  setNotes("");
                }}
                className="px-6 py-3.5 bg-gray-100 text-gray-800 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Step Progress Bar (Breaker Switch Motif) */}
            <div className="bg-navy border-b border-gray-800 px-6 py-6 text-white select-none">
              <div className="grid grid-cols-4 gap-3 max-w-3xl mx-auto">
                {[
                  { num: 1, title: "Select Service" },
                  { num: 2, title: "Date & Time" },
                  { num: 3, title: "Your Details" },
                  { num: 4, title: "Confirm" },
                ].map((s) => {
                  const isCompletedOrActive = step >= s.num;
                  return (
                    <div
                      key={s.num}
                      className={cn(
                        "flex flex-col items-center bg-navy-light border rounded-lg p-2.5 transition-all duration-250",
                        step === s.num ? "border-amber" : "border-gray-800"
                      )}
                    >
                      {/* Breaker Switch Graphic (Vertical) */}
                      <div className="w-3.5 h-10 bg-gray-900 border border-gray-800 rounded relative shrink-0">
                        {isCompletedOrActive ? (
                          // Flipped ON (UP) - Safety Amber
                          <div className="absolute top-0 left-0 right-0 h-5 bg-amber rounded-t border-b border-yellow-600 shadow-sm" />
                        ) : (
                          // Flipped OFF (DOWN) - Incomplete
                          <div className="absolute bottom-0 left-0 right-0 h-5 bg-gray-600 rounded-b border-t border-gray-700" />
                        )}
                      </div>

                      {/* Step details */}
                      <span className="text-[9px] font-mono font-bold text-gray-500 tracking-wider uppercase mt-1.5">
                        Step {s.num}
                      </span>
                      <span
                        className={cn(
                          "hidden sm:inline text-[10px] font-bold tracking-wider font-display uppercase mt-0.5 text-center truncate w-full",
                          step === s.num ? "text-amber" : isCompletedOrActive ? "text-gray-300" : "text-gray-500"
                        )}
                      >
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <span>⚠️ {errorMsg}</span>
              </div>
            )}

            {/* Step Content */}
            <div className="p-6 md:p-10">
              {/* STEP 1: Select Service */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Step 1: Choose Electrical Service
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Select the electrical issue or installation service you need help with.
                  </p>

                  {loadingServices ? (
                    <div className="py-12 text-center text-gray-400">Loading available services...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((svc) => (
                        <div
                          key={svc.id}
                          onClick={() => {
                            setSelectedService(svc);
                            setErrorMsg("");
                          }}
                          className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedService?.id === svc.id
                              ? "border-[#ffd700] bg-[#ffd700]/10 shadow-md scale-[1.01]"
                              : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-900 text-base mb-1">
                              {svc.serviceName}
                            </h3>
                            {selectedService?.id === svc.id && (
                              <CheckCircle2 className="w-5 h-5 text-[#0a1628] shrink-0" />
                            )}
                          </div>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            {svc.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Date & Time Window */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Step 2: Choose Date & Time Window
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Select your preferred day and time block for the electrician visit.
                  </p>

                  <div className="space-y-6">
                    {/* Date Selector */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-[#0a1628]" /> Select Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full md:w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd700] focus:outline-none"
                      />
                    </div>

                    {/* Time Window Selector */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#0a1628]" /> Select Time Window
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {TIME_WINDOWS.map((win) => (
                          <button
                            key={win.value}
                            type="button"
                            onClick={() => setSelectedWindow(win.value)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              selectedWindow === win.value
                                ? "border-[#ffd700] bg-[#ffd700]/10 font-bold"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className="text-2xl mb-1">{win.icon}</div>
                            <div className="text-[#0a1628] font-bold text-sm">{win.label}</div>
                            <div className="text-gray-500 text-xs mt-1">{win.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact Details (No email input) */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Step 3: Contact & Location Details
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Provide your phone and location in Rawalpindi so Shakoor can visit and call you directly.
                  </p>

                  <div className="space-y-4 max-w-xl">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-600 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ali Ahmed"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd700] focus:outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-600 mb-1 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 03001234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd700] focus:outline-none text-sm"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Shakoor will call this number to confirm before heading out.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-600 mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Full Address (Rawalpindi) *
                      </label>
                      <textarea
                        rows={2}
                        placeholder="House / Street / Sector / Area in Rawalpindi"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd700] focus:outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-600 mb-1 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Additional Notes (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Main gate bell doesn't work, call when outside"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffd700] focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Confirm */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Step 4: Review & Confirm Booking
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Please review your booking information before submitting.
                  </p>

                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4 mb-6 text-sm">
                    <div className="border-b border-gray-200 pb-3">
                      <span className="text-xs uppercase text-gray-400 font-semibold">Selected Service</span>
                      <p className="font-bold text-gray-900 text-base">{selectedService?.serviceName}</p>
                      <p className="text-gray-500 text-xs">{selectedService?.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-200 pb-3">
                      <div>
                        <span className="text-xs uppercase text-gray-400 font-semibold">Appointment Date</span>
                        <p className="font-semibold text-gray-900">{selectedDate}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase text-gray-400 font-semibold">Time Window</span>
                        <p className="font-semibold text-gray-900 capitalize">{selectedWindow} window</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs uppercase text-gray-400 font-semibold">Customer Name</span>
                        <p className="font-semibold text-gray-900">{name}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase text-gray-400 font-semibold">Phone</span>
                        <p className="font-semibold text-gray-900">{phone}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-xs uppercase text-gray-400 font-semibold">Address</span>
                        <p className="font-semibold text-gray-900">{address}</p>
                      </div>
                      {notes && (
                        <div className="sm:col-span-2">
                          <span className="text-xs uppercase text-gray-400 font-semibold">Notes</span>
                          <p className="text-gray-700">{notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation controls */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-[#ffd700] text-[#0a1628] hover:bg-[#e6c200] font-bold rounded-xl text-sm flex items-center gap-1 shadow-md transition-all"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitBooking}
                    className="px-8 py-3.5 bg-[#0a1628] text-white hover:bg-black font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Confirm & Book Now"}
                    <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
