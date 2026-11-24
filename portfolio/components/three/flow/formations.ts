import * as THREE from "three";

/**
 * THE DIGITAL FLOW — formations.
 * Every particle has stable identity attributes (t along the flow, u/v across it,
 * a role, a seed). Each formation maps that identity to a position + brightness,
 * packed into an RGBA float texture. The shader morphs between two textures as a
 * pure function of scroll, so scrubbing backwards replays exactly.
 */

export const CHAPTER_FORMATIONS = ["ribbon", "loop", "interface", "gallery", "orbits", "portal"] as const;
export type FormationName = "signal" | (typeof CHAPTER_FORMATIONS)[number];

export interface FlowData {
  count: number;
  size: number; // texture side
  attributes: { aRef: Float32Array; aT: Float32Array; aSeed: Float32Array; aSize: Float32Array; aCore: Float32Array };
  textures: Record<FormationName, THREE.DataTexture>;
}

// ---------- deterministic randomness
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gaussFrom = (r: () => number) => {
  let u = 0;
  let v = 0;
  while (!u) u = r();
  while (!v) v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

interface P {
  t: number; // 0..1 along flow
  u: number; // gaussian across width
  v: number; // gaussian across thickness
  q: number; // role selector 0..1
  k: number; // secondary random 0..1
  dust: [number, number, number];
  core: boolean;
  isDust: boolean;
}

// ---------- curve helpers
type V3 = [number, number, number];
class Ribbon {
  /** Arc-length lookup table: sampled once, so per-particle evaluation is O(1) */
  private pts: THREE.Vector3[];
  private normals: THREE.Vector3[];
  private binormals: THREE.Vector3[];
  private static SEG = 1024;
  constructor(points: V3[], public width: number, public twist: number, public thick = 0.08) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.5);
    this.pts = curve.getSpacedPoints(Ribbon.SEG);
    const f = curve.computeFrenetFrames(Ribbon.SEG, false);
    this.normals = f.normals;
    this.binormals = f.binormals;
  }
  at(t: number, u: number, v: number, core: boolean, out: THREE.Vector3) {
    const tt = Math.min(1, Math.max(0, t)) * Ribbon.SEG;
    const k = Math.min(Ribbon.SEG - 1, Math.floor(tt));
    out.copy(this.pts[k]!).lerp(this.pts[k + 1]!, tt - k);
    const N = this.normals[k]!;
    const B = this.binormals[k]!;
    const a = (tt / Ribbon.SEG) * Math.PI * 2 * this.twist;
    const uu = u * this.width * (core ? 0.07 : 0.45);
    const vv = v * this.thick * (core ? 0.5 : 1);
    out.addScaledVector(N, uu * Math.cos(a) - vv * Math.sin(a)).addScaledVector(B, uu * Math.sin(a) + vv * Math.cos(a));
    return Math.min(1, Math.abs(u) * 0.45); // edge factor
  }
}

const tmp = new THREE.Vector3();

// ---------- formation builders: (particle, out) → brightness
type Builder = (p: P, out: THREE.Vector3) => number;

function signal(): Builder {
  return (p, out) => {
    if (p.isDust) {
      out.set(...p.dust);
      return 0.3;
    }
    // A sparse sphere of points far around the camera: the scattered "signal".
    const r = 9 + p.k * 15;
    const th = p.t * Math.PI * 2 * 7.13;
    const ph = Math.acos(1 - 2 * ((p.q * 7.77) % 1));
    out.set(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.62, -4 - r * Math.sin(ph) * Math.abs(Math.sin(th)) * 0.9);
    return 0.42;
  };
}

function ribbonOnly(rb: Ribbon): Builder {
  return (p, out) => {
    if (p.isDust) {
      out.set(...p.dust);
      return 0.3;
    }
    const e = rb.at(p.t, p.u, p.v, p.core, out);
    return p.core ? 1.25 : 0.95 - e * 0.35;
  };
}

