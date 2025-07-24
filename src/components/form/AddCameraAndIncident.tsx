"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Shield, Plus, CheckCircle, AlertTriangle } from "lucide-react";

import { cameraSchema, incidentSchema } from "@/utils/zod";

import { CameraFormValues, IncidentFormValues } from "@/utils/zod";
import { humanThreats } from "@/utils/constants";
import UseFetchCamaras from "@/lib/hooks/UseFetchCamaras";

const videoList = [
  { label: "video1", url: "/videos/camara1.mp4" },
  { label: "video2", url: "/videos/camara2.mp4" },
  { label: "video3", url: "/videos/camara3.mp4" },
];

const AddCameraAndIncident = () => {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const cameraForm = useForm<CameraFormValues>({
    resolver: zodResolver(cameraSchema),
    defaultValues: {
      name: "",
      location: "",
      liveStreamUrl: videoList[0].url,
    },
  });
  const {
    data: cameras,
    error: cameraError,
    loading: cameraLoading,
  } = UseFetchCamaras();

  const incidentForm = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      cameraId: "",
      type: "",
      threatLevel: 1,
      tsStart: "",
      tsEnd: "",
      thumbnailUrl: "",
    },
  });

  const onCameraSubmit = async (data: CameraFormValues) => {
    try {
      // Simulate API call
      console.log("Submitting camera:", data);

      const response = await fetch("/api/camera", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to add camera");
      }

      setSubmitStatus({
        type: "success",
        message: `Camera "${data.name}" added successfully!`,
      });

      cameraForm.reset();

      // Clear status after 5 seconds
      setTimeout(() => setSubmitStatus({ type: null, message: "" }), 5000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to add camera. Please try again.",
      });
    }
  };

  const onIncidentSubmit = async (data: IncidentFormValues) => {
    try {
      // Convert string dates to Date objects for API
      const incidentData = {
        ...data,
        tsStart: new Date(data.tsStart),
        tsEnd: new Date(data.tsEnd),
        threatLevel: Number(data.threatLevel),
      };

      console.log("Submitting incident:", incidentData);

      const response = await fetch("/api/incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incidentData),
      });
      if (!response.ok) {
        throw new Error("Failed to add incident");
      }

      setSubmitStatus({
        type: "success",
        message: `Incident "${data.type}" reported successfully!`,
      });

      incidentForm.reset();

      // Clear status after 5 seconds
      setTimeout(() => setSubmitStatus({ type: null, message: "" }), 5000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to report incident. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          Add camara and incidents
        </h1>
      </div>

      {submitStatus.type && (
        <Alert
          className={`mb-6 ${
            submitStatus.type === "success"
              ? "border-green-500"
              : "border-red-500"
          }`}
        >
          {submitStatus.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription
            className={
              submitStatus.type === "success"
                ? "text-green-700"
                : "text-red-700"
            }
          >
            {submitStatus.message}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="camera" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Add Camera
          </TabsTrigger>
          <TabsTrigger value="incident" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Report Incident
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Camera
              </CardTitle>
              <CardDescription>
                Register a new security camera in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...cameraForm}>
                <div
                  onSubmit={cameraForm.handleSubmit(onCameraSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={cameraForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Camera Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Front Entrance Camera"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for the camera
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={cameraForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Main Building, Ground Floor"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Physical location of the camera
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={cameraForm.control}
                    name="liveStreamUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Live Stream URL</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the camera that captured this incident" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {videoList.map((video) => (
                              <SelectItem key={video.label} value={video.url}>
                                {video.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={cameraForm.formState.isSubmitting}
                    onClick={cameraForm.handleSubmit(onCameraSubmit)}
                  >
                    {cameraForm.formState.isSubmitting
                      ? "Adding Camera..."
                      : "Add Camera"}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incident">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Report Security Incident
              </CardTitle>
              <CardDescription>
                Document a new security incident for investigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...incidentForm}>
                <div
                  onSubmit={incidentForm.handleSubmit(onIncidentSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={incidentForm.control}
                    name="cameraId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Camera</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the camera that captured this incident" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cameras.map((camera) => (
                              <SelectItem key={camera.id} value={camera.id}>
                                {camera.name} - {camera.location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={incidentForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select incident type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {humanThreats.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={incidentForm.control}
                    name="threatLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Threat Level</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select threat level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 - Low</SelectItem>
                            <SelectItem value="2">2 - Minor</SelectItem>
                            <SelectItem value="3">3 - Moderate</SelectItem>
                            <SelectItem value="4">4 - High</SelectItem>
                            <SelectItem value="5">5 - Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Rate the severity of the incident (1=Low, 5=Critical)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={incidentForm.control}
                      name="tsStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} className="  text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={incidentForm.control}
                      name="tsEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={incidentForm.control}
                    name="thumbnailUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://example.com/thumbnail.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          URL to a screenshot or image of the incident
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={incidentForm.formState.isSubmitting}
                    onClick={incidentForm.handleSubmit(onIncidentSubmit)}
                  >
                    {incidentForm.formState.isSubmitting
                      ? "Reporting Incident..."
                      : "Report Incident"}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddCameraAndIncident;
