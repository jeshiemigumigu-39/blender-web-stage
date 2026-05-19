import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { FirstPersonControls } from "./FirstPersonControls";
import { PlaceholderEnvironment } from "./PlaceholderEnvironment";
import { HotspotModel } from "./HotspotModel";
import { SceneErrorBoundary } from "./SceneErrorBoundary";

export function SceneCanvas() {
  // Avoid SSR / hydration issues — only mount Three on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background text-muted-foreground">
        Loading scene…
      </div>
    );
  }

  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.7, 6], fov: 70, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
    >
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Suspense fallback={null}>
        <PlaceholderEnvironment />
      </Suspense>
      <FirstPersonControls />
    </Canvas>
  );
}
