'use client';
import { Camera } from "@/utils/typs";
import React from "react";

const UseFetchCamaras = () => {
  const [data, setData] = React.useState<Camera[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchCameras = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/camera");
      const result = await response.json();

      if (result.success && response.status === 200) {
        setData(result.cameras);
      } else {
        throw new Error(result.error || "Failed to fetch cameras");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  return { data, error, loading, refetch: fetchCameras };
};


export default UseFetchCamaras;
