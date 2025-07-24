
export type Camera = {
  id: string;
  name: string;
  location: string;
  liveStreamUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  incidents: Incident[];
};

export type Incident = {
  id: string;
  cameraId: string;
  type: string;
  threatLevel: number;
  tsStart: Date;
  tsEnd: Date;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolved: boolean;
}