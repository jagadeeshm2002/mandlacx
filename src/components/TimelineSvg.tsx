import React from 'react'

type Props = { offset: number; isDragging: boolean; timelineRef: React.RefObject<SVGSVGElement |null>; TIMELINE_WIDTH: number; };

const TimelineSvg = ({ offset, isDragging, timelineRef, TIMELINE_WIDTH,  }: Props) => {


      // Generate hour markers
  const generateHourMarkers = () => {
    const markers = [];
    for (let i = 0; i <= 24; i++) {
      const x = (i / 24) * TIMELINE_WIDTH;

      markers.push(
        <g key={`hour-${i}`}>
          <line x1={x} y1={30} x2={x} y2={12} stroke="#888" strokeWidth={2} />
          <text
            x={i == 0 ? x + 15 : i == 24 ? x - 15 : x}
            y={8}
            textAnchor="middle"
            fontSize="10"
            fill="#888"
            fontWeight="700"
          >
            {i.toString().padStart(2, "0")}:00
          </text>
        </g>
      );
    }
    return markers;
  };

  // Generate 5-minute markers with increased spacing
  const generate5MinuteMarkers = () => {
    const markers = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 5; minute < 60; minute += 5) {
        const totalMinutes = hour * 60 + minute;
        const x = (totalMinutes / (24 * 60)) * TIMELINE_WIDTH;

        // Different heights for different intervals
        const is15Minute = minute % 15 === 0;
        const is30Minute = minute % 30 === 0;

        let height, strokeWidth, color;
        if (is30Minute) {
          height = 15;
          strokeWidth = 1.5;
          color = "#777";
        } else if (is15Minute) {
          height = 12;
          strokeWidth = 1.2;
          color = "#666";
        } else {
          height = 8;
          strokeWidth = 1;
          color = "#555";
        }

        markers.push(
          <g key={`5min-${hour}-${minute}`}>
            <line
              x1={x}
              y1={30}
              x2={x}
              y2={30 - height}
              stroke={color}
              strokeWidth={strokeWidth}
            />
            {/* {is30Minute && (
              <text
                x={x}
                y={50}
                textAnchor="middle"
                fontSize="11"
                fill={color}
                fontWeight="600"
              >
                {hour.toString().padStart(2, "0")}:
                {minute.toString().padStart(2, "0")}
              </text>
            )} */}
          </g>
        );
      }
    }
    return markers;
  };
  return (
    <svg
          ref={timelineRef}
          width={TIMELINE_WIDTH}
          height="30"
          style={{
            transform: `translateX(-${offset}px)`,
            transition: isDragging ? "none" : "transform 0.1s ease",
          }}
          className="select-none"
        >
          {/* Background */}
          <rect
            width={TIMELINE_WIDTH}
            height="30"
            fill="#131313"
            className="px-4"
          />

          {/* Hour markers */}
          {generateHourMarkers()}

          {/* 5-minute markers with increased spacing */}
          {generate5MinuteMarkers()}

          {/* Current time indicator
          <g>
            <line
              x1={currentTimeX}
              y1={20}
              x2={currentTimeX}
              y2={0}
              stroke="#ef4444"
              strokeWidth={3}
            />
            <circle cx={currentTimeX} cy={90} r={6} fill="#ef4444" />
            <text
              x={currentTimeX}
              y={15}
              textAnchor="middle"
              fontSize="10"
              fill="#ef4444"
              fontWeight="bold"
              className=""
            >
              NOW
            </text>
          </g> */}
        </svg>
  )
}

export default TimelineSvg;
