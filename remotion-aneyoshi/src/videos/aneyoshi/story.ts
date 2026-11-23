// Timeline of the Aneyoshi short: shots timed to the approved script
// (stories/tsunami-jepang-aneyoshi/SCRIPT.md), ~233 words, ~63 s at 3.7 words/s.
// No words.json yet: beats are timed from the word counts, so the first VO pass
// may shift shot boundaries by a few frames. Camera grammar from the bridge short:
// continuous slow push-ins; symmetric ease-in-out moves ~23 f; big reframes are cuts;
// impacts are 7-frame kicks that flip sign every frame; no hand-held float.
export const FPS = 30;
export const TOTAL = 1890; // 63 s
export const D0 = 11.3; // village terrace height (m) — ground level at the stone
export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 4;

// ---------------- the valley ----------------
// A steep Pacific valley: sea at z <= -90, a road climbing the valley floor to the
// village terrace at z >= 0, hills behind the village. The stone stands on the terrace.
export const groundY = (z: number): number => {
  if (z <= -90) return 0;
  if (z < 0) return 0.5 + (z + 90) * 0.12; // 0.5 .. 11.3 up the valley
  if (z <= 60) return 11.3 + z * 0.02; // 11.3 .. 12.5, the terrace
  return 12.5 + (z - 60) * 0.25; // hills behind the village
};
/** the tsunami stone, hero prop: on the roadside at the terrace edge */
export const STONE: V3 = [2.5, groundY(6), 6];
/** blue paint line on the road: the 2011 water's farthest reach, 90 m short of the stone */
export const BLUE_LINE_Z = -25;
/** hillside height: the valley floor plus a 30 m rise from |x| = 45 out to |x| = 160 */
export const hillY = (x: number, z: number) => groundY(Math.min(z, 60)) + (Math.max(0, Math.abs(x) - 45) / 115) * 30;
/** two more tsunami stones on the east hillside (shot 12): the surveyors work beside them */
export const STONES_EAST: V3[] = [
  [52, hillY(52, 30), 30], [58, hillY(58, 38), 38], [48, hillY(48, 44), 44],
];

// ---------------- the wave (tau = story time in seconds) ----------------
export const WAVE_T0 = 28.5; // water starts climbing the valley (shot 7)
export const WAVE_T1 = 32.6; // water stops, 90 m short of the stone (shot 8)
export const WAVE_T2 = 36.5; // water has receded to the sea
/** 0 .. 1 .. 0: climb, hold, recede */
export const waveU = (tau: number) => {
  if (tau < WAVE_T0) return 0;
  if (tau < WAVE_T1) return smooth((tau - WAVE_T0) / (WAVE_T1 - WAVE_T0));
  if (tau < WAVE_T1 + 2) return 1;
  if (tau < WAVE_T2) return 1 - smooth((tau - WAVE_T1 - 2) / (WAVE_T2 - WAVE_T1 - 2));
  return 0;
};
export const waveFrontZ = (tau: number) => -90 + (BLUE_LINE_Z + 90) * waveU(tau);
export const waterY = (tau: number) => groundY(waveFrontZ(tau)) + 0.4;
export const waveH = (tau: number) => 2 + 6 * waveU(tau); // stylised wall height above the waterline

/** quake envelope (shot 6, tau 22.8-28.5): drives the camera kicks, not the ground */
export const QUAKE_T0 = 22.8, QUAKE_T1 = 28.5;
export const quakeU = (tau: number) => (tau < QUAKE_T0 || tau >= QUAKE_T1 ? 0 : 0.6 + 0.4 * Math.sin((tau - QUAKE_T0) * 2.1));

/** wave pose per shot: {front, y, h} | null (no wall; calm sea). Shots 3 and 11 pose a
 *  fixed dramatic wall (1933 flashback / shallow-water explanation); shot 6 shows the
 *  sea pulled back; shot 10 a low swell far out; shots 7-8 follow the tau-driven wave. */
