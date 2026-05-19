import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { HOTSPOTS, type HotspotHandlers } from "./hotspots";

type Props = {
  /** Path under /public, e.g. "/models/scene.glb" */
  url?: string;
  /** Called when a hotspot is hovered so the UI can show a tooltip. */
  onHoverLabel?: (label: string | null) => void;
};

/**
 * Loads a Blender-exported .glb and attaches click + hover handlers to any
 * descendant whose `name` matches a key in HOTSPOTS (see ./hotspots.ts).
 *
 * Drop your model at `public/models/scene.glb` and the hotspots wire up
 * automatically. Add/rename entries in HOTSPOTS to expose more interactions.
 */
export function HotspotModel({ url = "/models/scene.glb", onHoverLabel }: Props) {
  const { scene } = useGLTF(url);

  // Track which descendants are wired so we can clean up on unmount/HMR.
  const wired = useRef<
    {
      mesh: THREE.Mesh;
      cfg: HotspotHandlers;
      originalEmissive: THREE.Color | null;
    }[]
  >([]);

  // Clone so multiple mounts don't share mutated materials.
  const root = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const list: typeof wired.current = [];

    root.traverse((obj) => {
      const cfg = HOTSPOTS[obj.name];
      if (!cfg) return;

      // Wire on the object itself; R3F bubbles events from children.
      // We need a Mesh-ish thing to highlight. Find the first mesh under it
      // (or use it if it already is one).
      let target: THREE.Mesh | null = null;
      obj.traverse((c) => {
        if (!target && (c as THREE.Mesh).isMesh) target = c as THREE.Mesh;
      });
      if (!target) return;

      const mat = (target as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      const originalEmissive =
        mat && "emissive" in mat ? (mat.emissive as THREE.Color).clone() : null;

      list.push({ mesh: target, cfg, originalEmissive });
    });

    wired.current = list;
    return () => {
      // Restore any highlighted materials.
      for (const { mesh, originalEmissive } of list) {
        const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
        if (mat && originalEmissive && "emissive" in mat) {
          (mat.emissive as THREE.Color).copy(originalEmissive);
        }
      }
    };
  }, [root]);

  // Single delegated event surface — find the matching ancestor by name.
  const findHotspot = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    let node: THREE.Object3D | null = e.object;
    while (node) {
      const cfg = HOTSPOTS[node.name];
      if (cfg) return { name: node.name, cfg };
      node = node.parent;
    }
    return null;
  };

  const setHighlight = (name: string, on: boolean) => {
    const entry = wired.current.find((w) => w.mesh.parent?.name === name || w.mesh.name === name);
    if (!entry) return;
    const mat = entry.mesh.material as THREE.MeshStandardMaterial | undefined;
    if (!mat || !("emissive" in mat)) return;
    if (on && entry.cfg.highlightColor) {
      (mat.emissive as THREE.Color).set(entry.cfg.highlightColor);
    } else if (entry.originalEmissive) {
      (mat.emissive as THREE.Color).copy(entry.originalEmissive);
    }
  };

  return (
    <primitive
      object={root}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        const hit = findHotspot(e);
        if (!hit) return;
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        setHighlight(hit.name, true);
        hit.cfg.onPointerOver?.(hit.name);
        onHoverLabel?.(hit.cfg.label);
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        const hit = findHotspot(e);
        if (!hit) return;
        document.body.style.cursor = "";
        setHighlight(hit.name, false);
        hit.cfg.onPointerOut?.(hit.name);
        onHoverLabel?.(null);
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        const hit = findHotspot(e);
        if (!hit) return;
        e.stopPropagation();
        hit.cfg.onClick?.(hit.name);
      }}
    />
  );
}

// Preload so the first navigation to /scene doesn't stall.
useGLTF.preload("/models/scene.glb");
