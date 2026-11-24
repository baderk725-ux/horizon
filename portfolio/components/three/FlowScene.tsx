"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, advance, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { gsap } from "@/lib/gsap";
import { flow, markFlowReady } from "@/lib/flow-store";
import { buildFlow } from "./flow/formations";
import { FlowPoints } from "./flow/FlowPoints";
import { Wordmark3D } from "./Wordmark3D";
import { tierConfig, type Tier } from "./quality";

/** Camera per chapter: [position, lookAt] */
const CAMERAS: [THREE.Vector3Tuple, THREE.Vector3Tuple][] = [
  [[0, 0, 14], [0, 0, 0]],
  [[-0.6, 0.4, 14], [0, 0, 0]],
  [[0, 0.2, 14], [0, 0, 0]],
  [[0, 0, 14], [0, 0, 0]],
  [[0, 3.2, 15], [0, -0.4, 0]],
  [[0, 0, 12], [0, 0, 0]],
];

function CameraRig({ animated }: { animated: boolean }) {
  const pos = useMemo(() => new THREE.Vector3(0, 0, 14), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const tp = useMemo(() => new THREE.Vector3(), []);
  const tl = useMemo(() => new THREE.Vector3(), []);
  const b = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }, delta) => {
    const p = Math.min(5, Math.max(0, flow.progress));
    const i = Math.floor(p);
    const j = Math.min(5, i + 1);
    const f = THREE.MathUtils.smoothstep(p - i, 0.42, 1);
    const [pi, li] = CAMERAS[i]!;
    const [pj, lj] = CAMERAS[j]!;
    tp.fromArray(pi).lerp(b.fromArray(pj), animated ? f : f > 0.7 ? 1 : 0);
    tl.fromArray(li).lerp(b.fromArray(lj), animated ? f : f > 0.7 ? 1 : 0);
    // Scene 01: slow push-in after the intro; pointer parallax (damped)
    tp.z -= flow.intro * 1.2 * (1 - Math.min(1, p));
    if (animated) {
      tp.x += flow.pointer.x * 0.35 * flow.pointer.strength;
      tp.y += flow.pointer.y * 0.2 * flow.pointer.strength;
      const k = Math.min(delta, 0.05);
      pos.x = THREE.MathUtils.damp(pos.x, tp.x, 4, k);
      pos.y = THREE.MathUtils.damp(pos.y, tp.y, 4, k);
      pos.z = THREE.MathUtils.damp(pos.z, tp.z, 3, k);
      look.x = THREE.MathUtils.damp(look.x, tl.x, 4, k);
      look.y = THREE.MathUtils.damp(look.y, tl.y, 4, k);
      look.z = THREE.MathUtils.damp(look.z, tl.z, 4, k);
    } else {
      pos.copy(tp);
      look.copy(tl);
    }
    camera.position.copy(pos);
    camera.lookAt(look);
  });
  return null;
}

/**
 * One clock: the canvas is advanced from GSAP's ticker (the same ticker that drives
 * Lenis and ScrollTrigger), so camera, particles and scroll never drift a frame apart.
 * Also measures FPS and asks for a lower tier if the device can't keep up.
 */
function Driver({ animated, onSlow }: { animated: boolean; onSlow: () => void }) {
  const invalidated = useRef(true);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    let frames = 0;
    let windowStart = performance.now();
    let slowWindows = 0;
    let lastKey = "";
    let first = true;
    const tick = (time: number) => {
      if (!animated) {
        const key = `${Math.round(flow.progress * 4)}|${flow.intro.toFixed(2)}|${window.innerWidth}x${window.innerHeight}`;
        if (key === lastKey && !invalidated.current) return;
        lastKey = key;
        invalidated.current = false;
      }
      advance(time);
      if (first) {
        first = false;
        requestAnimationFrame(() => markFlowReady());
      }
      if (!animated || document.hidden) return;
      frames++;
      const now = performance.now();
      if (now - windowStart > 2000) {
        const fps = (frames * 1000) / (now - windowStart);
        frames = 0;
        windowStart = now;
        slowWindows = fps < 42 && flow.intro >= 1 ? slowWindows + 1 : 0;
        if (slowWindows >= 2) {
          slowWindows = 0;
          onSlow();
        }
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [animated, onSlow, gl]);
  return null;
}

interface Props {
  tier: Exclude<Tier, "none">;
  portrait: boolean;
  onSlow: () => void;
}

export default function FlowScene({ tier, portrait, onSlow }: Props) {
  const cfg = tierConfig[tier];
  const animated = tier !== "static";
  const data = useMemo(() => buildFlow(cfg.count, portrait), [cfg.count, portrait]);
  useEffect(() => () => Object.values(data.textures).forEach((t) => t.dispose()), [data]);

  return (
    <Canvas
      flat
      frameloop="never"
      dpr={cfg.dpr}
      camera={{ fov: portrait ? 55 : 40, near: 0.1, far: 200, position: [0, 0, 14] }}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false }}
      events={undefined}
      style={{ pointerEvents: "none" }}
    >
      {/* Colour-managed background (not setClearColor) — see technical plan §1 */}
      <color attach="background" args={["#090A0D"]} />
      <Driver animated={animated} onSlow={onSlow} />
      <CameraRig animated={animated} />
      <Wordmark3D animated={animated} />
      <FlowPoints data={data} animated={animated} sizeScale={cfg.bloom ? 1 : 1.1} />
      {cfg.bloom && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          {/* Threshold above silver type luminance (~0.80): only dense light blooms */}
          <Bloom mipmapBlur luminanceThreshold={0.86} luminanceSmoothing={0.08} intensity={0.95} radius={0.62} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