function interfaceF(portrait: boolean): Builder {
  const floor = portrait
    ? new Ribbon([[-6, -5.6, -3], [-3, -5.1, -1], [0, -5.3, 0], [3, -5.1, -1], [6, -5.6, -3]], 0.6, 2)
    : new Ribbon([[-16, -4.4, -6], [-10, -3.6, -2], [-6, -3.8, 0], [-2, -3.3, 0.5], [2, -3.6, 0.5], [6, -3.8, 0], [10, -3.6, -2], [16, -4.4, -6]], 0.8, 2);
  const panels = portrait
    ? ([[-1.45, 1.75, 0, 0.25], [1.45, 0.9, 0, -0.25], [-1.45, -1.6, 0, 0.25], [1.45, -2.45, 0, -0.25]] as const)
    : ([[-7.2, -0.6, -0.86, 0.42], [-2.45, -0.3, -0.29, 0.14], [2.45, -0.3, -0.29, -0.14], [7.2, -0.6, -0.86, -0.42]] as const);
  const [pw, ph] = portrait ? [2.5, 2.3] : [4.0, 4.6];
  // glyph segments in panel-local unit space (-.5..+.5)
  const glyphs: [number, number, number, number][][] = [
    // 01 layout grid
    [[-0.4, 0.38, 0.4, 0.38], ...grid2x2()],
    // 02 code lines
    Array.from({ length: 7 }, (_, k) => {
      const y = 0.3 - k * 0.1;
      const ind = [0, 0.07, 0.14, 0.14, 0.07, 0.14, 0][k]!;
      return [-0.38 + ind, y, -0.38 + ind + 0.25 + ((k * 13) % 7) / 18, y] as [number, number, number, number];
    }),
    // 03 cube wireframe (projected)
    cube(),
    // 04 chat bubbles
    [[-0.35, 0.22, 0.1, 0.22], [-0.35, 0.1, 0.1, 0.1], [-0.35, 0.22, -0.35, 0.1], [0.1, 0.22, 0.1, 0.1],
     [-0.1, 0.0, 0.35, 0.0], [-0.1, -0.12, 0.35, -0.12], [-0.1, 0.0, -0.1, -0.12], [0.35, 0.0, 0.35, -0.12],
     [-0.35, -0.22, 0.05, -0.22], [-0.35, -0.34, 0.05, -0.34], [-0.35, -0.22, -0.35, -0.34], [0.05, -0.22, 0.05, -0.34]],
  ];
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const one = new THREE.Vector3(1, 1, 1);
  return (p, out) => {
    if (p.isDust) {
      out.set(...p.dust);
      return 0.25;
    }
    if (p.q < 0.36) {
      const e = floor.at(p.t, p.u, p.v, p.core, out);
      return p.core ? 1.2 : 0.9 - e * 0.3;
    }
    const idx = Math.floor(p.k * 4) % 4;
    const [x, y, z, ry] = panels[idx]!;
    q.setFromAxisAngle(tmp.set(0, 1, 0), ry);
    m.compose(new THREE.Vector3(x, y, z), q, one);
    if (p.q < 0.7) {
      // outline: walk perimeter by t
      const per = 2 * (pw + ph);
      let d = ((p.t * 3.7) % 1) * per;
      let lx: number, ly: number;
      if (d < pw) { lx = d - pw / 2; ly = ph / 2; }
      else if ((d -= pw) < ph) { lx = pw / 2; ly = ph / 2 - d; }
      else if ((d -= ph) < pw) { lx = pw / 2 - d; ly = -ph / 2; }
      else { d -= pw; lx = -pw / 2; ly = -ph / 2 + d; }
      out.set(lx + p.u * 0.008, ly + p.v * 0.008, 0.04).applyMatrix4(m);
      return 1.05;
    }
    const segs = glyphs[idx]!;
    const s = segs[Math.floor(((p.t * 9.31) % 1) * segs.length)]!;
    const f = (p.k * 17.3) % 1;
    out.set((s[0] + (s[2] - s[0]) * f) * pw, (s[1] + (s[3] - s[1]) * f) * ph, 0.09).applyMatrix4(m);
    return 0.85;
  };
}
function grid2x2(): [number, number, number, number][] {
  const r: [number, number, number, number][] = [];
  for (const cx of [-0.2, 0.2])
    for (const cy of [0.1, -0.24]) {
      const w = 0.16, h = 0.13;
      r.push([cx - w, cy + h, cx + w, cy + h], [cx - w, cy - h, cx + w, cy - h], [cx - w, cy + h, cx - w, cy - h], [cx + w, cy + h, cx + w, cy - h]);
    }
  return r;
}
function cube(): [number, number, number, number][] {
  const e = new THREE.Euler(0.5, 0.7, 0);
  const V = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].map((v) =>
    new THREE.Vector3(v[0], v[1], v[2]).multiplyScalar(0.2).applyEuler(e),
  );
  const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  return E.map(([a, b]) => [V[a!]!.x, V[a!]!.y, V[b!]!.x, V[b!]!.y]);
}

