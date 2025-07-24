import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CirclePlay,
  Play,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import React from "react";

type Props = {};

const VideoControls = (props: Props) => {
  return (
    <Card className="w-full bg-[#131313] rounded-md my-3 px-2 py-1 border-gray-900/50">
      <CardContent className="flex items-center justify-between p-1">
        <div className="inline-flex items-center gap-4">
          <Button variant="ghost" size="icon" className="p-0.5 rounded-md">
            <SkipBack className="w-4 h-4 " stroke="white" />
          </Button>
          <Button variant="ghost" size="icon" className="p-0.5 rounded-md">
            <RotateCcw className="w-4 h-4" stroke="white" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="p-0.5 rounded-full bg-accent-foreground"
          >
            <Play className="w-4 h-4 stroke-0 fill-black" />
          </Button>

          <Button variant="ghost" size="icon" className="p-0.5 rounded-md">
            <RotateCw className="w-4 h-4" stroke="white" />
          </Button>

          <Button variant="ghost" size="icon" className="p-0.5 rounded-md">
            <SkipForward className="w-4 h-4" stroke="white" />
          </Button>

          <div className="text-white text-xs font-normal font-['Plus_Jakarta_Sans-Regular',Helvetica]">
            03:12:37 (15-Jun-2025)
          </div>
          <Button variant="ghost" size="icon" className="p-0.5 rounded-md">
            <div className="text-white text-xs text-center">1x</div>
          </Button>
          <Button variant="ghost" size="icon" className="p-0.5 rounded-md">
            <CirclePlay className="w-4 h-4 " stroke="white" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoControls;
