"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Disc, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Camera } from "@/utils/typs";

export default function VideoFeedSection({ cameras }: { cameras: Camera[] }) {
  const [activeCamera, setActiveCamera] = useState(0);

  const cameraThumbnails = cameras.map((camera, index) => ({
    id: camera.id,
    name: camera.name,
    imageSrc: camera.liveStreamUrl,
    videoSrc: `/videos/camara${index + 1}.mp4`, // Dynamic video source based on camera
    isActive: index === activeCamera,
  }));

  const handleCameraSwitch = (cameraIndex: number) => {
    setActiveCamera(cameraIndex);
  };

  return (
    <div className="relative w-full h-[450px] rounded-md overflow-hidden bg-cover bg-[50%_50%]">
      <div className="relative h-full">
        {/* Gradient overlay at bottom */}
        <div className="absolute w-full h-[116px] bottom-0 left-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)]" />

        {/* Full overlay */}
        <div className="absolute w-full h-full top-0 left-0 bg-[#0000001a]" />

        {/* Main video feed */}
        <video
          src={
            cameraThumbnails[activeCamera]?.videoSrc || "/videos/camara1.mp4"
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

        {/* Scrollable camera thumbnails at bottom right */}
        <div className="absolute bottom-0 right-0 pb-5 pr-5">
          <div
            className="flex items-center gap-[12.8px] overflow-x-auto max-w-[400px] scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent"
            style={{
              scrollbarColor: "#ffffff40 transparent",
              scrollbarWidth: "thin",
            }}
         
          >
            {cameraThumbnails.map((camera, index) => (
              <Card
                key={index}
                className={`w-[120px] rounded-[3.2px] overflow-hidden p-0 bg-transparent border-0 gap-0 flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  camera.isActive
                    ? "ring-2 ring-blue-500 ring-opacity-80"
                    : "hover:ring-1 hover:ring-neutral-500"
                }`}
                onClick={() => handleCameraSwitch(index)}
              >
                <div className="flex w-full items-center justify-between px-1 py-0.5 bg-neutral-950 shadow-sm">
                  <span className="font-inter text-neutral-300 text-xs font-medium tracking-[0] whitespace-nowrap">
                    {camera.name}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-0.5 rounded-full hover:bg-neutral-800"
                        onClick={(e) => e.stopPropagation()} // Prevent camera switch when clicking dropdown
                      >
                        <MoreVertical className="w-3 h-3 stroke-white" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#333333] text-white outline-0 border-0">
                      <DropdownMenuItem
                        className="font-inter font-semibold text-white text-sm tracking-[-0.12px] leading-3.5 hover:bg-[#ffffff0d] pb-2"
                        onClick={() => handleCameraSwitch(index)}
                      >
                        open
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardContent className="p-0">
                  <div className="relative w-36 h-20">
                    <div className="relative w-36 h-20 -top-px -left-px border-[0.8px]">
                      <video
                        src={camera.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ pointerEvents: "none" }}
                        className="w-full h-full object-cover"
                      />
                      {/* Active indicator overlay */}
                      {camera.isActive && (
                        <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
  );
}