function gallery(portrait: boolean): Builder {
  const rb = portrait
    ? new Ribbon([[-5, -9, -14], [-2, -4, -11], [1.5, -1, -9], [-1, 3, -11], [3, 8, -16]], 1.4, 1.2)
    : new Ribbon([[-14, -5, -16], [-6, -2, -12], [0, -3.5, -9], [6, -1, -12], [14, 2, -18]], 1.6, 1.2);
  const [fw, fh] = portrait ? [3.3, 4.2] : [7.6, 4.75];
  return (p, out) => {
    if (p.isDust) {
      out.set(...p.dust);
      return 0.25;
    }
    if (p.q < 0.78) {
      const e = rb.at(p.t, p.u, p.v, p.core, out);
      return p.core ? 1.3 : 0.9 - e * 0.3;
    }
    const per = 2 * (fw + fh);
    let d = p.t * per;
    let x: number, y: number;
    if (d < fw) { x = d - fw / 2; y = fh / 2; }
    else if ((d -= fw) < fh) { x = fw / 2; y = fh / 2 - d; }
    else if ((d -= fh) < fw) { x = fw / 2 - d; y = -fh / 2; }
    else { d -= fw; x = -fw / 2; y = -fh / 2 + d; }
    out.set(x + p.u * 0.01, y + 0.2 + p.v * 0.01, 0.05);
    return 0.8;
  };
}

function orbits(portrait: boolean): Builder {
  const radii = portrait ? [1.9, 2.8, 3.6] : [3.2, 5.4, 7.8];
  const tilts = [0.25, -0.12, 0.08];
  const flatten = portrait ? 0.9 : 0.55;
  const rb = portrait
    ? new Ribbon([[-4, -9, -3], [-2.5, -6, 0], [0, -4.8, 0.5], [2.5, -6, -1], [4, -9, -4]], 0.5, 3)
    : new Ribbon([[-14, -7, -3], [-8, -4.5, 0], [-3.5, -2.6, 1], [0, -2.2, 0], [4, -2.8, -2], [9, -4, -6], [15, -5, -10]], 0.6, 3);
  return (p, out) => {
    if (p.isDust) {
      out.set(...p.dust);
      return 0.25;
    }
    if (p.q < 0.22) {
      // core sphere
      tmp.set(p.u, p.v, Math.cos(p.k * Math.PI * 2) * 1.2 + Math.sin(p.t * 40)).normalize();
      out.copy(tmp).multiplyScalar((portrait ? 0.8 : 1.1) + Math.abs(p.v) * 0.25);
      return 1.0;
    }
    if (p.q < 0.8) {
      const o = Math.floor(p.k * 3) % 3;
      const a = p.t * Math.PI * 2;
      const r = radii[o]!;
      out.set(Math.cos(a) * r, p.v * 0.15, Math.sin(a) * r * flatten).applyAxisAngle(tmp.set(1, 0, 0), tilts[o]!);
      return 0.55;
    }
    const e = rb.at(p.t, p.u, p.v, p.core, out);
    return p.core ? 1.1 : 0.8 - e * 0.3;
  };
}

function portal(portrait: boolean): Builder {
  const rb = portrait
    ? new Ribbon([[-4, -9, 4], [-2.5, -5, 2], [-1, -2, 0], [-0.3, -0.4, -6], [0, 0, -30]], 0.7, 4)
    : new Ribbon([[-12, -6, 4], [-6, -4, 2], [-3, -2, 0], [-1, -0.6, -6], [0, 0, -30]], 0.9, 4);
  const [sx, sy] = portrait ? [0.78, 1.32] : [1.3, 0.85];
  return (p, out) => {
    if (p.isDust) {
      out.set(...p.dust);
      return 0.25;
    }
    if (p.q < 0.68) {
      const ring = Math.floor(p.k * 18);
      const a = p.t * Math.PI * 2;
      const r = 3.6 - ring * 0.04;
      out.set(Math.cos(a) * r * sx + p.u * 0.02, Math.sin(a) * r * sy + p.v * 0.02, -ring * 2.6);
      return ring % 4 === 0 ? 1.25 : 0.8;
    }
    if (p.q < 0.8) {
      out.set(p.u * 0.5, p.v * 0.5, -44 - p.k * 4);
      return 1.6;
    }
    const e = rb.at(p.t, p.u, p.v, p.core, out);
    return p.core ? 1.2 : 0.85 - e * 0.3;
  };
}

