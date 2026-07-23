"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Plus, CheckCircle, AlertCircle, X } from "lucide-react";
import { ELECTRICIAN_NAME, SERVICE_AREA } from "@/lib/constants";

interface ReviewItem {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  customerFirstName: string;
  serviceName: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [avgRating, setAvgRating] = useState<number>(5.0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setTotalCount(data.totalCount);
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalSuccess(false);

    if (!appointmentId || !phone) {
      setModalError("Please enter your Appointment ID and Phone Number.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: parseInt(appointmentId, 10),
          phone: phone.trim(),
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      setModalSuccess(true);
      fetchReviews();
      setTimeout(() => {
        setIsModalOpen(false);
        setAppointmentId("");
        setPhone("");
        setComment("");
        setModalSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setModalError(err.message);
      } else {
        setModalError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 md:py-16">
      <div className="container-wide max-w-5xl mx-auto px-4">
        {/* Page Header */}
        <div className="bg-navy rounded-lg p-8 md:p-12 text-white text-center mb-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold font-display !text-white mb-4">
              Customer Reviews & Feedback
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-6">
              Verified reviews from clients across {SERVICE_AREA} serviced by {ELECTRICIAN_NAME}.
            </p>

            {/* Stats Badge */}
            <div className="inline-flex items-center gap-4 bg-white/10 px-6 py-3 rounded-lg border border-white/20">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-amber text-amber" />
                ))}
              </div>
              <span className="text-2xl font-black text-white">{avgRating}</span>
              <span className="text-xs text-gray-300 uppercase tracking-wider font-semibold">
                ({totalCount} {totalCount === 1 ? "Review" : "Reviews"})
              </span>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-amber text-navy hover:bg-[#d99f00] font-bold rounded-lg text-sm inline-flex items-center gap-2 transition-all active:scale-[0.97]"
              >
                <Plus className="w-4 h-4" /> Leave a Review
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="py-16 text-center text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No reviews yet</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
              Be the first client to leave a review after completing your electrical service with Shakoor!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-lg p-6 border border-navy shadow-none flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-navy text-base font-display">{rev.customerFirstName}</h4>
                      <span className="text-xs text-navy font-semibold bg-amber-soft px-2 py-0.5 rounded-md font-mono">
                        {rev.serviceName}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 bg-amber-soft px-2 py-1 rounded-lg border border-amber/25">
                      <Star className="w-4 h-4 fill-amber text-amber" />
                      <span className="text-xs font-bold text-navy">{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                    "{rev.comment || "Great service, highly recommended!"}"
                  </p>
                </div>

                <div className="text-xs text-gray-400 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span>Verified Customer</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Leave a Review */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-gray-900 mb-1">Leave a Review</h2>
              <p className="text-xs text-gray-500 mb-6">
                Only completed appointments can leave a verified review.
              </p>

              {modalSuccess ? (
                <div className="py-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900">Review Submitted!</h3>
                  <p className="text-xs text-gray-500 mt-1">Thank you for your feedback.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {modalError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{modalError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                      Booking ID *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1"
                      value={appointmentId}
                      onChange={(e) => setAppointmentId(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber focus:border-amber focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="Phone number used during booking"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber focus:border-amber focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                      Rating *
                    </label>
                    <div className="flex gap-2 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-2xl focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= rating
                                ? "fill-amber text-amber"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                      Comments / Feedback
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your experience with Shakoor's work..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber focus:border-amber focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-navy text-white hover:bg-navy-light font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
