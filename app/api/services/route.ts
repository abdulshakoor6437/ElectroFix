import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        serviceName: true,
        description: true,
        imageUrl: true,
        sortOrder: true,
        // CRITICAL: priceInternal is INTENTIONALLY omitted to satisfy price leak guard
      },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Failed to fetch public services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
