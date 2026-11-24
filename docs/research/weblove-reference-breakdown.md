# Reference Breakdown — "weblove" (TikTok screen capture)

**Source analysed:** `a1aa6b4d-ScreenRecording_11-24-2026_06-29-31_1.mp4` (uploaded attachment)
**Not found in the repo:** `reference-video.mp4`, `weblove-reference.mp4`. This attachment was the only video available.
**Method:** ffprobe metadata → 75 frames at 4 fps → contact sheets → scene-cut detection → 15 full-resolution crops of the laptop screen.
**Evidence:** [`weblove-keyframes.jpg`](weblove-keyframes.jpg) (15 key moments), [`weblove-timeline.jpg`](weblove-timeline.jpg) (the full 18.8 s at 0.25 s steps).

## What the file actually is

| Property | Value |
|---|---|
| Container | iPhone screen recording, 1170×2532, HEVC, 60 fps, 18.8 s, with audio |
| Content | A **TikTok post** by `weblove` ("POV: 3,500 $ Budget", caption "How I build with Claude… Academy"), in which **a phone camera films a laptop** playing the site |
| Consequence | The site is seen second-hand: perspective-skewed, with camera motion blur, a reflective table (mirror artefacts in the lower half), and TikTok UI overlays. The video is likely edited and sped up. The **desktop** layout is shown; mobile behaviour isn't visible. |

**What I couldn't determine reliably:** exact typefaces, easing curves and durations (the playback speed is unknown), hover and cursor states (no cursor is visible), mobile layout, whether some 3D passages are real-time WebGL or **pre-rendered video**, and anything the audio implies. Statements below marked *(inferred)* are my reading, not certainties.

## Timeline

| Time | Section | What happens |
|---|---|---|
| 0.0–1.2 s | **Intro / assembly** | Light-grey stage. About 60 black rounded cubes stream inward in a vortex around a **chrome spiked star**, converging into a spherical shell. |
| 1.2–2.0 s | **Hero type reveal** | A giant black wordmark "WEBLOVE" rises from a bottom mask, cropped by the right edge (bleeding off-canvas). The left column fades in: "WE CRAFT WEBSITES YOU CAN FEEL." (uppercase, extended grotesk), plus a dark pill CTA with a circular arrow and a secondary text link. |
| 2.0–2.6 s | **Hero transformation** | The cubes recolour from black to red/white in a staggered wave. The sphere opens into a ring (a torus of cubes) around the star. Heavy **chrome chains** whip in and wrap the ring, passing **in front of and behind the wordmark** (depth-interleaved type). |
| 2.6–5.6 s | Hero idle | The ring rotates slowly and the chains sway *(inferred: rope physics or a noise-driven spline)*. Minimal nav top-right, logo top-left, small index/percentage at the far right. |
| 5.6–6.4 s | **Scroll handoff** | The hero object exits. One chain stretches horizontally across the viewport and becomes the **persistent connective object** between sections. The background starts darkening. |
| 6.4–7.8 s | **Manifesto** | "EVERY PIXEL IS A MATERIAL. EVERY SCROLL IS A MOMENT." with a ghosted echo/trail (motion-blur text). Floating red media tile with a glitch slice. Background goes from mid-grey to charcoal. |
| 7.8–9.0 s | **Services** | A numbered list (Art Direction / Web Design / 3D and Motion / Development) with hairline dividers and one-line descriptions; the first row is expanded. A chrome chain passes diagonally in the **foreground** (z-depth parallax over the DOM). A white card with a red object sits to the right. |
| 9.0–10.3 s | **"Recent launches"** | Darkness, then a red ambient glow. Outlined/chromatic heading text. Projects appear as **floating 3D cards at different depths**. |
| 10.3–15.5 s | **Project gallery flight** | The camera travels through a field of tilted cards. The colour grade alternates **red ↔ cyan** (duotone), with chromatic aberration and heavy motion blur. Chains turn cyan and a vertical chain drops with a spike pendant. |
| 15.5–16.5 s | Transition | Fade to a deep red radial gradient; the chain exits. |
| 16.5–18.4 s | **Contact CTA** | "LET'S MAKE SOMETHING PEOPLE WANT TO TOUCH." in cyan with a glitch/outline treatment (scramble or RGB-split), and a cyan pill CTA. A **hanging ID badge on a lanyard** swings at the right *(inferred: rope physics)*. |
| 18.44 s | Loop | A hard cut back to the intro (the only scene cut detected). |

