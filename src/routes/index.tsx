import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Interactive 3D Environment
        </h1>
        <p className="mt-4 text-muted-foreground">
          A first-person walkable scene built with React Three Fiber. Swap{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">public/models/scene.glb</code>{" "}
          to drop in your Blender export.
        </p>
        <div className="mt-8">
          <Link
            to="/scene"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Enter the scene →
          </Link>
        </div>
      </div>
    </main>
  );
}
