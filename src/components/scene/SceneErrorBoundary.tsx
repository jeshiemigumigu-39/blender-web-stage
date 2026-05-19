import { Component, type ReactNode } from "react";

type Props = { fallback: ReactNode; children: ReactNode; onError?: (e: unknown) => void };
type State = { hasError: boolean };

/** Minimal error boundary so a missing/broken .glb falls back to a placeholder. */
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    this.props.onError?.(error);
    // eslint-disable-next-line no-console
    console.warn("[scene] model failed to load, using placeholder:", error);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
