'use client';
import { humanThreats } from "@/utils/constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { AlertTriangle, Plus } from "lucide-react";
import { Badge } from "./ui/badge";
import React from "react";

type Props = {
  event: any;
  eventIndex: number;
  offset: number;
  containerWidth: number;
  rowEvents?: any[]; // Events in the current row for stacking calculation
  rowPosition?: number; // The row's absolute position from top
  groupedEvents?: any[]; // All events that occur at the same time
  isGroupIndicator?: boolean; // Whether this is showing multiple events
  totalEventsAtTime?: number; // Total number of events at this time
};

const RenderEventBadge = ({
  event,
  eventIndex,
  offset,
  containerWidth,
  rowEvents = [],
  rowPosition = 0,
  groupedEvents = [],
  isGroupIndicator = false,
  totalEventsAtTime = 1,
}: Props) => {
  const threat = humanThreats.find((threat) => threat.id === event.type) || {
    id: "unknown",
    label: "Unknown",
    icon: <AlertTriangle className="w-3 h-3 text-white" />,
    badgeStyle: "bg-stone-950 border-l-3 border-stone-300 text-stone-300",
  };

  const startPixel = convertTimeToPixels(event.tsStart);
  const endPixel = convertTimeToPixels(event.tsEnd);
  const width = endPixel - startPixel;

  // Calculate position relative to the offset
  const leftPosition = startPixel - offset;

  // Only render if the badge is visible within the container
  if (leftPosition + width < 0 || leftPosition > 2400) {
    return null;
  }

  // Calculate stack level for overlapping events within the same row
  const stackLevel = calculateStackLevel(event, rowEvents, eventIndex);
  const topOffset = 10 + (stackLevel * 32); // 32px spacing between stacked events for better visibility

  // Create tooltip content for grouped events
  const getTooltipContent = () => {
    if (isGroupIndicator && groupedEvents.length > 0) {
      return (
        <div className="space-y-1">
          <div className="font-semibold text-xs">
            {totalEventsAtTime} events at {event.tsStart} - {event.tsEnd}
          </div>
          {groupedEvents.map((evt, idx) => {
            const evtThreat = humanThreats.find((t) => t.id === evt.type) || { label: "Unknown", icon: <AlertTriangle className="w-3 h-3 text-white" /> };
            return (
              <div key={idx} className="text-xs flex items-center gap-1">
                {evtThreat.icon }
                <span>{evtThreat.label}</span>
              </div>
            );
          })}
        </div>
      );
    }
    
    return (
      <span>
        {event.tsStart} - {event.tsEnd}
      </span>
    );
  };

  // Handle display for group indicator (3+ events)
  if (isGroupIndicator && totalEventsAtTime > 2) {
    return (
      <div
        key={`group-${eventIndex}`}
        className="inline-flex items-start absolute"
        style={{
          width: `${width}px`,
          left: `${leftPosition}px`,
          top: `${topOffset}px`,
          zIndex: 10 + stackLevel,
          transform: "translateY(0)",
        }}
        data-semantic-tokens-mode="dark"
        data-utility-colors-mode="dark"
      >
        <Tooltip>
          <TooltipTrigger>
            <Badge
              className="flex items-center gap-1 pl-1.5 pr-2 py-0.5 rounded bg-gray-700 border-l-3 border-gray-400 text-gray-200 pointer-events-auto shadow-sm"
              variant="outline"
            >
              <Plus className="w-3 h-3" />
              <span className="text-xs font-medium leading-4">
                +{totalEventsAtTime - 2} more
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="text-white bg-accent max-w-48">
            {getTooltipContent()}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div
      key={eventIndex}
      className="inline-flex items-start absolute"
      style={{
        width: `${width}px`,
        left: `${leftPosition}px`,
        top: `${topOffset}px`,
        zIndex: 10 + stackLevel,
        transform: "translateY(0)",
      }}
      data-semantic-tokens-mode="dark"
      data-utility-colors-mode="dark"
    >
      <Tooltip>
        <TooltipTrigger>
          <Badge
            className={`flex items-center gap-1 pl-1.5 pr-2 py-0.5 rounded ${threat.badgeStyle} pointer-events-auto shadow-sm`}
            variant="outline"
          >
            {event.type !== "multiple" && threat.icon}
            <span className="text-xs font-medium leading-4">
              {threat.label}
            </span>
            {event.type === "multiple" && threat.icon}
            {event.time && (
              <span className="text-blue-500 text-xs font-medium leading-4 ml-4">
                {event.time}
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="text-white bg-accent">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default RenderEventBadge;

const convertTimeToPixels = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  // Since 1 hour = 100px (based on TIMELINE_WIDTH = 2400 / 24 hours)
  const pixelsForHours = hours * 100;
  const pixelsForMinutes = (minutes * 100) / 60;
  return pixelsForHours + pixelsForMinutes;
};

// Helper function to check if two events overlap in time (more precise)
const eventsOverlap = (event1: any, event2: any): boolean => {
  const start1 = convertTimeToPixels(event1.tsStart);
  const end1 = convertTimeToPixels(event1.tsEnd);
  const start2 = convertTimeToPixels(event2.tsStart);
  const end2 = convertTimeToPixels(event2.tsEnd);

  // Events overlap if they share any time period
  // Using <= for exact time matches (e.g., same start/end times)
  return !(end1 <= start2 || end2 <= start1);
};

// Calculate which stack level this event should be on within its row
const calculateStackLevel = (currentEvent: any, rowEvents: any[], currentIndex: number): number => {
  if (!rowEvents || rowEvents.length <= 1) return 0;
  
  let stackLevel = 0;
  const occupiedLevels: Set<number> = new Set();
  
  // Check all previous events in the same row for overlaps
  for (let i = 0; i < currentIndex; i++) {
    const previousEvent = rowEvents[i];
    
    if (eventsOverlap(currentEvent, previousEvent)) {
      // Get the stack level of the overlapping previous event
      const previousStackLevel = calculateStackLevel(previousEvent, rowEvents, i);
      occupiedLevels.add(previousStackLevel);
    }
  }
  
  // Find the lowest available stack level
  while (occupiedLevels.has(stackLevel)) {
    stackLevel++;
  }
  
  return stackLevel;
};