---
name: interactive-3d-portfolio
description: Planning and shipping interactive 3D/WebGL moments in a portfolio with React Three Fiber — when 3D earns its place, scene architecture in Next.js, DOM-synced views, scroll-linked cameras, shader hero effects, asset budgets, quality tiers, loading and accessible fallbacks. Use when adding a 3D hero, interactive object, WebGL gallery, shader effect or scroll-driven 3D world to a creative site; complements the threejs-* reference skills.
---

# Interactive 3D Portfolio Experiences

The `threejs-*` skills are the API reference (fundamentals, R3F, shaders, materials, lighting, loaders, textures, postprocessing, interaction, performance, asset pipeline). `build-threejs-scroll-worlds` covers full scroll-driven 3D worlds. This skill decides **whether, where and how** 3D appears in a portfolio, and how it ships without hurting performance or access.

## 1. Earn the 3D

Use 3D only when it carries the concept (from `docs/art-direction.md`). Good reasons: it *is* the work (a 3D artist or product designer), it demonstrates craft (a creative developer), or it is the brand metaphor. Bad reasons: "it looks impressive", or filler behind text.

Pick the lightest form that delivers the idea:

| Tier | Form | Typical cost |
|------|------|--------------|
| A | Shader plane: image distortion, gradient or noise field on a full-screen quad | ~150KB three, 1 draw call |
| B | Hero object: one glTF/procedural mesh with interaction (pointer tilt, drag rotate) | +model 300KB–1.5MB |
| C | DOM-synced WebGL: images/sections rendered in WebGL and tracked to DOM (drei `<View>` / scroll-synced planes) | moderate; careful layout sync |
| D | Scroll world: persistent scene with a camera path across chapters (`build-threejs-scroll-worlds`) | highest; needs the full budget |

## 2. Architecture in Next.js

```
components/three/
  Stage.tsx          'use client' <Canvas> wrapper: dpr, gl flags, Suspense, PerformanceMonitor
  HeroScene.tsx      scene content
  materials/         shaderMaterial definitions; shaders/*.glsl (via raw import or template strings)
  useQualityTier.ts  capability + FPS-based tier
```

- Load the canvas client-only: `const Stage = dynamic(() => import("@/components/three/Stage"), { ssr: false, loading: () => <Poster/> })`.
- **One persistent `<Canvas>`** in the layout for multi-section experiences (drei `<View>` + `<View.Port/>` with `eventSource` set to the page root), rather than a canvas per section. Multiple WebGL contexts are expensive and browsers cap them.
- Canvas defaults: `dpr={[1, 1.75]}`, `gl={{ antialias: false, powerPreference: "high-performance" }}`. Add antialiasing via postprocessing (SMAA/FXAA) only if needed. Use `frameloop="demand"` for static-until-interaction scenes and call `invalidate()` on input.
- Pause rendering when offscreen (IntersectionObserver → `frameloop` or the `setFrameloop` state) and when the tab is hidden.
- Drive scroll-linked values from the same GSAP/Lenis clock: write scroll progress into a ref or store from ScrollTrigger's `onUpdate`, then read it in `useFrame`, damped with `THREE.MathUtils.damp` or `maath/easing`. Never `setState` per frame.

## 3. Assets and budgets

- Models: glTF/GLB only, compressed with Draco or meshopt, textures in KTX2/WebP (`threejs-asset-pipeline` covers the gltf-transform commands). Budget: hero model ≤ 1.5MB, total 3D payload on the landing route ≤ 3MB, ≤ 100 draw calls, ≤ 300k triangles on desktop and half that on mobile.
- Generate typed components with `npx gltfjsx model.glb --transform --types` when a model needs per-node control.
- `useGLTF.preload(url)` for the hero. Lazy-load everything else when it approaches the viewport.
- Environment maps: self-host a small HDR/EXR or KTX2 (≤ 1K res) in `/public`. Don't depend on drei presets that fetch from a third-party CDN at runtime.
- Dispose of geometries, materials, textures and render targets on unmount (R3F auto-disposes what it creates. Manually created ones are yours).

## 4. Quality tiers

```ts
// tier: "high" | "medium" | "low" | "static"
static  = prefers-reduced-motion OR no WebGL2 OR Save-Data → render <Poster/> (pre-rendered image/video)
low     = hardwareConcurrency <= 4 OR mobile coarse pointer → dpr 1, no postprocessing, no shadows
medium  = default
high    = PerformanceMonitor reports stable ≥ 58fps → enable bloom/DOF, higher dpr
```

Use drei `<PerformanceMonitor onDecline={...} onIncline={...}>` to step tiers at runtime, and `<AdaptiveDpr pixelated />` for smooth degradation. The static poster must be the same composition, captured from the scene, so the design survives.

## 5. Interaction design

- Pointer response is damped and subtle: tilt ≤ 10°, parallax a few units. Make it feel like weight, not lag (damping lambda 4–8).
- Dragging or orbiting needs an explicit affordance and must not trap page scroll. Use `OrbitControls` with `enableZoom={false}` in scrolling pages, and limit polar and azimuth angles.
- Hover on meshes uses R3F pointer events. Set `document.body.style.cursor` or the custom cursor state, and keep the hit areas generous.
- Every interactive 3D affordance has a DOM equivalent (a link or button) for keyboard and screen-reader users. A canvas gets `role="img"` and an `aria-label` describing what it shows, or `aria-hidden` if purely decorative.

## 6. Shader hero effects (Tier A patterns)

- Image hover distortion: a plane per image with a texture uniform, `uHover` and `uMouse`. Displace UVs with noise scaled by `uHover`, which is animated with GSAP on `pointerenter`.
- Fluid/noise gradient backgrounds: fragment shader with simplex/FBM noise, tied to `uTime` and scroll progress. Cap at the medium tier and render at half resolution (`dpr` 0.5–1) — gradients don't need full-res pixels.
- Use `shaderMaterial` from drei to declare uniforms and extend. Keep GLSL in separate files with comments. Uniforms update in `useFrame` by mutating `.value`.
- See `threejs-shaders` and `threejs-postprocessing` for the API.

## 7. Verification

- Measure with `r3f-perf` or `renderer.info` in dev: draw calls, triangles, textures, memory. Record the numbers in the PR.
- Check: landing LCP unaffected (the canvas is not the LCP element; the poster or HTML hero is), mid-range laptop ≥ 55fps, mobile ≥ 30fps on the low tier, no context loss on route changes, and memory stable after 10 navigations.
- Capture screenshots of each tier with `portfolio-qa` (it can force reduced motion) and review them visually.
