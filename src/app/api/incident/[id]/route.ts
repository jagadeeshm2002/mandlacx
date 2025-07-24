import { prisma } from "@/db/db";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params promise
    const resolvedParams = await params;
    const id = resolvedParams.id; 

    const updatedIncident = await prisma.incident.update({
      where: {
        id,
      },
      data: {
        resolved: true,
      },
    });

    if (!updatedIncident) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Incident resolved successfully!", incident: updatedIncident },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resolving incident:", error);
    return NextResponse.json(
      { error: "Failed to resolve incident" },
      { status: 500 }
    );
  }
}