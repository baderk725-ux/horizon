"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { flow } from "@/lib/flow-store";

const vertex = /* glsl */ `
uniform float uRise;
uniform float uLift;
varying vec2 vUv;
varying float vY;
void main() {
  vUv = uv;
  vec3 p = position;
  p.y += (1.0 - uRise) * uLift;        // rise from below its own mask
  vY = p.y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const fragment = /* glsl */ `
uniform sampler2D map;
uniform float uOpacity;
uniform float uClip;                    // local y of the mask line (box bottom)
varying vec2 vUv;
varying float vY;
void main() {
  if (vY < uClip) discard;
  vec4 c = texture2D(map, vUv);
  float a = c.a * uOpacity;
  if (a < 0.04) discard;                // only glyph pixels write depth → the Flow passes behind letters
  gl_FragColor = vec4(c.rgb, a);
  #include <colorspace_fragment>
}`;

interface Letter {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  base: THREE.Vector3;
}

/** Signals that the WebGL wordmark matches the DOM and can take over. */
export const wordmarkState = { ready: false };

/**
 * Rebuilds the DOM <h1> wordmark letter-by-letter in WebGL at identical screen positions,
 * so the DOM → WebGL handoff is invisible, then lets the Flow pass through it in depth.
 */
export function Wordmark3D({ animated }: { animated: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const group = useRef<THREE.Group>(null);
  const [fontsOk, setFontsOk] = useState(false);

  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => alive && setFontsOk(true));
    return () => {
      alive = false;
    };
  }, []);

  // Build (and rebuild on resize) from the DOM letters.
  const built = useMemo(() => {
    if (!animated || typeof document === "undefined") return [] as Letter[];
    const h1 = document.querySelector<HTMLElement>("[data-wordmark]");
    const spans = Array.from(document.querySelectorAll<HTMLElement>("[data-wordmark] [data-letter]"));
    if (!h1 || !spans.length || !fontsOk) return [] as Letter[];

    const cs = getComputedStyle(h1);
    const fontSize = parseFloat(cs.fontSize);
    const lineHeight = parseFloat(cs.lineHeight) || fontSize * 0.86;
    const font = `${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const dist = 14; // hero camera distance to the z=0 plane
    const k = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist) / H;
    const s = Math.min(2, window.devicePixelRatio || 1);
    const pad = Math.ceil(fontSize * 0.25);

    const probe = document.createElement("canvas").getContext("2d")!;
    probe.font = font;
    probe.fontStretch = "extra-expanded";
    const m = probe.measureText("H");
    const ascent = m.fontBoundingBoxAscent;
    const descent = m.fontBoundingBoxDescent;
    const baselineInBox = (lineHeight - (ascent + descent)) / 2 + ascent;

    return spans.map((span) => {
      const r = span.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const cw = Math.ceil(r.width + pad * 2);
      const ch = Math.ceil(r.height + pad * 2);
      const cv = document.createElement("canvas");
      cv.width = cw * s;
      cv.height = ch * s;
      const ctx = cv.getContext("2d")!;
      ctx.scale(s, s);
      ctx.font = font;
      ctx.fontStretch = "extra-expanded";
      ctx.fillStyle = "#E7EAF0";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(span.textContent ?? "", pad, pad + baselineInBox);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      const geo = new THREE.PlaneGeometry(cw * k, ch * k);
      const mat = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: true,
        depthTest: true,
        uniforms: {
          map: { value: tex },
          uRise: { value: 0 },
          uLift: { value: -(r.height * 1.05) * k },
          uOpacity: { value: 0 },
          uClip: { value: -(ch * k) / 2 + pad * k * 0.6 },
        },
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = 1;
      const base = new THREE.Vector3((r.left + r.width / 2 - W / 2) * k, -(top + r.height / 2 - H / 2) * k, 0);
      mesh.position.copy(base);
      return { mesh, base };
    });
    // size → rebuild on resize; fontsOk → build once the display face is loaded
  }, [animated, camera.fov, size.width, size.height, fontsOk]);

  useEffect(() => {
    wordmarkState.ready = built.length > 0;
    if (flow.letters.length !== built.length) flow.letters = built.map((_, i) => flow.letters[i] ?? 0);
    return () => {
      built.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        (mesh.material.uniforms.map!.value as THREE.Texture).dispose();
        mesh.material.dispose();
      });
    };
  }, [built]);

  useFrame(() => {
    if (!group.current) return;
    const k = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 14) / window.innerHeight;
    const exit = flow.heroExit;
    const fade = 1 - THREE.MathUtils.smoothstep(exit, 0.1, 0.75);
    group.current.visible = fade > 0.001 && flow.progress < 1.05;
    built.forEach(({ mesh, base }, i) => {
      const u = mesh.material.uniforms;
      u.uRise!.value = flow.letters[i] ?? 0;
      u.uOpacity!.value = flow.wordmark * fade;
      // Scroll-out: follow the page up, then each letter drifts toward the camera (staggered)
      const lag = Math.max(0, exit - i * 0.04);
      mesh.position.set(base.x * (1 + lag * 0.25), base.y + window.scrollY * k + lag * 0.6, base.z + lag * 3.5);
    });
  });

  if (!animated || !built.length) return null;
  return (
    <group ref={group}>
      {built.map(({ mesh }, i) => (
        <primitive key={i} object={mesh} />
      ))}
    </group>
  );
}
