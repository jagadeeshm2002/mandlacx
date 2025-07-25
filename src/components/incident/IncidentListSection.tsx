"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { env, humanThreats } from "@/utils/constants";
import type { JSX } from "react";
import {
  AlertTriangle,
  CameraIcon,
  ChevronRight,
  Clock,
  CheckCheck as LucideCheckCheck,
  DoorOpen as LucideDoorOpen,
  Plus as LucidePlus,
  Search,
  Shield,
  Store,
  User,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { Camera } from "@/utils/typs";


export type Incident = {
  id: string;
  type: string;
  location: string;
  timestamp: string;
  thumbnailUrl: string | null;
  resolved: boolean;
};

const ThreatCountColorIndicator = ({
  threatCount,
}: {
  threatCount: number;
}): JSX.Element => {
  const threatLevel = useRef(0);

  switch (threatCount % 5) {
    case 0:
      threatLevel.current = 0;
      break;
    case 1:
      threatLevel.current = 1;
      break;
    case 2:
      threatLevel.current = 2;
      break;
    case 3:
      threatLevel.current = 3;
      break;
    case 4:
      threatLevel.current = 4;
      break;
    default:
      threatLevel.current = 0;
  }

  const colors = [
    "bg-green-900",
    "bg-yellow-900",
    "bg-orange-900",
    "bg-red-900",
    "bg-purple-900",
  ];

  return (
    <div
      className={`relative w-[26px] h-[26px] ${
        colors[threatLevel.current]
      } rounded-[28px] border-2 border-solid border-${
        colors[threatLevel.current]
      } flex items-center justify-center`}
    >
      <AlertTriangle className="w-3 h-3 text-white" />
    </div>
  );
};



const IncidentName = ({ incident }: { incident: Incident }): JSX.Element => {
  const threat = humanThreats.find((threat) => threat.id === incident.type) || {
    id: "unknown",
    label: "Unknown",
    icon: <AlertTriangle className="w-3 h-3 text-white" />,
  };
  return (
    <div className="flex items-center gap-1 self-stretch w-full">
      <div className="relative w-4 h-4 flex items-center justify-center">
        {threat.icon}
      </div>

      <div className="font-bold text-white text-xs">{threat.label}</div>
    </div>
  );
};

const IncidentIcon = ({ incident }: { incident: Incident }): JSX.Element => {
  const threat = humanThreats.find((threat) => threat.id === incident.type) || {
    id: "unknown",
    label: "Unknown",
    icon: <AlertTriangle className="w-3 h-3 text-white" />,
    badgeStyle: "bg-stone-950 border-l-3 border-stone-300 text-stone-300",
  };
  return (
    <Badge
      variant="outline"
      className={`p-1 rounded-full ${threat.badgeStyle}`}
    >
      {threat.icon}
    </Badge>
  );
};

export const IncidentListSection = ({ cameras }: { cameras: Camera[] }) => {
  const [fadingIncidents, setFadingIncidents] = useState<Set<string>>(new Set());

  const getIncidentsForCamera = (camera: Camera) => {
    return camera.incidents.map((incident) => ({
      id: incident.id,
      type: incident.type,
      location: `${camera.name} - ${camera.location}`,
      timestamp: incident.tsStart.toLocaleString(),
      thumbnailUrl: incident.thumbnailUrl,
      resolved: incident.resolved,
    }));
  };
  
  const fullIncidentList = cameras.map(getIncidentsForCamera).flat();
  const incidents = fullIncidentList.filter((incident) => !incident.resolved);
  
  const handleResolveIncident = async (incidentId: string): Promise<void> => {
    try {
      // Start fadeout animation
      setFadingIncidents(prev => new Set(prev).add(incidentId));
      
      // Wait for animation to complete before making API call
      setTimeout(async () => {
        const response = await fetch(`/api/incident/${incidentId}`, {
          method: "PUT",
        });
        if (!response.ok) {
          // Remove from fading set if API call fails
          setFadingIncidents(prev => {
            const newSet = new Set(prev);
            newSet.delete(incidentId);
            return newSet;
          });
          throw new Error("Failed to resolve incident");
        }
      }, 300); // Wait for fadeout animation to complete
      
    } catch (error) {
      console.error(error);
      // Remove from fading set on error
      setFadingIncidents(prev => {
        const newSet = new Set(prev);
        newSet.delete(incidentId);
        return newSet;
      });
    }
  };

  return (
    <div className="relative flex-1 self-stretch grow">
      <Card className="flex flex-col w-full h-[450px] items-start bg-[#131313] rounded-md border-none py-0">
        <div className="flex items-center gap-2 p-4 relative self-stretch w-full flex-[0_0_auto]">
          <ThreatCountColorIndicator threatCount={incidents.length} />

          <div className="flex flex-col items-start gap-1.5 relative flex-1 grow">
            <h2 className="relative self-stretch font-semibold text-neutral-50 text-lg tracking-[-0.45px] leading-[18px]">
              {incidents.length} Unresolved Incidents
            </h2>
          </div>
          <GetReslovedIncidents incidents={fullIncidentList} />
        </div>

        <CardContent
          className="flex flex-col items-start pt-0 pb-6 px-3 w-full overflow-y-auto"
          style={{ scrollbarColor: "#ffffff40 transparent" }}
        >
          {incidents.map((incident, index) => (
            <Card
              key={index}
              className={`w-full flex items-center gap-4 mb-4 pl-1 pr-3 py-1 flex-row border-none bg-transparent rounded-md transition-all duration-300 ease-out ${
                fadingIncidents.has(incident.id) 
                  ? 'opacity-0 scale-95 translate-x-4 h-0 mb-0' 
                  : 'opacity-100 scale-100 translate-x-0'
              }`}
            >
              <div className="relative w-[120px] h-[67.2px]">
                <div className="relative w-[122px] h-[69px] -top-px -left-px bg-[#d9d9d9] rounded-md border border-solid border-[#ffffff40]">
                  {incident.thumbnailUrl ? (
                    <img
                      src={`${incident.thumbnailUrl}`}
                      alt="Incident Thumbnail"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="absolute w-[120px] h-[67px] top-0 left-0 bg-gray-700 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-400">Camera Feed</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col h-[67px] items-start justify-between flex-1 grow">
                <IncidentName incident={incident} />

                <div className="flex flex-col items-start gap-[5px] self-stretch w-full">
                  <div className="flex w-[120px] items-center gap-1">
                    <CameraIcon className="w-2.5 h-2.5 text-white" />
                    <div className="font-normal text-white text-[10px] whitespace-nowrap">
                      {incident.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-stretch w-full">
                    <Clock className="w-[9px] h-2.5 text-white" />
                    <div className="font-bold text-white text-[10px] whitespace-nowrap">
                      {incident.timestamp}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                className="inline-flex items-center gap-1 px-3 py-2.5 h-auto"
                onClick={() => handleResolveIncident(incident.id)}
                disabled={fadingIncidents.has(incident.id)}
              >
                <span className="font-bold text-[#ffcc00] text-[10px]">
                  Resolve
                </span>
                <ChevronRight className="w-4 h-4 text-[#ffcc00]" />
              </Button>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentListSection;

const GetReslovedIncidents = ({ incidents }: { incidents: Incident[] }) => {
  const resolvedIncidents = incidents.filter((incident) => incident.resolved);
  return (
    <div className="inline-flex items-center gap-[3px]">
      <div className="inline-flex items-center relative flex-[0_0_auto]">
        {resolvedIncidents
          .filter((incident, index) => index < 3)
          .map((incident, index) => (
            <div
              key={index}
              className="inline-flex items-start relative flex-[0_0_auto] -ml-1"
            >
              <IncidentIcon incident={incident} />
            </div>
          ))}
      </div>

      <Badge
        variant="outline"
        className="pl-1.5 pr-2 py-0.5 bg-neutral-950 rounded-2xl border-neutral-700 shadow-sm flex items-center gap-1"
      >
        <LucideCheckCheck className="w-3 h-3 " color="green" />
        <span className="text-neutral-300 text-xs font-medium">
          {resolvedIncidents.length} resolved incidents
        </span>
      </Badge>
    </div>
  );
};