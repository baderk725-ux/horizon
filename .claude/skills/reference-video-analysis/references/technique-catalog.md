# Technique Catalog — premium 3D scroll sites

Implementation notes for effects that recur in award-level creative sites. Use them as building blocks for *original* compositions. API details live in the `threejs-*`, `gsap-*` and `motion` skills.

## Instanced formation morphs (swarm → sphere → ring → logo)
- One `InstancedMesh` (`RoundedBoxGeometry` or a low-poly custom shape) with N ≤ 2,000 on desktop and ≤ 500 on mobile.
- Precompute target arrays per formation (spiral vortex, Fibonacci sphere `φ = acos(1 - 2(i+0.5)/N)`, `θ = π(1+√5)i`, torus, or points sampled from a text/SVG shape via `MeshSurfaceSampler`).
- Drive one `progress` value with GSAP (time or ScrollTrigger scrub). Lerp per instance with a per-index delay (`clamp((p - i/N*0.4)/0.6)`) for organic staggering. Write matrices in `useFrame` and set `instanceMatrix.needsUpdate = true`.
- For colour waves, use `setColorAt` + `instanceColor.needsUpdate`, or a shader attribute with a uniform threshold.
- Above about 5k instances, move the morph to the vertex shader (targets as instanced attributes, a progress uniform).

## Chrome and metal materials
- `MeshPhysicalMaterial({ metalness: 1, roughness: 0.05–0.25, clearcoat: 1 })`.
- **Requires an environment map.** Without one, metal renders black. Self-host a small HDR/EXR (1K) or bake a gradient studio env with drei `<Environment>` + `<Lightformer>` (no network fetch).
- Add a subtle normal-map or roughness variation to avoid a "CG plastic" look.

## Chains, ropes and cables
- Visual-only: instance a torus link along `CatmullRomCurve3.getSpacedPoints(n)`, alternating 90° roll per link and orienting with the curve tangent. Animate the control points with noise for sway.
- Physical: `@react-three/rapier` rigid bodies connected by `useSphericalJoint`/`useRopeJoint`. Keep it under about 30 bodies, and freeze it when offscreen.
- Lanyard/badge pattern: a rope of joints + `meshline` band + a draggable card body. It's a known open R3F example, so restyle the card entirely.

## Depth-interleaved typography (3D passing in front of and behind text)
- Best: render the type in WebGL (drei `<Text>`/troika with a self-hosted font, or `<Text3D>` from a typeface JSON) so the depth buffer sorts it. Keep an identical visually-hidden DOM heading for SEO and accessibility.
- Alternative: DOM type sandwiched between two canvases, or a back canvas plus a front canvas rendering only the foreground objects (doubles the GPU cost).

## Persistent scroll world
- One fixed `<Canvas>` behind the content. ScrollTrigger timelines per chapter write into a shared store (refs, not React state). `useFrame` damps the camera position and target toward chapter keyframes.
- Chapter colour and lighting: tween `scene.background`, fog colour and light intensities, and a grade uniform, in sync with the CSS `--bg` variable so DOM and WebGL match.

## Post-processing look (`@react-three/postprocessing`)
- Bloom (luminance threshold about 0.8), ChromaticAberration (offset scaled by scroll velocity for a "motion blur" feel), Noise (premultiplied, low opacity), Vignette.
- Colour grading: a HueSaturation/LUT pass driven by chapter. Two-tone grades (warm ↔ cold) read as cinematic chapter changes.
- Disable the whole composer on the low tier. Postprocessing is the first thing to cut on mobile.

## Text effects
- Line mask reveal: SplitText `mask: "lines"`.
- Echo/trail: 2–3 aria-hidden clones offset in y/x with decreasing opacity, animated with increasing lag. Or a velocity-driven `text-shadow` trail.
- Scramble/decode: GSAP ScrambleTextPlugin on enter. Keep the real text in the DOM for screen readers (`aria-label` on the container).
- RGB split: two coloured clones with `mix-blend-mode: screen`, offset ±2px with clip-path slices for glitch frames. Keep glitches brief and rare.

## 3D project gallery
- Planes textured with project media (KTX2/WebP, ≤ 1024px), positioned on a spiral or depth grid. The camera dollies along z on scroll.
- Hover: raycast → tilt toward the pointer + a uniform-driven distortion. Click: Flip or a View Transition into the case-study route.
- Always mirror it as a semantic DOM list of links (visually hidden if the canvas is the primary UI).

## Budget guide (landing route, desktop high tier)
- Draw calls ≤ 100, triangles ≤ 300k, textures ≤ 40 MB GPU, JS for 3D ≤ 250 KB gzip (lazy). Total 3D payload ≤ 3 MB.
- Mobile/low tier: no postprocessing, no physics, DPR 1, instance counts ÷ 4, or a static poster/video loop.
