import React from "react";
import Timeline24H from "../Timeline24H";
import { prisma } from "@/db/db";

export default async function Timeline() {
  const cameras = await prisma.camera.findMany({
    include: {
      incidents: true,
    },
  });

  return (
    <div className="flex flex-col items-start gap-2 relative">
      <div className="flex items-start justify-between relative flex-1 self-stretch w-full grow bg-[#131313] rounded-md overflow-hidden">
    
        <Timeline24H  cameras={cameras} />
      </div>
    </div>
  );
}