export type WavePose = { front: number; y: number; h: number } | null;
export const wavePose = (id: number, t: number): WavePose => {
  const s = SHOTS[id - 1], tau = s.tau(t);
  if (id === 3) return { front: -45, y: groundY(-45) + 0.4, h: 9 }; // 1933: the wall that wiped the shore village
  if (id === 6) return { front: -115, y: 0.2, h: 1.5 }; // quake: the sea has pulled back, seabed exposed
  if (id === 7 || id === 8) { const u = waveU(tau); return u <= 0 ? null : { front: waveFrontZ(tau), y: waterY(tau), h: waveH(tau) }; }
  if (id === 10) return { front: -260, y: 0.3, h: 2 }; // deep sea: a low swell, far away
  if (id === 11) return { front: -95, y: 0.6, h: 11 }; // shallow water: the same swell grown tall
  return null;
};

// ---------------- shots ----------------
export type Light = "day" | "golden";
export type Crowd = "none" | "survivors" | "villagers" | "flee" | "kimura";
export type ShotDef = { id: number; a: number; b: number; light: Light; crowd: Crowd; tau: (t: number) => number };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 65, light: "day", crowd: "none", tau: (t) => t }, // hook: stone CU
  { id: 2, a: 65, b: 180, light: "golden", crowd: "survivors", tau: (t) => t }, // setting 1896: old shore village
  { id: 3, a: 180, b: 293, light: "golden", crowd: "survivors", tau: (t) => t }, // setting 1933: the wave returns
  { id: 4, a: 293, b: 512, light: "golden", crowd: "survivors", tau: (t) => t }, // action 1: carving the stone
  { id: 5, a: 512, b: 683, light: "day", crowd: "villagers", tau: (t) => t }, // action 2: the village above the stone
  { id: 6, a: 683, b: 854, light: "day", crowd: "flee", tau: (t) => t }, // action 3: the quake
  { id: 7, a: 854, b: 983, light: "day", crowd: "flee", tau: (t) => t }, // action 4: the water climbs
  { id: 8, a: 983, b: 1097, light: "day", crowd: "kimura", tau: (t) => t }, // snap: the water stops
  { id: 9, a: 1097, b: 1250, light: "day", crowd: "kimura", tau: (t) => t }, // deadpan: stone + Kimura
  { id: 10, a: 1250, b: 1400, light: "day", crowd: "none", tau: (t) => t }, // explanation a: deep sea
  { id: 11, a: 1400, b: 1559, light: "day", crowd: "none", tau: (t) => t }, // explanation b: shallow water
  { id: 12, a: 1559, b: 1697, light: "day", crowd: "villagers", tau: (t) => t }, // consequence: stones on the hills
  { id: 13, a: 1697, b: TOTAL, light: "golden", crowd: "villagers", tau: (t) => t }, // callback: sunset, crane out
];
/** crossfades (frames) at place/time changes; a white 4-frame flash after the hook */
export const XFADE: Record<number, number> = { 2: 6, 5: 8, 10: 8, 13: 8 };
export const FLASH_AT = 65;

export const shotAt = (f: number) => SHOTS.find((s) => f >= s.a && f < s.b) ?? SHOTS[SHOTS.length - 1];
/** layers to draw at frame f: base shot, plus the next shot fading in during a crossfade */
export const layersAt = (f: number): { id: number; alpha: number }[] => {
  for (const s of SHOTS) {
    const x = XFADE[s.id];
    if (x && f >= s.a - x / 2 && f < s.a + x / 2) return [{ id: s.id - 1, alpha: 1 }, { id: s.id, alpha: (f - (s.a - x / 2) + 1) / (x + 1) }];
  }
  return [{ id: shotAt(f).id, alpha: 1 }];
};

