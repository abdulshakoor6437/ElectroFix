import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const customers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        appointments: {
          orderBy: { date: "desc" },
          select: {
            id: true,
            date: true,
            status: true,
          },
        },
      },
    });

    const formatted = customers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      createdAt: c.createdAt,
      totalAppointments: c.appointments.length,
      lastAppointmentDate: c.appointments[0]?.date ?? null,
      appointments: c.appointments,
    }));

    return NextResponse.json({ customers: formatted });
  } catch (error) {
    console.error("Admin customers fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
