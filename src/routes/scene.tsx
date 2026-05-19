import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SceneCanvas } from "@/components/scene/SceneCanvas";

export const Route = createFileRoute("/scene")({
  head: () => ({
    meta: [
      { title: "3D Scene — Explore" },
      {
        name: "description",
        content:
          "Walk through an interactive 3D environment. Use WASD to move and the mouse to look around.",
      },
      { property: "og:title", content: "3D Scene — Explore" },
      {
        property: "og:description",
        content: "Interactive first-person walkthrough of a 3D environment.",
      },
    ],
  }),
  component: ScenePage,
});

function ScenePage() {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const onChange = () => setLocked(!!document.pointerLockElement);
    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <SceneCanvas />
      <Toaster position="bottom-center" richColors />


      {/* HUD */}
      <div className="pointer-events-none absolute left-4 top-4 z-10">
        <Link
          to="/"
          className="pointer-events-auto inline-flex items-center rounded-md border border-border bg-background/70 px-3 py-1.5 text-sm text-foreground backdrop-blur-sm hover:bg-background/90"
        >
          ← Home
        </Link>
      </div>

      {/* Center start overlay — shown until pointer lock engaged */}
      {!locked && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="pointer-events-auto max-w-md rounded-lg border border-border bg-background/80 p-6 text-center backdrop-blur-md">
            <h1 className="text-xl font-semibold text-foreground">Explore the scene</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Click anywhere to start. Use{" "}
              <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">W A S D</kbd> to move and the{" "}
              <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">mouse</kbd> to look around.
              Press <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">Esc</kbd> to release.
            </p>
          </div>
        </div>
      )}

      {/* Crosshair */}
      {locked && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
        </div>
      )}
    </main>
  );
}