// ---------------- camera ----------------
// Grammar (bridge story.ts): every move is a symmetric smootherstep glide of 18-40 f; a reframe bigger than about
// half a frame width or 40 % zoom is a hard cut on its key frame. Glides are centred on the old key frame, so a
// glide key starts dur/2 earlier. Holds push in (dolly toward the look point or a fov zoom): 0.15-0.35 %/f,
// ~0.6 %/f for ~35 f on the punch words. Rolls of 4-8 deg over >= 18 f on emphasis beats.
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
type Shot = Partial<Cam> & { pos: V3; look: V3 };
type Key = { f: number; dur?: number; cut?: boolean; s: (f: number) => Shot };
/** reference camera ease: symmetric smootherstep (attack = release, ~10 f each on a 23 f move) */
export const glide = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };
const mix = (a: Cam, b: Cam, k: number): Cam => ({
  pos: a.pos.map((v, i) => v + (b.pos[i] - v) * k) as V3, look: a.look.map((v, i) => v + (b.look[i] - v) * k) as V3,
  fov: a.fov + (b.fov - a.fov) * k, roll: a.roll + (b.roll - a.roll) * k,
});
const full = (c: Shot): Cam => ({ fov: 40, roll: 0, ...c });
const run = (keys: Key[], f: number) => {
  let cur = full(keys[0].s(f));
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.f) break;
    cur = k.cut ? full(k.s(f)) : mix(cur, full(k.s(f)), glide((f - k.f) / (k.dur ?? 24)));
  }
  return cur;
};
/** push-in factor since f0: the subject grows ~rate per frame; `punch` raises it (with 8 f soft edges) for the first n frames */
const pushK = (f: number, f0: number, rate: number, punch = 0, n = 35) => {
  const x = Math.max(0, f - f0);
  let s = rate * x;
  if (punch > rate) for (let i = 0; i < Math.min(x, n); i++) s += (punch - rate) * Math.max(0, Math.min(1, (i + 0.5) / 8, (n - i - 0.5) / 8));
  return Math.exp(-s);
};
/** dolly push: camera slides toward the look point by factor k */
const dolly = (pos: V3, look: V3, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos: [look[0] + (pos[0] - look[0]) * k, look[1] + (pos[1] - look[1]) * k, look[2] + (pos[2] - look[2]) * k], look, ...rest });
/** zoom push (camera stays put, for lenses next to houses / the stone): tan(fov/2) shrinks by k */
const zoom = (pos: V3, look: V3, fov: number, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos, look, fov: (360 / Math.PI) * Math.atan(Math.tan((fov * Math.PI) / 360) * k), ...rest });
/** a roll-only move on top of an existing framing */
const rolled = (s: (f: number) => Shot, roll: number) => (f: number): Shot => ({ ...s(f), roll });

