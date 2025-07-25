"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  useHelper,
} from "@react-three/drei";
import * as THREE from "three";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

import { useControls } from "leva";
import { LockKeyhole, Repeat, ShieldHalf, Signal, Zap } from "lucide-react";
import { CameraController, LightHelpers } from "@/utils/helper";

// Preload the model
useGLTF.preload("/model.glb");

function AnimatedModel({
  scrollProgress,
  isScrolling,
}: {
  scrollProgress: number;
  isScrolling: boolean;
}) {
  const gltf = useGLTF("/model.glb");
  const modelRef = useRef<THREE.Group>(null);
  // const {rotation,scale,position}=useControls("Model",{
  //   position: {
  //     value: [0, -1, 0],
  //     step: 0.5,
  //   },
  //   rotation: {
  //     value: [1.2200000000000009, -1.570000000000001, 0],
  //     step: 0.1,
  //   },
  //   scale: {
  //     value: 35,
  //     min: 10,
  //     max: 100,
  //     step: 1,
  //   },
  // })

  useFrame((state) => {
    if (modelRef.current) {
      const state1 = {
        position: [0, -1, 0],
        rotation: [1.2200000000000009, -1.570000000000001, 0],
        scale: 35,
      };

      const state2 = {
        position: [0, -1, 0],
        rotation: [
          0.24000000000000005, -0.8400000000000003, -0.049999999999999954,
        ],
        scale: 45,
      };

      const state3 = {
        position: [0, -1, 0],
        rotation: [0.24000000000000005, 0.8, 0],
        scale: 35,
      };
      const state4 = {
        position: [0, -1, 0],
        rotation: [0.24000000000000005, 0, 0],
        scale: 35,
      };

      let targetPosition = [0, -1, 0];
      let targetRotation = [1.2200000000000009, -1.570000000000001, 0];
      let targetScale = 35;

      // Section 1 (0-33%): Transition from state1 to state2
      if (scrollProgress <= 0.33) {
        const sectionProgress = scrollProgress / 0.33; // 0 to 1 within section

        targetPosition = [
          THREE.MathUtils.lerp(
            state1.position[0],
            state2.position[0],
            sectionProgress
          ),
          THREE.MathUtils.lerp(
            state1.position[1],
            state2.position[1],
            sectionProgress
          ),
          THREE.MathUtils.lerp(
            state1.position[2],
            state2.position[2],
            sectionProgress
          ),
        ];

        targetRotation = [
          THREE.MathUtils.lerp(
            state1.rotation[0],
            state2.rotation[0],
            sectionProgress
          ),
          THREE.MathUtils.lerp(
            state1.rotation[1],
            state2.rotation[1],
            sectionProgress
          ),
          THREE.MathUtils.lerp(
            state1.rotation[2],
            state2.rotation[2],
            sectionProgress
          ),
        ];

        targetScale = THREE.MathUtils.lerp(
          state1.scale,
          state2.scale,
          sectionProgress
        );
      }

      // Section 2 (33-66%): Stay at state2
      else if (scrollProgress <= 0.6) {
        targetPosition = [...state2.position];
        targetRotation = [...state2.rotation];
        targetScale = state2.scale;
      } else if (scrollProgress <= 0.85) {
        targetPosition = [...state3.position];
        targetRotation = [...state3.rotation];
        targetScale = state3.scale;
      }

      // Section 3 (66-100%): Transition from state2 to state3
      else {
        const sectionProgress = (scrollProgress - 0.6) / 0.4; // 0 to 1 within section

        targetPosition = [
          THREE.MathUtils.lerp(
            state2.position[0],
            state4.position[0],

            sectionProgress
          ),
          THREE.MathUtils.lerp(
            state2.position[1],
            state4.position[1],

            sectionProgress
          ),
          THREE.MathUtils.lerp(
            state2.position[2],
            state4.position[2],

            sectionProgress
          ),
        ];

        targetRotation = [
          THREE.MathUtils.lerp(
            state2.rotation[0],
            state4.rotation[0],
            sectionProgress
          ),
          THREE.MathUtils.lerp(
            state2.rotation[1],
            state4.rotation[1],
            sectionProgress
          ),
          THREE.MathUtils.lerp(
            state2.rotation[2],
            state4.rotation[2],
            sectionProgress
          ),
        ];

        targetScale = THREE.MathUtils.lerp(
          state2.scale,
          state4.scale,
          sectionProgress
        );
      }
      // Smooth interpolation to target values
      const lerpFactor = isScrolling ? 0.08 : 0.05;

      // Apply position
      modelRef.current.position.x = THREE.MathUtils.lerp(
        modelRef.current.position.x,
        targetPosition[0],
        lerpFactor
      );
      modelRef.current.position.y = THREE.MathUtils.lerp(
        modelRef.current.position.y,
        targetPosition[1],
        lerpFactor
      );
      modelRef.current.position.z = THREE.MathUtils.lerp(
        modelRef.current.position.z,
        targetPosition[2],
        lerpFactor
      );

      // Apply rotation
      modelRef.current.rotation.x = THREE.MathUtils.lerp(
        modelRef.current.rotation.x,
        targetRotation[0],
        lerpFactor
      );
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        targetRotation[1],
        lerpFactor
      );
      modelRef.current.rotation.z = THREE.MathUtils.lerp(
        modelRef.current.rotation.z,
        targetRotation[2],
        lerpFactor
      );

      // Apply scale
      const currentScale = modelRef.current.scale.x;
      modelRef.current.scale.setScalar(
        THREE.MathUtils.lerp(currentScale, targetScale, lerpFactor * 0.5)
      );
    }
  });

  return (
    <group
      ref={modelRef}
      position={[0, -1, 0]}
      rotation={[1, -1.4, 1]}
      scale={35}
      // position={position}
      // rotation={rotation}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}

export default function Page() {
  const { scrollProgress, isScrolling } = useScrollAnimation();

  const sections = [
    "Hero",
    "Features",
    "Specifications",
    "Analytics",
    "Contact",
  ];

  return (
    <div className="relative">
      {/* Loading Screen */}

      {/* Fixed 3D Canvas Background */}
      <div className="fixed inset-0 w-full h-full">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 40 }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <ambientLight intensity={3} color={"#ffffff"} />
          <directionalLight position={[-1, 4.5, 12.5]} intensity={2.5} />
          <pointLight
            position={[-10, -10, -5]}
            intensity={0.5}
            color="#4f46e5"
          />
          <spotLight
            position={[0, 9.5, 38]}
            intensity={0.8}
            angle={0.3}
            penumbra={1}
          />
          <Suspense fallback={null}>
            <AnimatedModel
              scrollProgress={scrollProgress}
              isScrolling={isScrolling}
            />
            <Environment preset="night" />
          </Suspense>
          {/* <CameraController />  */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate={false}
            dampingFactor={0.05}
            enableDamping={true}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>

      {/* Scrollable Content */}
      <ScrollContent />
    </div>
  );
}

function ScrollContent() {
  const { scrollProgress } = useScrollAnimation();

  return (
    <div className="relative z-10 ">
      {/* Hero Section */}
      <div className="h-screen flex flex-col  items-center text-center px-8">
        <div
          className="mb-8 mt-44 transform transition-all duration-1000 ease-out"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 2),
            transform: `translateY(${scrollProgress * 100}px) scale(${
              1 - scrollProgress * 0.1
            })`,
          }}
        >
          <p className="text-sm font-bold mb-4 tracking-tight bg-yellow-500 bg-clip-text text-transparent">
            THE FUTURE OF ON-SITE AI SURVEILLANCE
          </p>
          <h1 className="text-6xl md:text-8xl font-sans font-semibold  leading-relaxed mb-8 bg-white bg-clip-text text-transparent">
            MandlacX Edge{" "}
            <span className="font-jakarta-sans italic">Processor</span>
          </h1>
        </div>
      </div>

      {/* Features Section */}
      <div className="min-h-screen  py-20 font-jakarta-sans">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 gap-16 items-center mb-20">
            <div className="relative max-w-sm w-[350px]">
              <div className=" border border-gray-700/50 rounded-2xl p-8 relative overflow-hidden bg-[#131313]">
                <div className="relative z-10">
                  <h1 className="text-white text-xl font-bold mb-3 leading-tight border-r-4 border-yellow-400">
                    MandlacX Edge Processor
                  </h1>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>

                    <p className="text-gray-300  leading-relaxed">
                      A multi-domain, first-generation AI-powered device
                      designed for real-time threat detection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <svg
                  className="absolute top-4 left-96 transform -translate-x-1/2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="336"
                  height="82"
                  viewBox="0 0 336 82"
                  fill="none"
                >
                  <path d="M323.5 68L256.5 1H0" stroke="#E8E8E8" />
                  <circle
                    cx="325"
                    cy="70.5"
                    r="11"
                    transform="rotate(180 325 70.5)"
                    fill="#F8F8F8"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <div className="relative max-w-sm w-[350px]">
                <div className=" border border-gray-700/50 rounded-2xl p-8 relative overflow-hidden bg-[#131313]">
                  <div className="relative z-10">
                    <h1 className="text-white text-xl font-bold mb-3 leading-tight border-r-4 border-yellow-400">
                      Key Specifications
                    </h1>

                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>

                      <p className="text-gray-300  leading-relaxed">
                        USB3.0 Support
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>

                      <p className="text-gray-300  leading-relaxed">
                        16 GB RAM
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>

                      <p className="text-gray-300  leading-relaxed">
                        A7 Cortex Processor
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>

                      <p className="text-gray-300  leading-relaxed">
                        Three Multi-axis survelllance lenses
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <svg
                    className="absolute top-4  transform -translate-x-1/2"
                    width="336"
                    height="82"
                    viewBox="0 0 336 82"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.5 68L79.5 1H336" stroke="#E8E8E8" />
                    <circle
                      cx="11"
                      cy="11"
                      r="11"
                      transform="matrix(1 0 0 -1 0 81.5)"
                      fill="#F8F8F8"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div></div>
            <div></div>
            <div className="relative max-w-sm w-[350px]">
              <div className="relative">
                <svg
                  className="absolute bottom-4 left-96 transform -translate-x-1/2"
                  width="336"
                  height="81"
                  viewBox="0 0 336 81"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M323.5 13.4162L256.5 80H0" stroke="#E8E8E8" />
                  <ellipse
                    cx="11"
                    cy="10.9317"
                    rx="11"
                    ry="10.9317"
                    transform="matrix(-1 0 0 1 336 0)"
                    fill="#F8F8F8"
                  />
                </svg>
              </div>
              <div className=" border border-gray-700/50 rounded-2xl p-8 relative overflow-hidden bg-[#131313]">
                <div className="relative z-10">
                  <h1 className="text-white text-xl font-bold mb-3 leading-tight border-r-4 border-yellow-400">
                    Real-Time Threat Detection
                  </h1>
                  <p>Detects</p>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>

                    <p className="text-gray-300  leading-relaxed">Intrusions</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>

                    <p className="text-gray-300  leading-relaxed">
                      FireArms&Sharp Objects
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>

                    <p className="text-gray-300  leading-relaxed">
                      Human Falls
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>

                    <p className="text-gray-300  leading-relaxed">
                      Unsual or Aggressive Motion
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex items-end justify-end">
              <div className="relative max-w-sm w-[350px]">
                <div className="relative">
                  <svg
                    className="absolute bottom-4 transform -translate-x-1/2"
                    width="336"
                    height="81"
                    viewBox="0 0 336 81"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.5 13.4162L79.5 80H336" stroke="#E8E8E8" />
                    <ellipse
                      cx="11"
                      cy="10.9317"
                      rx="11"
                      ry="10.9317"
                      fill="#F8F8F8"
                    />
                  </svg>
                </div>
                <div className=" border border-gray-700/50 rounded-2xl p-8 relative overflow-hidden bg-[#131313]">
                  <div className="relative z-10">
                    <h1 className="text-white text-xl font-bold mb-3 leading-tight border-r-4 border-yellow-400">
                      On-Device Intelligence
                    </h1>

                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 mt-2 flex-shrink-0"></div>

                      <p className="text-gray-300  leading-relaxed">
                        Engineered to deliver intelligent surveillance without
                        relying on the cloud, it gives you control, speed, and
                        reliability right where you need it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="min-h-screen  py-20 font-jakarta-sans ">
        <div className="max-w-7xl mx-auto px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-16 items-center mb-20">
            <div className="w-[300px]">
              <h1 className="text-[38px] italic font-jakarta-sans  text-start leading-tight text-white">
                MandlacX Over{" "}
                <span className="font-semibold not-italic">
                  Cloud-Only Video Analytics
                </span>
              </h1>
            </div>
            <div>
              <div className="flex flex-col justify-start border border-yellow-900/25 rounded-2xl p-6 font-jakarta-sans">
                <div className="border border-yellow-500/50 p-2.5 mr-auto rounded-xl bg-stone-900">
                  <ShieldHalf className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-white text-xl font-semibold font-sans my-3 leading-tight ">
                  Bullet-Proof Weapon Detection
                </h3>
                <p className="text-gray-300 font-semibold ">
                  MandlacX is trained to detect firearms, knives, and other
                  sharp threats with precision—no internet required.
                </p>
              </div>
            </div>
            <div>
              <div className="flex flex-col justify-start border border-yellow-900/25 rounded-2xl p-6 font-jakarta-sans">
                <div className="border border-yellow-500/50 p-2.5 mr-auto rounded-xl bg-stone-900">
                  <Signal className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-white text-xl font-semibold font-sans my-3 leading-tight ">
                  Bandwidth You Can Actually Afford
                </h3>
                <p className="text-gray-300 font-semibold ">
                  No continuous streaming. No heavy uploads. Just efficient edge
                  computing that saves your network and your budget.
                </p>
              </div>
            </div>
            <div>
              <div className="flex flex-col justify-start border border-yellow-900/25 rounded-2xl p-6 font-jakarta-sans">
                <div className="border border-yellow-500/50 p-2.5 mr-auto rounded-xl bg-stone-900">
                  <LockKeyhole className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-white text-xl font-semibold font-sans my-3 leading-tight ">
                  Privacy by Design
                </h3>
                <p className="text-gray-300 font-semibold ">
                  Your footage stays on-site. No cloud syncs, no external
                  servers—just full control over your data.
                </p>
              </div>
            </div>
            <div></div>
            <div>
              <div className="flex flex-col justify-start border border-yellow-900/25 rounded-2xl p-6 font-jakarta-sans">
                <div className="border border-yellow-500/50 p-2.5 mr-auto rounded-xl bg-stone-900">
                  <Repeat className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-white text-xl font-semibold font-sans my-3 leading-tight ">
                  Future-Proof AI Stack
                </h3>
                <p className="text-gray-300 font-semibold ">
                  With modular AI models and local firmware updates, MandlacX is
                  built to evolve with your needs—no dependency on cloud
                  upgrades.
                </p>
              </div>
            </div>
            <div></div>
            <div>
              <div className="flex flex-col justify-start border border-yellow-900/25 rounded-2xl p-6 font-jakarta-sans">
                <div className="border border-yellow-500/50 p-2.5 mr-auto rounded-xl bg-stone-900">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-white text-xl font-semibold font-sans my-3 leading-tight ">
                  Latency That Saves Seconds—and Lives
                </h3>
                <p className="text-gray-300 font-semibold ">
                  Instant on-device processing means faster alerts and quicker
                  interventions during critical moments.
                </p>
              </div>
            </div>

            <div className="w-[300px]">
              <h1 className="text-[38px] italic font-jakarta-sans  text-start leading-tight text-white">
                Built for Speed.{" "}
                <span className="font-semibold not-italic">
                  Designed for Action.
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