function builders(portrait: boolean): Record<FormationName, Builder> {
  return {
    signal: signal(),
    ribbon: ribbonOnly(
      portrait
        ? new Ribbon([[-3.4, -9, -4], [-1.7, -4.6, -1], [1.5, -1.8, 1.4], [-1.2, 1.3, 1.5], [1.5, 4.4, -1], [3.4, 9, -5]], 0.85, 1.6)
        : new Ribbon([[-14, -2.5, -4], [-7, 1.6, -1], [-2, -0.6, 1.2], [2.5, -1.4, 1.6], [6.5, 1.2, -1], [11, 3.2, -5], [16, 1, -9]], 1.1, 1.6),
    ),
    loop: ribbonOnly(
      portrait
        ? new Ribbon([[-4, -9, -6], [-1.5, -5, -2], [1, -2, 0], [2.2, 1.5, -1], [1, 4.5, -4], [-1.5, 5.5, -8], [-2, 2.5, -7], [0.5, 0, -4], [3, 3, -2], [4.5, 9, -3]], 1.0, 3.2)
        : new Ribbon([[-9, -6, -6], [-2, -3.5, -2], [3, -1, 0], [6, 2.6, -1], [8, 5, -4], [6, 7, -8], [1, 5, -10], [2, 1, -7], [7, -1, -4], [13, -2, -2], [18, 0, -3]], 1.3, 3.2),
    ),
    interface: interfaceF(portrait),
    gallery: gallery(portrait),
    orbits: orbits(portrait),
    portal: portal(portrait),
  };
}

export function buildFlow(count: number, portrait: boolean): FlowData {
  const size = Math.ceil(Math.sqrt(count));
  const rnd = mulberry(1987);
  const aRef = new Float32Array(count * 2);
  const aT = new Float32Array(count);
  const aSeed = new Float32Array(count);
  const aSize = new Float32Array(count);
  const aCore = new Float32Array(count);
  const particles: P[] = [];
  const box = portrait ? [14, 24, 30] : [40, 24, 30];

  for (let i = 0; i < count; i++) {
    const q = rnd();
    const core = q < 0.14;
    const isDust = q > 0.93;
    const p: P = {
      t: rnd(),
      u: gaussFrom(rnd),
      v: gaussFrom(rnd),
      q: rnd(),
      k: rnd(),
      dust: [(rnd() - 0.5) * box[0]!, (rnd() - 0.5) * box[1]!, -20 + rnd() * 24], // z ∈ [-20, 4]: never near the lens
      core,
      isDust,
    };
    particles.push(p);
    aRef[i * 2] = ((i % size) + 0.5) / size;
    aRef[i * 2 + 1] = (Math.floor(i / size) + 0.5) / size;
    aT[i] = p.t;
    aSeed[i] = rnd();
    aCore[i] = core ? 1 : 0;
    aSize[i] = core ? 1.6 + rnd() * 1.4 : isDust ? 0.4 + rnd() * 0.6 : 0.6 + rnd() * 1.2;
  }

  const b = builders(portrait);
  const out = new THREE.Vector3();
  const textures = {} as Record<FormationName, THREE.DataTexture>;
  (Object.keys(b) as FormationName[]).forEach((name) => {
    const data = new Float32Array(size * size * 4);
    const fn = b[name];
    for (let i = 0; i < count; i++) {
      const w = fn(particles[i]!, out);
      data[i * 4] = out.x;
      data[i * 4 + 1] = out.y;
      data[i * 4 + 2] = out.z;
      data[i * 4 + 3] = w;
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    tex.minFilter = tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    textures[name] = tex;
  });

  return { count, size, attributes: { aRef, aT, aSeed, aSize, aCore }, textures };
}
