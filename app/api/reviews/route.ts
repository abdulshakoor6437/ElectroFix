import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit, PUBLIC_API_LIMIT, getClientIp } from "@/lib/rateLimit";

const createReviewSchema = z.object({
  appointmentId: z.number().int().positive(),
  phone:         z.string().min(8, "Phone number required").max(20),
  rating:        z.number().int().min(1).max(5),
  comment:       z.string().max(1000).optional(),
});

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        appointment: {
          include: {
            customer: {
              select: { name: true },
            },
            service: {
              select: { serviceName: true },
            },
          },
        },
      },
    });

    const formattedReviews = reviews.map((r) => {
      // First name only for privacy
      const fullName = r.appointment.customer.name || "Customer";
      const firstName = fullName.split(" ")[0];

      return {
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        customerFirstName: firstName,
        serviceName: r.appointment.service.serviceName,
      };
    });

    const totalCount = formattedReviews.length;
    const avgRating =
      totalCount > 0
        ? (
            formattedReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
          ).toFixed(1)
        : "5.0";

    return NextResponse.json({
      reviews: formattedReviews,
      totalCount,
      avgRating: parseFloat(avgRating),
    });
  } catch (error) {
    console.error("Failed to fetch public reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // ── Rate limit ──────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = checkRateLimit("review", ip, PUBLIC_API_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: rl.message },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds ?? 600) } }
    );
  }
  // ───────────────────────────────────────────────────────────────────

  try {
    const body = await request.json();
    const { appointmentId, phone, rating, comment } = createReviewSchema.parse(body);

    const cleanPhone = phone.trim().replace(/[\s-]/g, "");

    // Check appointment exists, is completed, and belongs to phone number
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { customer: true, review: true },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found. Please check your booking ID." },
        { status: 404 }
      );
    }

    if (appointment.customer.phone !== cleanPhone) {
      return NextResponse.json(
        { error: "Phone number does not match this booking record." },
        { status: 403 }
      );
    }

    if (appointment.status !== "completed") {
      return NextResponse.json(
        { error: "Reviews can only be submitted for completed services." },
        { status: 400 }
      );
    }

    if (appointment.review) {
      return NextResponse.json(
        { error: "A review has already been submitted for this appointment." },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        appointmentId,
        rating,
        comment: comment ?? null,
      },
    });

    return NextResponse.json({ success: true, reviewId: review.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to submit review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
