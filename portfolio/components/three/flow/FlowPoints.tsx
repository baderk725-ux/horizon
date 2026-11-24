"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { flow } from "@/lib/flow-store";
import { CHAPTER_FORMATIONS, type FlowData } from "./formations";
import { flowFragment, flowVertex } from "./shaders";

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

interface Props {
  data: FlowData;
  animated: boolean;
  /** Point-size multiplier (low tier compensates for no bloom) */
  sizeScale: number;
}

export function FlowPoints({ data, animated, sizeScale }: Props) {
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const time = useRef(0);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // `position` is required for draw count; real positions come from textures.
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(data.count * 3), 3));
    g.setAttribute("aRef", new THREE.BufferAttribute(data.attributes.aRef, 2));
    g.setAttribute("aT", new THREE.BufferAttribute(data.attributes.aT, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(data.attributes.aSeed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(data.attributes.aSize, 1));
    g.setAttribute("aCore", new THREE.BufferAttribute(data.attributes.aCore, 1));
    return g;
  }, [data]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: flowVertex,
        fragmentShader: flowFragment,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uSignal: { value: data.textures.signal },
          uA: { value: data.textures.ribbon },
          uB: { value: data.textures.loop },
          uMix: { value: 0 },
          uIntro: { value: flow.intro },
          uTime: { value: 0 },
          uMotion: { value: animated ? 1 : 0 },
          uSize: { value: 1 },
          uPixelRatio: { value: 1 },
          uFade: { value: 30 },
          uPointer: { value: new THREE.Vector2(9, 9) },
          uPointerStrength: { value: 0 },
          uAspect: { value: 1 },
          uAccent: { value: new THREE.Color("#FF4436") },
          uSilver: { value: new THREE.Color("#E7EAF0") },
        },
      }),
    [data, animated],
  );

  useFrame((_, delta) => {
    const u = material.uniforms;
    const p = Math.min(CHAPTER_FORMATIONS.length - 1, Math.max(0, flow.progress));
    const i = Math.min(CHAPTER_FORMATIONS.length - 1, Math.floor(p));
    const f = p - i;
    const j = Math.min(CHAPTER_FORMATIONS.length - 1, i + 1);
    u.uA!.value = data.textures[CHAPTER_FORMATIONS[i]!];
    u.uB!.value = data.textures[CHAPTER_FORMATIONS[j]!];
    // Morph happens in the second half of each chapter; static tier snaps.
    u.uMix!.value = animated ? smooth(0.42, 1, f) : f > 0.7 ? 1 : 0;
    u.uFade!.value = i >= 5 || (i === 4 && f > 0.6) ? 80 : 30;
    u.uIntro!.value = flow.intro;
    if (animated) time.current += Math.min(delta, 0.05);
    u.uTime!.value = time.current;
    u.uPixelRatio!.value = dpr;
    u.uSize!.value = (size.height / 900) * sizeScale;
    u.uAspect!.value = size.width / size.height;
    (u.uPointer!.value as THREE.Vector2).set(flow.pointer.x, flow.pointer.y);
    u.uPointerStrength!.value = flow.pointer.strength;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={2} />;
}
