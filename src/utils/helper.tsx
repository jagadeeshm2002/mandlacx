import { useHelper } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import {
  DirectionalLightHelper,
  PointLightHelper,
  SpotLightHelper,
  CameraHelper,
} from "three";
import * as THREE from "three";

// Light Helpers Component with Ambient Light
export function LightHelpers() {
  // Create refs for each light (ambient doesn't need ref)
  const directionalRef = useRef<THREE.DirectionalLight>(null);
  const pointRef = useRef<THREE.PointLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);

  // Your light controls
  const {
    // Ambient Light
    ambientIntensity,
    ambientColor,

    // Directional Light
    directionalIntensity,
    directionalPosition,
    directionalColor,
    showDirectionalHelper,

    // Point Light
    pointIntensity,
    pointPosition,
    pointColor,
    showPointHelper,

    // Spot Light
    spotIntensity,
    spotPosition,
    spotAngle,
    spotPenumbra,
    spotColor,
    showSpotHelper,

    // Helper Settings
    helperSize,
  } = useControls("Lighting & Helpers", {
    // Ambient Light Controls
    ambientIntensity: { value: 0.3, min: 0, max: 5, step: 0.1 },
    ambientColor: "#ffffff",

    // Directional Light Controls
    directionalIntensity: { value: 2.7, min: 0, max: 3, step: 0.1 },
    directionalPosition: { value: [-1, 4.5, 12.5], step: 0.5 },
    directionalColor: "#ffffff",
    showDirectionalHelper: true,

    // Point Light Controls
    pointIntensity: { value: 0.5, min: 0, max: 2, step: 0.1 },
    pointPosition: { value: [-10, -10, -5], step: 0.5 },
    pointColor: "#4f46e5",
    showPointHelper: true,

    // Spot Light Controls
    spotIntensity: { value: 0.8, min: 0, max: 3, step: 0.1 },
    spotPosition: { value: [0, 9.5, 38], step: 0.5 },
    spotAngle: { value: 0.3, min: 0.1, max: 1.5, step: 0.05 },
    spotPenumbra: { value: 1, min: 0, max: 1, step: 0.1 },
    spotColor: "#ffffff",
    showSpotHelper: true,

    // Helper Settings
    helperSize: { value: 1, min: 0.1, max: 3, step: 0.1 },
  });

  // Attach helpers conditionally
  // ts-ignore
  useHelper(
    showDirectionalHelper ? directionalRef : null,
    DirectionalLightHelper,
    helperSize,
    directionalColor
  );
  // ts-ignore
  useHelper(
    showPointHelper ? pointRef : null,
    PointLightHelper,
    helperSize,
    pointColor
  );
  // ts-ignore
  useHelper(
    showSpotHelper ? spotRef : null,
    SpotLightHelper,
    spotColor
  );

  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={ambientIntensity} color={ambientColor} />

      {/* Directional Light */}
      <directionalLight
        ref={directionalRef}
        position={directionalPosition}
        intensity={directionalIntensity}
        color={directionalColor}
        castShadow
      />

      {/* Point Light */}
      <pointLight
        ref={pointRef}
        position={pointPosition}
        intensity={pointIntensity}
        color={pointColor}
        castShadow
      />

      {/* Spot Light */}
      <spotLight
        ref={spotRef}
        position={spotPosition}
        intensity={spotIntensity}
        angle={spotAngle}
        penumbra={spotPenumbra}
        color={spotColor}
        castShadow
      />
    </>
  );
}

export function CameraController() {
  const { camera } = useThree();

  const { position, fov, showCameraHelper } = useControls("Camera", {
    position: {
      value: [0, 2, 8],
      step: 0.5,
    },
    fov: {
      value: 50,
      min: 20,
      max: 170,
      step: 1,
    },
    showCameraHelper: false,
  });

  // Optional: Add camera helper
  // ts-ignore
  useHelper(showCameraHelper ? camera : null, CameraHelper);

  useEffect(() => {
    camera.position.set(...position);
    if ('fov' in camera) {
      (camera as THREE.PerspectiveCamera).fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, position, fov]);

  return null;
}