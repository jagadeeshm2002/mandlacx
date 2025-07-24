import { NextResponse } from "next/server";
import { prisma } from "@/db/db";
import { cameraSchema } from "@/utils/zod";

export async function GET() {
  try {
    const cameras = await prisma.camera.findMany({
      include: {
        incidents: true,
      },
    });
    return NextResponse.json({
      message: "Cameras fetched successfully!",
      success: true,
      cameras,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cameras" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { success, data: parsedBody } = await cameraSchema.safeParseAsync(
      body
    );
    if (!success) {
      return NextResponse.json({ error: "Failed to add camera" });
    }

    await prisma.camera.create({
      data: {
        name: parsedBody.name,
        location: parsedBody.location,
        liveStreamUrl: parsedBody.liveStreamUrl,
      }
    });
    return NextResponse.json({ message: "Camera added successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add camera" });
  }
}
