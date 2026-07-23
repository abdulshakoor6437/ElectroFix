import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { TimeWindow } from "@prisma/client";
import { checkRateLimit, PUBLIC_API_LIMIT, getClientIp } from "@/lib/rateLimit";

const bookingSchema = z.object({
  serviceId:  z.number().int().positive(),
  date:       z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  timeWindow: z.enum(["morning", "afternoon", "evening"]),
  name:       z.string().min(2).max(100),
  phone:      z.string().min(8).max(20),
  address:    z.string().min(5).max(300),
  notes:      z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  // ── Rate limit ─────────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = checkRateLimit("booking", ip, PUBLIC_API_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: rl.message },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds ?? 600) },
      }
    );
  }
  // ───────────────────────────────────────────────────────────────────────

  try {
    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    const cleanPhone = validatedData.phone.trim().replace(/[\s-]/g, "");

    const customer = await prisma.user.upsert({
      where:  { phone: cleanPhone },
      update: { name: validatedData.name },
      create: { name: validatedData.name, phone: cleanPhone },
    });

    const appointment = await prisma.appointment.create({
      data: {
        customerId: customer.id,
        serviceId:  validatedData.serviceId,
        date:       new Date(validatedData.date),
        timeWindow: validatedData.timeWindow as TimeWindow,
        address:    validatedData.address,
        notes:      validatedData.notes ?? null,
        status:     "pending",
      },
      include: { service: true },
    });

    return NextResponse.json({
      success:       true,
      appointmentId: appointment.id,
      customerName:  customer.name,
      serviceName:   appointment.service.serviceName,
      date:          appointment.date,
      timeWindow:    appointment.timeWindow,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again or contact via WhatsApp." },
      { status: 500 }
    );
  }
}
