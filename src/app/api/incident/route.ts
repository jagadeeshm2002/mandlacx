import { prisma } from "@/db/db";
import { incidentSchema } from "@/utils/zod";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cameraId = searchParams.get("cameraId");
    const incidents = await prisma.incident.findMany({
      where: {
        cameraId: cameraId || undefined,
      },
      include: {
        camera: true,
      },
    });
    return NextResponse.json({
      message: "Incidents fetched successfully!",
      success: true,
      incidents,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch incidents" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { success, data: parsedBody } = await incidentSchema.safeParseAsync(
      body
    );
    if (!success) {
      return NextResponse.json({ error: "Failed to add incident" });
    }

    await prisma.incident.create({
      data: {
        cameraId: parsedBody.cameraId,
        type: parsedBody.type,
        threatLevel: parsedBody.threatLevel,
        tsStart: parsedBody.tsStart,
        tsEnd: parsedBody.tsEnd,
        thumbnailUrl: parsedBody.thumbnailUrl || "/incident/image1.jpg",
      },
    });
    return NextResponse.json({ message: "Incident added successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add incident" });
  }
}

