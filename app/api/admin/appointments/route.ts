import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus, TimeWindow } from "@prisma/client";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    const where = statusFilter && statusFilter !== "all"
      ? { status: statusFilter as AppointmentStatus }
      : {};

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        date: true,
        timeWindow: true,
        address: true,
        notes: true,
        status: true,
        createdAt: true,
        customer: {
          select: {
            name: true,
            phone: true,
          },
        },
        service: {
          select: {
            serviceName: true,
            priceInternal: true, // admin-only field, intentionally included
          },
        },
        review: {
          select: {
            id: true,
            rating: true,
          },
        },
        complaint: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Admin appointments fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, date, timeWindow, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Appointment ID required" }, { status: 400 });
    }

    const updateData: {
      status?: AppointmentStatus;
      date?: Date;
      timeWindow?: TimeWindow;
      notes?: string;
    } = {};

    if (status) updateData.status = status as AppointmentStatus;
    if (date) updateData.date = new Date(date);
    if (timeWindow) updateData.timeWindow = timeWindow as TimeWindow;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.appointment.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
      include: {
        customer: true,
        service: true,
      },
    });

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error) {
    console.error("Admin appointment update error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}
