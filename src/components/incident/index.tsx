import React from "react";
import { IncidentListSection } from "./IncidentListSection";
import VideoFeedSection from "./VideoFeedSection";
import VideoControls from "../VideoControls";
import { prisma } from "@/db/db";

import { Camera } from "@/utils/typs";

export default async function Section() {
  const cameras = await prisma.camera.findMany({
    include: {
      incidents: true,
    },
  });

  return (
    <main>
      <div className="flex items-start gap-6 w-full h-full">
        <div className="w-[57%]">
          <VideoFeedSection cameras={cameras} />
        </div>
        <div className="w-[41%]">
          <IncidentListSection cameras={cameras} />
        </div>
      </div>

      <VideoControls />
    </main>
  );
}
