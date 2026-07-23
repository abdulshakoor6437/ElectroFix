import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const complaints = await prisma.complaint.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        appointment: {
          include: {
            customer: true,
            service: true,
          },
        },
      },
    });

    return NextResponse.json({ complaints });
  } catch (error) {
    console.error("Admin complaints fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaints" },
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
    const { id, status, adminResponse } = body;

    if (!id) {
      return NextResponse.json({ error: "Complaint ID required" }, { status: 400 });
    }

    const updated = await prisma.complaint.update({
      where: { id: parseInt(id, 10) },
      data: {
        status: status || "resolved",
        adminResponse: adminResponse || null,
      },
    });

    return NextResponse.json({ success: true, complaint: updated });
  } catch (error) {
    console.error("Admin complaint update error:", error);
    return NextResponse.json(
      { error: "Failed to update complaint" },
      { status: 500 }
    );
  }
}
