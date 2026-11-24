/**
 * Shared, mutable experience state. Written by scroll/intro/pointer code,
 * read every frame by the WebGL scene. Deliberately NOT React state:
 * per-frame values must never trigger re-renders.
 */
export const flow = {
  /** Chapter progress: 0 = hero … 5 = portal, fractional inside a chapter */
  progress: 0,
  /** Opening: 0 = scattered signal, 1 = gathered into the current formation */
  intro: 0,
  /** Hero scroll-out 0 → 1 (wordmark dissolve) */
  heroExit: 0,
  /** Wordmark letters rise 0 → 1 each (Scene 01) */
  letters: [] as number[],
  /** Wordmark opacity (DOM ↔ WebGL crossfade) */
  wordmark: 0,
  pointer: { x: 0, y: 0, strength: 0, last: 0 },
  /** Set once the canvas has rendered its first frame */
  ready: false,
};

type Listener = () => void;
const readyListeners = new Set<Listener>();

export function onFlowReady(fn: Listener) {
  if (flow.ready) {
    fn();
    return () => {};
  }
  readyListeners.add(fn);
  return () => readyListeners.delete(fn);
}

export function markFlowReady() {
  if (flow.ready) return;
  flow.ready = true;
  readyListeners.forEach((fn) => fn());
  readyListeners.clear();
}
