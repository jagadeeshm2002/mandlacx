"use client";
import { CalendarDays, Cctv, Circle, Disc, TimerResetIcon } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import AddCameraAndIncident from "@/components/form/AddCameraAndIncident";
import { prisma } from "@/db/db";
import UseFetchCamaras from "@/lib/hooks/UseFetchCamaras";

type Props = {};

const page = (props: Props) => {
  const { data: cameras, error, loading } = UseFetchCamaras();

  const cameraThumbnails = cameras.map((camera, index) => ({
    id: camera.id,
    name: camera.name,
    imageSrc: camera.liveStreamUrl,
    videoSrc: `/videos/camara${index + 1}.mp4`, // Dynamic video source based on camera
    isActive: index === 0,
  }));

  const [activeCamera, setActiveCamera] = useState(0);

  const handleCameraSwitch = (cameraIndex: number) => {
    setActiveCamera(cameraIndex);
  };

  return (
    <main className="p-5 w-full h-full">
      <div className="w-full h-full flex">
        <div className="relative w-5/7 h-[600px] rounded-md overflow-hidden bg-cover bg-[50%_50%]">
          <div className="relative h-full">
            {/* Gradient overlay at bottom */}
            <div className="absolute w-full h-[116px] bottom-0 left-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)]" />

            {/* Full overlay */}
            <div className="absolute w-full h-full top-0 left-0 bg-[#0000001a]" />

            {/* Main video feed */}
            <video
              src={
                cameraThumbnails[activeCamera]?.videoSrc ||
                "/videos/camara1.mp4"
              }
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
              key={activeCamera} // Force re-render when camera changes
            />

            {/* Camera label at bottom left */}
            <div className="absolute bottom-4 left-2">
              <Badge
                variant="outline"
                className="bg-neutral-950/40 border-neutral-700 shadow-sm flex items-center gap-1 pr-2 py-0.5"
              >
                <Disc className="w-3 h-3 stroke-red-700" />
                <span className="font-text-sm-medium text-neutral-400">
                  {cameraThumbnails[activeCamera]?.name || "Camera - 01"}
                </span>
              </Badge>
            </div>

            {/* Timestamp at top left */}
            <div
              className="absolute top-2 left-2"
              data-semantic-tokens-mode="dark"
              data-utility-colors-mode="dark"
            >
              <Badge
                variant="outline"
                className="bg-stone-900/50 border-1 border-slate-600/50 pl-1.5 pr-2 py-0.5 flex items-center gap-1"
              >
                <CalendarDays className="w-3 h-3 stroke-neutral-400" />
                <span className="mt-[-1.00px] font-text-xs-leading-4-medium text-gray-400">
                  11/7/2025 - 03:12:37
                </span>
              </Badge>
            </div>
          </div>
        </div>

        <div className="relative w-2/7 flex-1 self-stretch grow">
          <div
            className="flex flex-col w-full h-[600px] overflow-y-scroll items-start bg-[#131313] rounded-md border-none py-0"
            style={{ scrollbarColor: "#ffffff40 transparent" }}
          >
            <div className="flex items-center gap-2 p-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative w-[26px] h-[26px] bg-red-900 rounded-[28px] border-2 border-solid border-red-950 flex items-center justify-center">
                <Cctv className="w-4 h-4 text-white" />
              </div>

              <div className="flex flex-col items-start gap-1.5 relative flex-1 grow">
                <h2 className="relative self-stretch font-semibold text-neutral-50 text-lg tracking-[-0.45px] leading-[18px]">
                  Camera List
                </h2>
              </div>
            </div>

            <div className="flex flex-col w-full h-full px-5 gap-5">
              {cameraThumbnails.map((camera, index) => (
                <Card
                  key={index}
                  className={`w-full px-10 min-h-[200px] rounded-[3.2px] overflow-hidden p-0 bg-transparent border-0 gap-0 cursor-pointer transition-all duration-200 ${
                    index === activeCamera
                      ? "ring-2 ring-blue-500 ring-opacity-80"
                      : "hover:ring-1 hover:ring-neutral-500"
                  }`}
                  onClick={() => handleCameraSwitch(index)}
                >
                  <div className="flex w-full items-center justify-between px-1 py-0.5 bg-neutral-950 shadow-sm">
                    <span className="font-inter text-neutral-300 text-xs font-medium tracking-[0] whitespace-nowrap">
                      {camera.name}
                    </span>
                    {/* Active indicator */}
                    {index === activeCamera && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <CardContent className="p-0">
                    <div className="relative w-full">
                      <div className="relative w-full border-[0.8px]">
                        <video
                          src={camera.videoSrc}
                          autoPlay
                          loop
                          muted
                          className="w-full h-full object-cover"
                        />
                        {/* Active indicator overlay */}
                        {index === activeCamera && (
                          <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400/50" />
                        )}
                      </div>

                      {/* Recording indicator */}
                      <div className="absolute top-2 right-2">
                        <Circle className="w-3 h-3 fill-red-700" />
                      </div>

                      {/* Timestamp at top left */}
                      <div
                        className="absolute top-2 left-2"
                        data-semantic-tokens-mode="dark"
                        data-utility-colors-mode="dark"
                      >
                        <Badge
                          variant="outline"
                          className="bg-stone-900/50 border-1 border-slate-600/50 pl-1.5 pr-2 py-0.5 flex items-center gap-1"
                        >
                          <TimerResetIcon className="w-3 h-3 stroke-neutral-300" />
                          <span className="mt-[-1.00px] font-text-xs-leading-4-medium text-gray-300">
                            03:12:37
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AddCameraAndIncident />
    </main>
  );
};

export default page;
