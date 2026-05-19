import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

/**
 * Placeholder environment. Swap this out for your Blender export:
 *
 *   import { useGLTF } from "@react-three/drei";
 *   const { scene } = useGLTF("/models/scene.glb");
 *   return <primitive object={scene} />;
 *
 * Drop your .glb into `public/models/scene.glb`.
 */
export function PlaceholderEnvironment() {
  const spinner = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (spinner.current) spinner.current.rotation.y += dt * 0.6;
  });

  // Scatter a few pillars to give a sense of space
  const pillars = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const r = 8;
    return [Math.cos(angle) * r, 1.5, Math.sin(angle) * r] as [number, number, number];
  });

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#2a2d34" />
      </mesh>

      {/* Grid lines for movement feedback */}
      <gridHelper args={[60, 60, "#4a4e5a", "#3a3d44"]} position={[0, 0.01, 0]} />

      {/* Pillars */}
      {pillars.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.8, 3, 0.8]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
      ))}

      {/* Centerpiece — interactive */}
      <mesh
        ref={spinner}
        position={[0, 1, 0]}
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          const m = e.object as Mesh;
          (m.material as { color: { set: (c: string) => void } }).color.set(
            `hsl(${Math.random() * 360}, 70%, 55%)`,
          );
        }}
      >
        <icosahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color="#e0b96a" metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}