// ---- framings (f -> camera); each pushes in from the frame its key starts ----
// shot 1 (hook): stone CU, slow push on the carved face
const S1a = (f: number) => dolly([5.4, 12.9, 1.2], [STONE[0], STONE[1] + 0.7, STONE[2]], pushK(f, 0, 0.0025), { fov: 40 });
const S1b = (f: number) => dolly([4.4, 12.5, 2.6], [STONE[0], STONE[1] + 0.65, STONE[2]], pushK(f, 28, 0.002, 0.006, 30), { fov: 36, roll: -0.03 });
// shot 2 (1896, golden): wide from the hillside down to the shore village
const S2a = (f: number) => zoom([28, 24, 35], [0, 3, -60], 44, pushK(f, 65, 0.0016));
const S2b = (f: number) => zoom([20, 20, 22], [0, 4, -50], 42, pushK(f, 122, 0.0015, 0.005, 30));
// shot 3 (1933, golden): low near the shore, the wall coming in -> closer on the wall
const S3a = (f: number) => dolly([-14, 3.5, -28], [0, 6, -48], pushK(f, 180, 0.002), { fov: 44, roll: 0.03 });
const S3b = (f: number) => dolly([-8, 4.5, -36], [0, 7, -46], pushK(f, 236, 0.0025, 0.006, 30), { fov: 38, roll: -0.03 });
// shot 4 (carving, golden): MS of the stone + carver, closer on the chisel hand
const S4a = (f: number) => dolly([6.8, 13.4, 0.2], [STONE[0], STONE[1] + 0.6, STONE[2]], pushK(f, 293, 0.002), { fov: 40 });
const S4b = (f: number) => dolly([5.2, 12.7, 2.4], [STONE[0] + 0.2, STONE[1] + 0.5, STONE[2]], pushK(f, 400, 0.0025), { fov: 36 });
// shot 5 (modern village, day): aerial over the terrace, punch on "sebelas rumah"
const S5a = (f: number) => zoom([32, 28, 48], [0, 11, 15], 44, pushK(f, 512, 0.0016));
const S5b = (f: number) => zoom([20, 22, 38], [0, 11.5, 12], 42, pushK(f, 597, 0.0015, 0.006, 35));
// shot 6 (quake, day): street level in the village, villagers looking up; shake comes from the kicks
const S6a = (f: number) => dolly([7, 13.6, 28], [0, 12.5, 8], pushK(f, 683, 0.002), { fov: 42 });
const S6b = (f: number) => dolly([5, 13.2, 22], [0, 12.8, 6], pushK(f, 768, 0.0025, 0.006, 30), { fov: 38, roll: 0.04 });
// shot 7 (the water climbs, day): high on the hill looking down the valley
const S7a = (f: number) => dolly([38, 32, 42], [0, 6, -60], pushK(f, 854, 0.0018), { fov: 44 });
const S7b = (f: number) => dolly([28, 26, 30], [0, 7, -45], pushK(f, 918, 0.002, 0.005, 30), { fov: 40, roll: -0.03 });
// shot 8 (snap, day): at the stone, looking down the road to the waterline + blue paint line
const S8a = (f: number) => dolly([STONE[0], 13.8, 12], [0, 8.5, BLUE_LINE_Z], pushK(f, 983, 0.002), { fov: 42 });
const S8b = (f: number) => dolly([STONE[0] + 0.4, 13.2, 10], [0, 8.2, BLUE_LINE_Z], pushK(f, 1040, 0.0025, 0.006, 30), { fov: 38 });
// shot 9 (deadpan, day): stone CU + Kimura beside it
const S9a = (f: number) => dolly([6.6, 13.2, 1.6], [3.4, 12.4, 7], pushK(f, 1097, 0.002), { fov: 40 });
const S9b = (f: number) => dolly([5.6, 12.9, 3.2], [3.6, 12.5, 7.2], pushK(f, 1173, 0.0025), { fov: 36, roll: 0.03 });
// shot 10 (deep sea, day): over the sea, a low swell far away
const S10a = (f: number) => dolly([12, 7, -130], [0, 2, -260], pushK(f, 1250, 0.0015), { fov: 44 });
// shot 11 (shallow water, day): low near the shore, the same swell grown tall
const S11a = (f: number) => dolly([-18, 4.5, -78], [0, 7, -96], pushK(f, 1400, 0.002), { fov: 42 });
const S11b = (f: number) => dolly([-12, 5.5, -84], [0, 8, -95], pushK(f, 1479, 0.0025, 0.006, 30), { fov: 38, roll: -0.03 });
// shot 12 (consequence, day): hillside stones + surveyors
const S12a = (f: number) => dolly([-10, 20, 8], [50, 14, 36], pushK(f, 1559, 0.0018), { fov: 42 });
const S12b = (f: number) => dolly([5, 17, 18], [52, 14.5, 34], pushK(f, 1628, 0.002), { fov: 40 });
// shot 13 (callback, golden): stone MS, then crane out over the village to the sea
const S13a = (f: number) => dolly([6, 13.5, 1], [STONE[0], STONE[1] + 0.7, STONE[2]], pushK(f, 1697, 0.002), { fov: 40 });
const S13b = (f: number) => dolly([10, 16, 8], [STONE[0], STONE[1] + 0.5, STONE[2]], pushK(f, 1780, 0.0015), { fov: 42 });
/** crane out: a curved path (quadratic Bezier) so the lens rises over the village roofs */
const CRANE: V3[] = [[14, 26, 22], [38, 34, 58], [0, 10, -20]];
const S13c = (f: number): Shot => {
  const a = S13b(1830), s = glide((f - 1830) / 60), r = 1 - s, [C, B, L] = CRANE;
  return { pos: [0, 1, 2].map((i) => r * r * a.pos[i] + 2 * s * r * C[i] + s * s * B[i]) as V3,
    look: [0, 1, 2].map((i) => a.look[i] + (L[i] - a.look[i]) * s) as V3, fov: (a.fov ?? 40) + (44 - (a.fov ?? 40)) * s, roll: 0 };
};