## Design language

- **Structure:** a high-key, light hero → progressively darker sections → a near-black, red-lit finale. **Light-to-dark descent as narrative.**
- **Typography:** two registers only. A massive wordmark used as architecture (not a heading), and small, uppercase, tracked UI and body text. Very little in between.
- **Colour:** a neutral greyscale base plus **one hot accent (red)** and, late in the page, **one cold counter-accent (cyan)**. The colour changes are scroll-driven and act as chapter markers.
- **Materiality:** chrome, glossy plastics and metal, which is the literal "websites you can feel" promise. Tactility is the concept, and every section pays it off.
- **One recurring 3D motif** (chains plus a spiked star) threads the whole page, so the sections read as one continuous world rather than stacked blocks.
- **Restraint in the DOM:** the layouts are simple (left-aligned copy, lists, cards). The spectacle lives in one WebGL layer.

## Technique map (how to reproduce the *class* of effect)

| Effect | Likely implementation | Skills |
|---|---|---|
| Cube vortex → sphere → ring | One `InstancedMesh` (rounded boxes). Per-instance targets (vortex spiral → Fibonacci sphere → torus) interpolated on the GPU or via a GSAP-tweened progress uniform; instance colours tweened for the colour wave. | `threejs-geometry`, `threejs-shaders`, `advanced-gsap-animation` |
| Chrome chains | Instanced torus links placed along a `CatmullRomCurve3`, with sway from noise; or a real rope via `@react-three/rapier` joints. Material: `MeshPhysicalMaterial` (metalness 1, low roughness) **plus a self-hosted HDR environment** (without one, chrome renders black, as confirmed in the smoke test). | `threejs-materials`, `threejs-lighting`, `threejs-react-three-fiber` |
| Type interleaved with 3D | Render the wordmark *inside* WebGL (troika/drei `<Text>` or extruded geometry) so depth sorting handles front and back; or split it into two DOM layers sandwiching the canvas, with a depth mask. | `interactive-3d-portfolio` |
| One persistent world across sections | A single fixed `<Canvas>` behind the DOM; scroll progress (ScrollTrigger + Lenis on one ticker) drives camera path, object states, background and fog colour per chapter. | `build-threejs-scroll-worlds`, `cinematic-web-development` |
| Red ↔ cyan grading, chromatic aberration, blur | Postprocessing: ChromaticAberration + Bloom + Noise, plus a scroll-driven colour-grade uniform (hue/duotone LUT). Motion blur can be faked with velocity-scaled CA. | `threejs-postprocessing` |
| Ghost/echo manifesto text | SplitText lines plus 2–3 offset, low-opacity clones animated with lag (or a velocity-reactive text-shadow trail). | `advanced-gsap-animation` |
| Floating project cards in 3D | Textured planes (project media) placed in depth; camera dolly on scroll; raycast hover tilt; DOM list mirror for access. | `interactive-3d-portfolio`, `threejs-interaction` |
| Glitch CTA headline | GSAP ScrambleText or RGB-split clones with clip-path slices, triggered once on enter. | `gsap-plugins` |
| Hanging lanyard badge | `@react-three/rapier` rope joints + `meshline` band + a card mesh; draggable. A well-known open R3F pattern. | `threejs-react-three-fiber` |
| Smooth scroll | Lenis driven by `gsap.ticker`. | `cinematic-gsap-lenis-motion-system` |

**Performance reality:** this class of site is heavy (a persistent WebGL scene, postprocessing, physics). Matching it responsibly requires quality tiers, a static poster fallback, lazy-loaded 3D chunks and a mobile tier without postprocessing or physics (see `interactive-3d-portfolio`).

## Originality guardrails (what we must not take)

Do **not** reuse: the chains + spiked-star motif, the red/cyan scheme as a pair, a giant bottom-cropped wordmark composition with identical layout, their copy ("websites you can feel", "every pixel is a material…", "something people want to touch"), or their badge design. These are weblove's identity.

**Take the principles:**
1. A single, tactile material concept carried through every section.
2. One persistent 3D motif connecting chapters (yours must come from *your* story).
3. A scroll-driven colour/lighting descent that marks chapters.
4. Massive type as architecture vs. tiny UI text, with nothing in between.
5. Simple DOM layouts with the spectacle concentrated in one WebGL layer.
6. A finale that is physically interactive, inviting touch before the CTA.

The reusable process is captured in the skill `.claude/skills/reference-video-analysis/`.
