/** Digital Flow point shader. Positions come from formation textures, never from CPU per frame. */

export const flowVertex = /* glsl */ `
uniform sampler2D uSignal;
uniform sampler2D uA;
uniform sampler2D uB;
uniform float uMix;
uniform float uIntro;
uniform float uTime;
uniform float uMotion;      // 0 = static tier (no drift/pulses)
uniform float uSize;
uniform float uPixelRatio;
uniform float uFade;
uniform vec2  uPointer;
uniform float uPointerStrength;
uniform float uAspect;
uniform vec3  uAccent;
uniform vec3  uSilver;

attribute vec2  aRef;
attribute float aT;
attribute float aSeed;
attribute float aSize;
attribute float aCore;

varying vec3  vColor;

float easeInOut(float x) { return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) * 0.5; }

void main() {
  vec4 A = texture2D(uA, aRef);
  vec4 B = texture2D(uB, aRef);
  vec4 S = texture2D(uSignal, aRef);

  // Chapter morph with per-particle stagger + a gentle outward arc mid-flight
  float m = easeInOut(clamp((uMix - aSeed * 0.35) / 0.65, 0.0, 1.0));
  vec3 pos = mix(A.xyz, B.xyz, m);
  float bright = mix(A.w, B.w, m);
  vec3 dir = normalize(vec3(sin(aSeed * 91.7), cos(aSeed * 47.3), sin(aSeed * 13.1)) + 1e-4);
  pos += dir * sin(m * 3.14159) * 0.55 * (1.0 - aCore * 0.6);

  // Opening: scattered signal gathers into the formation
  float ig = clamp((uIntro - aSeed * 0.45) / 0.55, 0.0, 1.0);
  ig = 1.0 - pow(1.0 - ig, 3.0);
  pos = mix(S.xyz, pos, ig);
  bright *= mix(0.4, 1.0, ig);

  // Life: tiny drift
  float t = uTime;
  pos += uMotion * vec3(sin(t * 0.6 + aSeed * 40.0), cos(t * 0.5 + aSeed * 30.0), sin(t * 0.4 + aSeed * 20.0)) * (0.04 + 0.05 * (1.0 - aCore));

  // Flow: pulses of light travelling along the ribbon
  float ph = fract(aT * 5.0 - t * 0.07);
  float pulse = uMotion * smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.03, 0.16, ph)) * ig;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);

  // Pointer: particles part around the cursor (screen space)
  vec4 clip = projectionMatrix * mv;
  vec2 ndc = clip.xy / clip.w;
  vec2 d = (ndc - uPointer) * vec2(uAspect, 1.0);
  float infl = smoothstep(0.3, 0.0, length(d)) * uPointerStrength;
  mv.xy += normalize(d + 1e-5) * infl * (-mv.z) * 0.035;

  gl_Position = projectionMatrix * mv;

  float size = aSize * (1.0 + pulse * 0.9);
  gl_PointSize = size * uSize * uPixelRatio * (34.0 / -mv.z);

  float fade = clamp((-mv.z - 4.0) / uFade, 0.0, 1.0);
  // Red reads as light only with a hot core: near-white centre, saturated red halo, few neutral motes.
  // (Mixing red toward silver gives pink, so the neutral share is kept small.)
  vec3 hot = mix(uAccent, vec3(1.0, 0.93, 0.9), 0.6);
  float neutral = step(0.86, fract(aSeed * 7.31));                 // ~14% silver motes for depth
  vec3 col = mix(uAccent, uSilver, neutral * (1.0 - aCore));
  col = mix(col, hot, aCore * 0.65);
  col = mix(col, hot, pulse * 0.7);
  bright *= mix(1.25, 1.0, neutral);                                // red carries less luminance than lime did
  vColor = col * bright * (1.0 - fade * 0.7) * (1.0 + pulse * 0.55 + infl * 0.6);
}
`;

export const flowFragment = /* glsl */ `
varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  gl_FragColor = vec4(vColor, a * 0.85);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