const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: S1a },
    { f: 28, dur: 30, s: S1b }, // centred on 43, punch on "menyelamatkan"
  ],
  2: [
    { f: 65, s: S2a },
    { f: 122, dur: 18, s: S2b },
  ],
  3: [
    { f: 180, s: S3a }, // cut on "1933"
    { f: 236, dur: 28, s: S3b }, // centred on 250, the wall
  ],
  4: [
    { f: 293, s: S4a }, // cut on "Empat penyintas"
    { f: 400, dur: 30, s: S4b }, // centred on 415, the chisel
  ],
  5: [
    { f: 512, s: S5a }, // cut (era change, under the crossfade)
    { f: 597, dur: 18, s: S5b }, // punch on "sebelas rumah"
  ],
  6: [
    { f: 683, s: S6a }, // cut on "11 Maret 2011"
    { f: 768, dur: 24, s: S6b },
  ],
  7: [
    { f: 854, s: S7a }, // cut on "Air naik dan naik"
    { f: 918, dur: 28, s: S7b },
  ],
  8: [
    { f: 983, s: S8a }, // cut on "Lalu air berhenti"
    { f: 1040, dur: 24, s: S8b }, // centred on 1052, the blue line
  ],
  9: [
    { f: 1097, s: S9a }, // cut on "Untungnya"
    { f: 1173, dur: 24, s: S9b }, // centred on 1185, "Tubby" beat -> here: "spaniel" beat -> Kimura's face
  ],
  10: [{ f: 1250, s: S10a }],
  11: [
    { f: 1400, s: S11a }, // cut on "tumbuh menjulang"
    { f: 1479, dur: 28, s: S11b },
  ],
  12: [
    { f: 1559, s: S12a },
    { f: 1628, dur: 24, s: S12b },
  ],
  13: [
    { f: 1697, s: S13a },
    { f: 1780, dur: 30, s: S13b },
    { f: 1830, cut: true, s: S13c }, // crane pull-out on its own curved path
  ],
};

// impact kicks: the image offset flips sign every frame (~3 px at 720p per unit), decays to 0 in
// 7 f, roll +-0.23 deg per unit; they start on the first frame at/after the event. No hand-held float.
// Quake hits (tau 22.8 / 24.6 / 26.4) + the wave slam (tau 32.6, when the water stops).
const KICKS: [number, number][] = [[22.8, 0.8], [24.6, 0.6], [26.4, 0.6], [32.6, 1.0]];
export const kickAt = (t: number) => {
  let a = 0;
  for (const [t0, g] of KICKS) {
    const n = Math.floor((t - t0) * FPS + 1e-6);
    if (n >= 0 && n < 7) a += g * (n % 2 ? -1 : 1) * (1 - n / 7) ** 1.5;
  }
  return a;
};
export const camAt = (id: number, f: number): Cam => {
  const c = run(CAMS[id], f), a = kickAt(f / FPS);
  if (!a) return c;
  const d: V3 = [c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]];
  const L = Math.hypot(...d), h = Math.hypot(d[0], d[2]) || 1;
  const m = (3 / 640) * Math.tan((c.fov * Math.PI) / 360) * L * a; // metres at the look distance for 3 px x a
  return { ...c, look: [c.look[0] - (d[2] / h) * m, c.look[1] + 0.6 * m, c.look[2] + (d[0] / h) * m], roll: c.roll + a * 0.004 };
};
/** frame at which the current key's move has finished (for picking billboard views per key, not per frame) */
export const keyEnd = (id: number, f: number) => {
  let e = 0;
  for (const k of CAMS[id]) if (f >= k.f) e = k.f + (k.cut ? 0 : k.dur ?? 24);
  return Math.max(f, e);
};

