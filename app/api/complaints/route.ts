import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit, PUBLIC_API_LIMIT, getClientIp } from "@/lib/rateLimit";

const complaintSchema = z.object({
  appointmentId: z.number().int().positive(),
  phone:         z.string().min(8, "Phone number required").max(20),
  description:   z.string().min(10, "Please provide detailed complaint description (min 10 chars)").max(2000),
});

export async function POST(request: Request) {
  // ── Rate limit ──────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = checkRateLimit("complaint", ip, PUBLIC_API_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: rl.message },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds ?? 600) } }
    );
  }
  // ─────────────────────────────────────────────────────────────
  try {
    const body = await request.json();
    const { appointmentId, phone, description } = complaintSchema.parse(body);

    const cleanPhone = phone.trim().replace(/[\s-]/g, "");

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { customer: true, complaint: true },
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

    if (appointment.complaint) {
      return NextResponse.json(
        {
          error: "A complaint has already been submitted for this appointment. Status: " + appointment.complaint.status,
          complaintId: appointment.complaint.id,
        },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        appointmentId,
        description,
        status: "open",
      },
    });

    return NextResponse.json({
      success: true,
      complaintId: complaint.id,
      message: "Your complaint has been submitted. Shakoor will review and respond promptly.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to submit complaint:", error);
    return NextResponse.json(
      { error: "Failed to submit complaint" },
      { status: 500 }
    );
  }
}
