"use client";
import { AvatarImage } from "@radix-ui/react-avatar";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
  TouchEvent,
} from "react";
import TimelineSvg from "./TimelineSvg";
import RenderEventBadge from "./RenderEventBadge";
import { Separator } from "./ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Cctv } from "lucide-react";
import { Camera } from "@/utils/typs";

const Timeline24H = ({ cameras }: { cameras: Camera[] }) => {
  const [offset, setOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [isIndicatorDragging, setIsIndicatorDragging] =
    useState<boolean>(false);
  const [indicatorDragStart, setIndicatorDragStart] = useState<number>(0);

  const timelineRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraListRef = useRef<HTMLDivElement | null>(null);
  const eventsContainerRef = useRef<HTMLDivElement | null>(null);

  const [isScrollSyncing, setIsScrollSyncing] = useState(false);

 
const totalCamera = cameras.map((camera) => {
  return {
    id: camera.id,
    name: camera.name,
    location: camera.location,
    incidents: camera.incidents,
  };
});

const TimeConvert = (time: Date): string => {
  return time.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Fixed eventRows mapping - each camera becomes a row with its events
const eventRows = totalCamera.map((camera) => ({
  id: camera.id,
  events: camera.incidents.map((incident) => ({
    id: incident.id,
    type: incident.type,
    tsStart: TimeConvert(incident.tsStart),
    tsEnd: TimeConvert(incident.tsEnd),
  })),
}));

  // const eventRows = [
  //   {
  //     id: "01",
  //     events: [
  //       {
  //         type: "unauthorised",
  //         tsStart: "00:05",
  //         tsEnd: "00:07",
  //       },
  //       {
  //         type: "face",
  //         tsStart: "01:10",
  //         tsEnd: "01:12",
  //       },
  //       {
  //         type: "multiple",
  //         tsStart: "02:15",
  //         tsEnd: "02:17",
  //       },
  //       {
  //         type: "gun",
  //         tsStart: "03:20",
  //         tsEnd: "03:22",
  //       },
  //       {
  //         type: "unauthorised",
  //         tsStart: "04:25",
  //         tsEnd: "04:27",
  //       },
  //     ],
  //   },
  //   {
  //     id: "02",
  //     events: [
  //       {
  //         type: "unauthorised",
  //         tsStart: "05:30",
  //         tsEnd: "05:32",
  //       },
  //       {
  //         type: "face",
  //         tsStart: "06:35",
  //         tsEnd: "06:37",
  //       },
  //       {
  //         type: "aggressive", // Same time as face event above - will stack
  //         tsStart: "06:35",
  //         tsEnd: "06:37",
  //       },
  //       {
  //         type: "loitering",
  //         tsStart: "07:40",
  //         tsEnd: "07:42",
  //       },
  //     ],
  //   },
  //   {
  //     id: "03",
  //     events: [
  //       {
  //         type: "traffic",
  //         tsStart: "08:00",
  //         tsEnd: "08:02",
  //       },
  //       {
  //         type: "unauthorised",
  //         tsStart: "09:05",
  //         tsEnd: "09:07",
  //       },
  //       {
  //         type: "blacklisted",
  //         tsStart: "10:10",
  //         tsEnd: "10:12",
  //       },
  //       {
  //         type: "intrusion",
  //         tsStart: "11:15",
  //         tsEnd: "11:17",
  //       },
  //     ],
  //   },
  //   {
  //     id: "04",
  //     events: [
  //       {
  //         type: "suspicious",
  //         tsStart: "12:20",
  //         tsEnd: "12:22",
  //       },
  //       {
  //         type: "abandoned",
  //         tsStart: "13:25",
  //         tsEnd: "13:27",
  //       },
  //       {
  //         type: "shoplifting",
  //         tsStart: "14:30",
  //         tsEnd: "14:32",
  //       },
  //       {
  //         type: "shoplifting",
  //         tsStart: "14:30",
  //         tsEnd: "14:32",
  //       },
  //       {
  //         type: "shoplifting",
  //         tsStart: "14:30",
  //         tsEnd: "14:32",
  //       },
  //       {
  //         type: "shoplifting",
  //         tsStart: "14:30",
  //         tsEnd: "14:32",
  //       },
  //     ],
  //   },
  //   {
  //     id: "05",
  //     events: [
  //       {
  //         type: "gun",
  //         tsStart: "15:35",
  //         tsEnd: "15:37",
  //       },
  //       {
  //         type: "face",
  //         tsStart: "16:40",
  //         tsEnd: "16:42",
  //       },
  //       {
  //         type: "unauthorised",
  //         tsStart: "17:45",
  //         tsEnd: "17:47",
  //       },
  //       {
  //         type: "tailgating",
  //         tsStart: "18:50",
  //         tsEnd: "18:52",
  //       },
  //     ],
  //   },
  //   {
  //     id: "06",
  //     events: [
  //       {
  //         type: "mask",
  //         tsStart: "19:55",
  //         tsEnd: "19:57",
  //       },
  //       {
  //         type: "face-not-recognized",
  //         tsStart: "20:00",
  //         tsEnd: "20:02",
  //       },
  //       {
  //         type: "unauthorised",
  //         tsStart: "21:05",
  //         tsEnd: "21:07",
  //       },
  //       {
  //         type: "gun", // Same time as unauthorised event above - will stack
  //         tsStart: "21:05",
  //         tsEnd: "21:07",
  //       },
  //       {
  //         type: "aggressive",
  //         tsStart: "22:10",
  //         tsEnd: "22:12",
  //       },
  //     ],
  //   },
  // ];

  // Function to calculate row position based on index
  const calculateRowPosition = (rowIndex: number): number => {
    const ROW_HEIGHT = 80; // Height of each row in pixels
    return rowIndex * ROW_HEIGHT;
  };

  // Function to get total container height based on number of rows
  const getTotalContainerHeight = (): number => {
    const ROW_HEIGHT = 80;
    return eventRows.length * ROW_HEIGHT;
  };

  // Function to group events by time and limit display
  const processEventsForDisplay = (events: any[]) => {
    // Group events by their time period (tsStart-tsEnd)
    const timeGroups: { [key: string]: any[] } = {};

    events.forEach((event) => {
      const timeKey = `${event.tsStart}-${event.tsEnd}`;
      if (!timeGroups[timeKey]) {
        timeGroups[timeKey] = [];
      }
      timeGroups[timeKey].push(event);
    });

    const processedEvents: any[] = [];

    Object.entries(timeGroups).forEach(([timeKey, groupedEvents]) => {
      if (groupedEvents.length <= 1) {
        processedEvents.push(...groupedEvents);
      } else {
        // Show first 2 events + indicator for remaining
        processedEvents.push(groupedEvents[0]);

        // Add a group indicator for the remaining events
        processedEvents.push({
          ...groupedEvents[0], // Use first event's time
          type: "group-indicator",
          isGroupIndicator: true,
          groupedEvents: groupedEvents,
          totalEventsAtTime: groupedEvents.length,
        });
      }
    });

    return processedEvents;
  };

  useEffect(() => {
    const updateContainerWidth = (): void => {
      // Multiple fallback strategies for getting container width
      let availableWidth = 0;

      if (containerRef.current) {
        // Try getting from the container's parent
        const parent = containerRef.current.parentElement;
        if (parent && parent.clientWidth > 0) {
          availableWidth = parent.clientWidth;
        }
        // Fallback to container itself
        else if (containerRef.current.clientWidth > 0) {
          availableWidth = containerRef.current.clientWidth;
        }
      }

      // Final fallback to window width
      if (availableWidth === 0) {
        availableWidth = window.innerWidth;
      }

      // Account for camera list width (180px) + some padding
      const finalWidth = Math.max(400, availableWidth - 60); // Minimum 400px width

      console.log("Container width update:", {
        availableWidth,
        finalWidth,
        hasContainer: !!containerRef.current,
        hasParent: !!containerRef.current?.parentElement,
        parentWidth: containerRef.current?.parentElement?.clientWidth,
        windowWidth: window.innerWidth,
      });

      setContainerWidth(finalWidth);
    };

    // Initial call with a small delay to ensure DOM is ready
    const initialUpdate = () => {
      setTimeout(updateContainerWidth, 0);
    };

    initialUpdate();

    const resizeObserver = new ResizeObserver(() => {
      updateContainerWidth();
    });

    // Observe multiple elements for better detection
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      if (containerRef.current.parentElement) {
        resizeObserver.observe(containerRef.current.parentElement);
      }
    }

    window.addEventListener("resize", updateContainerWidth);
    window.addEventListener("orientationchange", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
      window.removeEventListener("orientationchange", updateContainerWidth);
      resizeObserver.disconnect();
    };
  }, []);

  // Timeline dimensions
  const TIMELINE_WIDTH = 2400;
  const CONTAINER_WIDTH = containerWidth;
  const hourWidth = TIMELINE_WIDTH / 24;

  const handleCameraListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollSyncing) return;

    const scrollTop = e.currentTarget.scrollTop;

    setIsScrollSyncing(true);

    // Sync vertical scroll with events container
    if (eventsContainerRef.current) {
      eventsContainerRef.current.scrollTop = scrollTop;
    }

    setTimeout(() => setIsScrollSyncing(false), 0);
  };

  const handleEventsContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollSyncing || isDragging) return;

    const scrollTop = e.currentTarget.scrollTop;

    setIsScrollSyncing(true);

    // Sync vertical scroll with camera list
    if (cameraListRef.current) {
      cameraListRef.current.scrollTop = scrollTop;
    }

    setTimeout(() => setIsScrollSyncing(false), 0);
  };

  // Separate function for horizontal scrolling via wheel
  const handleEventsContainerWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Only handle horizontal scrolling when holding Shift or using horizontal wheel
    if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();

      const SCROLL_MULTIPLIER = 1.5;
      const maxTimelineOffset = Math.max(0, TIMELINE_WIDTH - CONTAINER_WIDTH);

      const deltaX = e.deltaX || e.deltaY; // Use deltaY if deltaX is 0
      const newOffset = offset + deltaX * SCROLL_MULTIPLIER;

      setOffset(Math.max(0, Math.min(maxTimelineOffset, newOffset)));
    }
  };

  // Get current time position (0-24 hours)
  const getCurrentTimePosition = (): number => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    return hours + minutes / 60 + seconds / 3600;
  };

  // Handle horizontal drag for timeline
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(e.clientX + offset);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(e.touches[0].clientX + offset);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent): void => {
      if (!isDragging) return;

      const clientX = "clientX" in e ? e.clientX : e.touches[0]?.clientX;
      if (!clientX) return;

      const newOffset = dragStart - clientX;
      const maxOffset = Math.max(0, TIMELINE_WIDTH - CONTAINER_WIDTH);
      setOffset(Math.max(0, Math.min(maxOffset, newOffset)));
    },
    [isDragging, dragStart, TIMELINE_WIDTH, CONTAINER_WIDTH]
  );

  const handleMouseUp = (): void => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent): void => handleMouseMove(e);
    const handleTouchMove = (e: TouchEvent): void => {
      e.preventDefault();
      handleMouseMove(e);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, isDragging]);

  const currentTimePos = getCurrentTimePosition();
  const currentTimeX = (currentTimePos / 24) * TIMELINE_WIDTH;
  const indicatorX = currentTimeX - offset;
  const showIndicator = indicatorX >= 0 && indicatorX <= CONTAINER_WIDTH;

  const handleIndicatorMouseDown = (
    e: React.MouseEvent<HTMLDivElement>
  ): void => {
    e.preventDefault();
    e.stopPropagation(); // Prevent timeline drag
    setIsIndicatorDragging(true);
    setIndicatorDragStart(e.clientX);
  };

  const handleIndicatorTouchStart = (
    e: React.TouchEvent<HTMLDivElement>
  ): void => {
    e.preventDefault();
    e.stopPropagation(); // Prevent timeline drag
    setIsIndicatorDragging(true);
    setIndicatorDragStart(e.touches[0].clientX);
  };

  const handleIndicatorMove = useCallback(
    (e: MouseEvent | TouchEvent): void => {
      if (!isIndicatorDragging) return;

      const clientX = "clientX" in e ? e.clientX : e.touches[0]?.clientX;
      if (!clientX) return;

      const deltaX = clientX - indicatorDragStart;
      const newIndicatorX = indicatorX + deltaX;

      // Calculate the new time position based on the indicator position
      const newTimelineX = newIndicatorX + offset;
      const newTimePosition = (newTimelineX / TIMELINE_WIDTH) * 24;

      // Constrain to 0-24 hours
      const constrainedTimePosition = Math.max(
        0,
        Math.min(24, newTimePosition)
      );

      // Convert back to Date object
      const newDate = new Date();
      const hours = Math.floor(constrainedTimePosition);
      const minutes = Math.floor((constrainedTimePosition - hours) * 60);
      const seconds = Math.floor(
        ((constrainedTimePosition - hours) * 60 - minutes) * 60
      );

      newDate.setHours(hours, minutes, seconds, 0);
      setCurrentTime(newDate);

      // Update drag start position for smooth dragging
      setIndicatorDragStart(clientX);
    },
    [
      isIndicatorDragging,
      indicatorDragStart,
      indicatorX,
      offset,
      TIMELINE_WIDTH,
    ]
  );

  const handleIndicatorMouseUp = (): void => {
    setIsIndicatorDragging(false);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent): void => handleIndicatorMove(e);
    const handleTouchMove = (e: TouchEvent): void => {
      e.preventDefault();
      handleIndicatorMove(e);
    };

    if (isIndicatorDragging) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleIndicatorMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleIndicatorMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleIndicatorMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleIndicatorMouseUp);
    };
  }, [handleIndicatorMove, isIndicatorDragging]);

  if (!containerWidth) {
    return (
      <div className="w-full bg-gray-900 px-4 py-2">
        <div className="w-full h-24 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full h-full bg-[#131313]">
      {/* Fixed Camera List Section */}
      <div className="flex flex-col w-[180px] h-[300px] bg-[#131313] border-r border-gray-700">
        {/* Fixed Camera List Header */}
        <div className="flex-shrink-0" style={{ height: "57px" }}>
          <CardHeader className="flex items-center justify-center gap-2 p-3 w-full bg-[#131313] border-b border-gray-700 h-full">
            <CardTitle className="flex-1 font-inter text-base font-semibold text-white">
              Camera List
            </CardTitle>
          </CardHeader>
        </div>

        {/* Scrollable Camera List */}
        <div
          ref={cameraListRef}
          className="flex-1 overflow-y-auto"
          style={{
            scrollbarColor: "#ffffff40 transparent",
            scrollbarWidth: "thin",
          }}
          onScroll={handleCameraListScroll}
        >
          {totalCamera.map((row, rowIndex) => (
            <div
              key={`camera-${row.id}`}
              className={`flex items-center justify-start gap-3 p-4 w-full border-b border-gray-800 hover:bg-gray-800 cursor-pointer ${
                rowIndex === 0 ? "bg-[#232323]" : "bg-[#131313]"
              }`}
              style={{ height: "80px" }}
            >
              <Cctv className="w-4 h-4 stroke-white" />
              <span className="text-xs font-normal leading-3 text-white font-inter">
                {row.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline and Events Section */}
      <div className="flex-1 flex flex-col relative">
        {/* Fixed Timeline Header */}
        <div
          className="flex-shrink-0 bg-[#131313] border-b border-gray-700"
          style={{ height: "57px" }}
        >
          <div ref={containerRef} className="w-full px-4 py-2">
            <div
              className="relative overflow-hidden"
              style={{
                width: containerWidth > 0 ? `${containerWidth}px` : "100%",
                height: "30px",
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <TimelineSvg
                offset={offset}
                isDragging={isDragging}
                timelineRef={timelineRef}
                TIMELINE_WIDTH={TIMELINE_WIDTH}
              />

              {/* Scroll indicators */}
              {offset > 0 && (
                <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-[#131313] to-transparent pointer-events-none z-10" />
              )}
              {offset < TIMELINE_WIDTH - CONTAINER_WIDTH && (
                <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-[#131313] to-transparent pointer-events-none z-10" />
              )}

              {/* Timeline indicator */}
            </div>
          </div>
        </div>

        {/* Scrollable Events Container */}
        <div
          ref={eventsContainerRef}
          className="h-[200px] overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            overflowX: "hidden",
            overflowY: "auto",
          }}
          onScroll={handleEventsContainerScroll}
          onWheel={handleEventsContainerWheel}
        >
          <div
            className="relative"
            style={{
              height: `${getTotalContainerHeight()}px`,
              width: "100%",
              minWidth: `${containerWidth}px`,
            }}
          >
            {eventRows.map((row, rowIndex) => {
              const rowPosition = calculateRowPosition(rowIndex);
              const processedEvents = processEventsForDisplay(row.events);

              return (
                <div
                  key={`row-${rowIndex}`}
                  className={`absolute w-full left-0 pl-3.5 pointer-events-none border-b border-gray-800 ${
                    rowIndex === 0 ? "bg-[#232323]" : "bg-[#131313]"
                  }`}
                  style={{
                    top: `${rowPosition}px`,
                    height: "80px",
                  }}
                >
                  {processedEvents.map((event, eventIndex) => (
                    <RenderEventBadge
                      key={`event-${eventIndex}`}
                      event={event}
                      eventIndex={eventIndex}
                      offset={offset}
                      containerWidth={CONTAINER_WIDTH}
                      rowEvents={processedEvents}
                      rowPosition={rowPosition}
                      groupedEvents={event.groupedEvents}
                      isGroupIndicator={event.isGroupIndicator}
                      totalEventsAtTime={event.totalEventsAtTime}
                    />
                  ))}
                </div>
              );
            })}

            {/* Timeline indicator line */}
          </div>
        </div>
        {showIndicator && (
          <div
            className="absolute w-10 h-10 cursor-move select-none"
            style={{ left: `${indicatorX}px` }}
            onMouseDown={handleIndicatorMouseDown}
            onTouchStart={handleIndicatorTouchStart}
          >
            <div
              className="absolute inline-flex items-center justify-center px-1 py-px bg-[#ffcc00] rounded-md z-25 hover:bg-[#ffd633] transition-colors"
              style={{
                top: "10px",
              }}
            >
              <div className="relative w-fit text-black text-[8px] font-semibold font-inter">
                {currentTime.toLocaleTimeString("en-US", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </div>

            <Separator
              orientation="vertical"
              className={`absolute w-[2px] bg-[#ffcc00] z-20 transition-colors ${
                isIndicatorDragging ? "bg-[#ffd633]" : "bg-[#ffcc00]"
              }`}
              style={{
                top: "10px",
                left: "20px",
                height: `${getTotalContainerHeight()}px`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline24H;