// ---------------- lens: depth of field + foreground framing ----------------
/** Lens blur per shot (thin lens). cInf = blur-disc radius in px at 1080x1920 for things at infinity; 0 = all sharp.
 *  Entries switch on cuts (no dur) or ramp with the camera glide they share f/dur with. focus = world point (else the
 *  camera look point). */
export type Dof = { f: number; dur?: number; cInf: number; focus?: (f: number) => V3 };
export const DOF: Dof[] = [
  { f: 0, cInf: 14, focus: () => [STONE[0], STONE[1] + 0.7, STONE[2]] }, // hook: stone CU
  { f: 28, dur: 30, cInf: 14, focus: () => [STONE[0], STONE[1] + 0.65, STONE[2]] },
  { f: 65, cInf: 0 }, // 1896 wide (golden)
  { f: 180, cInf: 10, focus: () => [0, 7, -46] }, // 1933 wave wall
  { f: 293, cInf: 12, focus: () => [STONE[0], STONE[1] + 0.6, STONE[2]] }, // carving
  { f: 512, cInf: 0 }, // modern village aerial
  { f: 683, cInf: 10, focus: () => [0, 12.5, 8] }, // quake street
  { f: 854, cInf: 0 }, // the water climbs (wide)
  { f: 983, cInf: 12, focus: () => [0, 8.2, BLUE_LINE_Z] }, // snap: the blue line
  { f: 1097, cInf: 14, focus: () => [3.6, 12.5, 7.2] }, // deadpan: Kimura's eyes
  { f: 1250, cInf: 0 }, // deep sea
  { f: 1400, cInf: 8, focus: () => [0, 8, -95] }, // shallow: the tall wall
  { f: 1559, cInf: 8, focus: () => [50, 14, 36] }, // consequence: surveyors
  { f: 1697, cInf: 5 }, // callback golden: mild, focus = look (the stone)
  { f: 1830, cInf: 0 }, // crane out sharp
];
export const dofAt = (f: number) => {
  let i = 0; while (i + 1 < DOF.length && f >= DOF[i + 1].f) i++;
  const d = DOF[i], p = DOF[Math.max(0, i - 1)];
  const k = d.dur ? Math.min(1, (f - d.f) / d.dur) : 1;
  return { cInf: p.cInf + (d.cInf - p.cInf) * k, focus: d.focus };
};
/** what the lens focuses on (DOF): the DOF table's focus point, else the camera look point */
export const focusAt = (id: number, f: number): V3 => {
  const d = dofAt(f);
  return d.focus ? d.focus(f) : camAt(id, f).look;
};

/** near framing objects: visible while a <= f < b; kit = a GLB name accepted by build.ts prop() */
// pos = base point (kitClone()'s x, y, z: the model's base sits on y), s = height in metres, yaw in radians.
// They sit at 0.3-0.5 x the focus distance and cover 10-25 % of one frame edge, never a face; they are meant to be
// in front of the lens, so build them outside prop()'s sight-line test.
export type Fg = { a: number; b: number; kit: string; pos: V3; s?: number; yaw?: number };
export const FOREGROUND: Fg[] = [
  // ranges stay inside one shot (world.ts shows an entry only inside its own shot, so crossfade layers never see it).
  // stone CU (S1a/b, focus ~3.5 m): a cedar branch in the bottom-right corner at ~1.5 m
  { a: 0, b: 65, kit: "tree_cone", pos: [7.6, groundY(0.5), 0.5], s: 2.2, yaw: 0.5 },
  // deadpan (S9a/b, focus ~3.5 m): a cedar branch in the bottom-left corner
  { a: 1097, b: 1250, kit: "tree_cone", pos: [0.2, groundY(2.5), 2.5], s: 2.0, yaw: 1.2 },
  // callback (S13a/b, focus ~5 m): a bush in the bottom-right corner, below the stone
  { a: 1697, b: 1830, kit: "plant_bushDetailed", pos: [8.5, groundY(3), 3], s: 1.4, yaw: 0.3 },
];
