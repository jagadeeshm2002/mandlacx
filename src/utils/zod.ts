import { z } from "zod";

export const cameraSchema = z.object({
  name: z
    .string()
    .min(1, "Camera name is required")
    .max(100, "Name must be less than 100 characters"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be less than 200 characters"),
  liveStreamUrl: z.string().min(1, "Live stream URL is required"),
});

export const incidentSchema = z.object({
  cameraId: z.string().min(1, "Please select a camera"),
  type: z.string().min(1, "Incident type is required"),
  threatLevel: z
    .number()
    .min(1, "Threat level must be between 1-5")
    .max(5, "Threat level must be between 1-5"),
  tsStart: z.string().min(1, "Start time is required"),
  tsEnd: z.string().min(1, "End time is required"),
  thumbnailUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export type IncidentFormValues = z.infer<typeof incidentSchema>;
export type CameraFormValues = z.infer<typeof cameraSchema>;
