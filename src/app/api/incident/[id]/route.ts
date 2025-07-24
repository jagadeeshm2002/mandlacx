import { prisma } from "@/db/db";

import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;

    await prisma.incident.update({
      where: {
        id,
      },
      data: {
        resolved: true,
      },
    });
    return NextResponse.json({ message: "Incident resolved successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to resolve incident" });
  }
}
