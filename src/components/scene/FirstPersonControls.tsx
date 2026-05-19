import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";

const SPEED = 5;

export function FirstPersonControls() {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    const k = keys.current;
    const forward = (k["KeyW"] || k["ArrowUp"] ? 1 : 0) - (k["KeyS"] || k["ArrowDown"] ? 1 : 0);
    const strafe = (k["KeyD"] || k["ArrowRight"] ? 1 : 0) - (k["KeyA"] || k["ArrowLeft"] ? 1 : 0);

    // Derive yaw from the camera's actual forward vector (XZ plane).
    // Using camera.rotation.y directly is unreliable: when pitch passes
    // certain thresholds, Euler decomposition flips yaw by π, which inverts
    // WASD when you face away from the initial direction.
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    const yawAngle = Math.atan2(-fwd.x, -fwd.z); // heading in world space
    const yaw = new THREE.Euler(0, yawAngle, 0, "YXZ");

    direction.current.set(strafe, 0, -forward).normalize();
    direction.current.applyEuler(yaw);

    velocity.current.lerp(direction.current.multiplyScalar(SPEED), 0.2);
    camera.position.addScaledVector(velocity.current, delta);

    // Lock to eye height
    camera.position.y = 1.7;
  });

  return <PointerLockControls />;
}
