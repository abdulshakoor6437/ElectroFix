import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Admin services fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { serviceName, description, priceInternal, imageUrl, sortOrder } = body;

    if (!serviceName || !description) {
      return NextResponse.json(
        { error: "Service name and description are required" },
        { status: 400 }
      );
    }

    const newService = await prisma.service.create({
      data: {
        serviceName,
        description,
        priceInternal: priceInternal ? parseFloat(priceInternal) : null,
        imageUrl: imageUrl || null,
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
      },
    });

    return NextResponse.json({ success: true, service: newService });
  } catch (error) {
    console.error("Admin service create error:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, serviceName, description, priceInternal, imageUrl, isActive, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ error: "Service ID required" }, { status: 400 });
    }

    const updated = await prisma.service.update({
      where: { id: parseInt(id, 10) },
      data: {
        ...(serviceName && { serviceName }),
        ...(description && { description }),
        priceInternal: priceInternal !== undefined ? (priceInternal ? parseFloat(priceInternal) : null) : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder, 10) : undefined,
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("Admin service update error:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Service ID required" }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Admin service delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
