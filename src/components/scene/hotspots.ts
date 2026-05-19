import { toast } from "sonner";

export type HotspotHandlers = {
  /** Tooltip / toast label shown on hover and click. */
  label: string;
  /** Optional click handler. Defaults to a toast with the label. */
  onClick?: (name: string) => void;
  /** Optional hover-in handler. */
  onPointerOver?: (name: string) => void;
  /** Optional hover-out handler. */
  onPointerOut?: (name: string) => void;
  /**
   * If set, the matched mesh's material `emissive` color is bumped on hover
   * to highlight it. Use any CSS color string.
   */
  highlightColor?: string;
};

/**
 * Map of Blender object names → hotspot config.
 *
 * In Blender, select the object and rename it in the Outliner — that name is
 * preserved in the .glb. Names are matched case-sensitively against every
 * descendant of the loaded scene.
 *
 * Example: a mesh named "Door_Front" in Blender becomes a clickable hotspot
 * here. You can target meshes, empties, or whole groups.
 */
export const HOTSPOTS: Record<string, HotspotHandlers> = {
  Door_Front: {
    label: "Front Door",
    highlightColor: "#e0b96a",
    onClick: () => toast.success("You opened the front door"),
  },
  Painting_01: {
    label: "Painting",
    highlightColor: "#5aa9ff",
    onClick: () => toast("A curious painting…", { description: "Click to learn more." }),
  },
  Lamp: {
    label: "Lamp",
    highlightColor: "#ffd166",
    onClick: () => toast("Lamp toggled"),
  },
};
