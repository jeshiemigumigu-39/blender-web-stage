# Fix: Placeholder centerpiece is unresponsive

## Why it's broken
In the React app, the spinning icosahedron (`PlaceholderEnvironment.tsx`) had its own inline `onPointerOver` / `onClick` handlers that randomized its color. It was never a `HOTSPOTS` entry.

When ported to vanilla JS, `scene.js` only registers interactions for objects whose name matches a key in `hotspots.js`. The placeholder mesh is named `"__placeholder_center__"`, which isn't in the map, so:
- The center-screen raycast finds the mesh but `findHotspotForObject` returns `null`.
- The `mousedown` handler bails because `currentHover` stays `null`.
- No highlight, no tooltip, no color change.

## Fix
Register the placeholder centerpiece as a real hotspot so it flows through the same hover/click pipeline as glTF hotspots, and have its `onClick` randomize the material color (matching the React behavior).

### Changes

1. **`hotspots.js`** — add an entry for the placeholder mesh:
   ```js
   __placeholder_center__: {
     label: "Centerpiece",
     highlightColor: "#e0b96a",
     onClick: () => {
       const mesh = window.__placeholderSpinner;
       if (mesh) {
         const hue = Math.floor(Math.random() * 360);
         mesh.material.color.setHSL(hue / 360, 0.7, 0.55);
       }
     },
   },
   ```

2. **`scene.js`** — two small adjustments:
   - After `buildPlaceholder()`, expose the spinner so the hotspot handler can mutate it: `window.__placeholderSpinner = placeholder.userData.spinner;`
   - Call `wireHotspots(placeholder)` right after adding the placeholder to the scene (currently `wireHotspots` only runs on the loaded glTF, so the placeholder mesh never gets registered in `hotspotMeshes`, which is also why no highlight appears).

3. **Repack** `interactive-3d-static.zip` in `/mnt/documents/` and surface as an artifact.

## Notes
- No changes to the React/TypeScript source — this only affects the static HTML export.
- Keeps the existing hotspot architecture; doesn't introduce a parallel click path.
- When a real `scene.glb` loads, the placeholder (and its hotspot entry) are removed from the scene as before, so this entry is harmless in production.
