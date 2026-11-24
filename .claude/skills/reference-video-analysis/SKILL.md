---
name: reference-video-analysis
description: Analyse a reference video or screen recording of a website (or a social clip of one) frame by frame with ffmpeg, produce a timeline breakdown, design-language summary, technique map to the installed skills, uncertainty log and originality guardrails. Use when the user shares a reference video/GIF/screen recording of a site they like, asks to "analyse this reference", or wants to reach a similar quality level without copying.
---

# Reference Video Analysis

The goal is **to understand techniques and principles well enough to create original work at the same level**. It is never to clone a site. Be explicit about what you can and cannot see. If you can't access the file, say so plainly. Never describe a video you haven't inspected.

## 1. Locate and probe

```bash
find . -maxdepth 3 -iname '*.mp4' -o -iname '*.mov' -o -iname '*.webm' -o -iname '*.gif'   # also check uploads dir
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of compact "$F"
```

Record the resolution, orientation, duration and fps. Portrait 1170×2532 or similar means a phone capture.

**Classify the source**, because it changes how much you can trust the details:
- *Direct screen recording of the site*: layout, type and timing are reliable.
- *Camera filming a screen or a social repost* (TikTok/Reels UI, perspective skew, reflections, motion blur): only the structure and techniques are reliable. Timing, colour and type are approximate, and the clip may be edited or sped up.

## 2. Extract frames (store in the scratchpad; commit only small evidence sheets)

```bash
O=<scratchpad>/video; mkdir -p $O/f
ffmpeg -v error -i "$F" -vf "fps=4,scale=390:-1" $O/f/%03d.jpg                                  # dense frames
ffmpeg -v error -i "$F" -vf "fps=4,scale=234:-1,tile=10x2:padding=4:color=gray" $O/sheet_%02d.jpg   # 5 s per sheet
ffmpeg -v info  -i "$F" -vf "select='gt(scene,0.25)',showinfo" -an -f null - 2>&1 | grep -oE 'pts_time:[0-9.]+'   # hard cuts
# full-res crops of key moments (adjust crop to the screen area):
ffmpeg -v error -ss <t> -i "$F" -frames:v 1 -vf "crop=W:H:X:Y,scale=500:-1" $O/k_<t>.jpg
```

View every contact sheet with the Read tool, then pull full-resolution crops wherever text, type or 3D detail matters. Few scene cuts means continuous scroll. Many means an edited montage.

## 3. Write the breakdown (`docs/research/<name>-breakdown.md`)

1. **Source facts**: what the file is, its limits, and what couldn't be determined.
2. **Timeline table**: time → section → what happens (entrance, transformation, idle, handoff).
3. **Design language**: structure and narrative arc, typographic registers, colour logic, materiality, recurring motif, and what stays simple.
4. **Technique map**: effect → likely implementation → which installed skills cover it. Mark guesses *(inferred)*, and consider that some "3D" may be pre-rendered video.
5. **Performance reality**: what this costs, and how to tier it for mobile and reduced motion.
6. **Originality guardrails**: list the reference's identity elements that must *not* be reused (motifs, palette pairing, signature compositions, copy, logos), then the transferable **principles**.

Save 1–2 small contact sheets (≤ 1 MB total) next to the doc as evidence. Never commit the source video or anything from it beyond analysis stills.

## 4. Transform principles into an original direction

For each principle, ask: *what is the equivalent that comes from this client's own story?*

| Reference principle | Ask | Example transformation |
|---|---|---|
| One tactile material concept | What material or metaphor is true to this person's work? | A developer's "signal/terminal" or "light through glass" instead of chrome chains |
| Persistent 3D motif | What object could thread *their* sections? | A particle field that re-forms into each project's shape |
| Colour descent as chapters | What journey does their story have? | Night → dawn, or monochrome → single accent at the CTA |

Hand the result to `portfolio-art-direction`, which owns the final direction document and user approval.

## 5. Quality bar

- [ ] Every claim about the reference comes from a frame you viewed. Uncertainties are labelled.
- [ ] The technique map names concrete APIs and installed skills, not vague "use WebGL".
- [ ] The guardrails list the reference's identity elements explicitly.
- [ ] The proposed direction would not be mistaken for the reference by someone who knows it.

See [references/technique-catalog.md](references/technique-catalog.md) for implementation notes on effects seen in premium 3D scroll sites.
