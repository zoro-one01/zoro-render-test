// story.ts — Aneyoshi #2 "Garis Biru" (dunia SAMA dengan Aneyoshi #1: lembah, jalan menanjak, teras desa, batu).
// Topik: garis cat biru di jalan desa = batas air tsunami 2011; 11 rumah di atas garis batu selamat utuh.
//
// NARASI (151 kata; ~62 dtk @ 2,44 kata/dtk, laju VO Aneyoshi #1 yang terukur; TOTAL = estimasi pra-VO,
// retiming setelah VO jadi bila perlu). Frame per shot dihitung proporsional dengan jumlah kata.
//  1 HOOK        0-136     "Di jalan desa ini ada garis cat biru. Kelihatannya cuma cat."                              (11 kata)
//  2 SETTING     136-394   "Ini desa Aneyoshi, di pesisir Iwate, Jepang. Jalannya menanjak dari laut ke sebelas rumah.
//                           Dan garis biru itu melintang di tengahnya."                                                (21)
//  3 ACTION 1    394-530   "Tanggal 11 Maret 2011, gempa 9,0 mengguncang Jepang. Tanah bergetar lama."                (11)
//  4 ACTION 2    530-628   "Lalu air datang dari laut, naik menyusuri lembah."                                         (8)
//  5 ACTION 3    628-727   "Air menelan pantai, lalu jalan, meter demi meter."                                         (8)
//  6 ACTION 4    727-912   "Di atas jalan, rumah-rumah menunggu. Air masih naik, dan tidak ada yang tahu sampai mana." (15)
//  7 SNAP        912-998   "Lalu berhenti. Tepat di garis biru itu."                                                    (7)
//  8 DEADPAN     998-1195  "Untungnya, sebelas rumah di atas garis itu selamat utuh. Sialnya, garisnya baru dicat
//                           sesudah air selesai."                                                                      (16)
//  9 EXPLANATION 1195-1454 "Garis itu cuma mencatat. Peringatan aslinya sebuah batu di atas jalan.
//                           Isinya satu kalimat: jangan membangun rumah di bawah titik ini."                           (21)
// 10 CONSEQUENCE 1454-1688 "Warga menurutinya, dan air tidak pernah menyentuh satu pun atap mereka.
//                           Jalan di bawah garis basah, rumah di atasnya kering."                                      (19)
// 11 CALLBACK    1688-1860 "Ternyata itu bukan cat. Itu catatan: sampai di sini air datang, tidak lebih jauh."        (14)
//
// Grammar kamera mengikuti Aneyoshi #1: glide simetris 18-46 f (key mulai dur/2 sebelum frame target), reframe besar = cut,
// push-in pelan, punch ~0.6 %/f pada kata kunci, kick 7-11 f pada benturan, crane Bezier untuk penutup.
export const FPS = 30;
export const TOTAL = 1860; // 62.0 s — estimasi pra-VO (151 kata); retiming setelah VO jadi
export const D0 = 11.3; // village terrace height (m) — ground level at the stone
export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 4;


// ---------------- the valley (identik dengan Aneyoshi #1) ----------------
export const groundY = (z: number): number => {
  if (z <= -90) return 0;
  if (z < 0) return 0.5 + (z + 90) * 0.12; // 0.5 .. 11.3 up the valley
  if (z <= 60) return 11.3 + z * 0.02; // 11.3 .. 12.5, the terrace
  return 12.5 + (z - 60) * 0.25; // hills behind the village
};
/** the tsunami stone, hero prop: on the roadside at the terrace edge */
export const STONE: V3 = [2.5, groundY(6), 6];
/** blue paint line on the road: the 2011 water's farthest reach (hero of this episode) */
export const BLUE_LINE_Z = -25;
/** the PAINTED line itself: build.ts paints the blue quad at z -19.6..-20.4
 *  (a line at -25 would sit underwater, per the build.ts comment), so every
 *  camera / DOF look that means "the blue line" must use PAINT_Z, not
 *  BLUE_LINE_Z (which stays the wave front for waveFrontZ). */
export const PAINT_Z = -20;
export const hillY = (x: number, z: number) => groundY(Math.min(z, 60)) + (Math.max(0, Math.abs(x) - 45) / 115) * 30;
export const STONES_EAST: V3[] = [
  [52, hillY(52, 30), 30], [58, hillY(58, 38), 38], [48, hillY(48, 44), 44],
];

// ---------------- the wave (tau = story time in seconds) ----------------
export const WAVE_T0 = 17.7; // water starts climbing the valley (shot 4, f 530)
export const WAVE_T1 = 30.4; // water stops at the blue line (shot 7 snap, f 912)
export const WAVE_T2 = 39.8; // water has receded to the sea (end of shot 8, f 1195)
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
export const waveH = (tau: number) => 2 + 6 * waveU(tau);


/** quake envelope (shot 3, tau 13.1-17.7): drives the camera kicks, not the ground */
export const QUAKE_T0 = 13.1, QUAKE_T1 = 17.7;
export const quakeU = (tau: number) => (tau < QUAKE_T0 || tau >= QUAKE_T1 ? 0 : 0.6 + 0.4 * Math.sin((tau - QUAKE_T0) * 2.1));

/** wave pose per shot: {front, y, h} | null (no wall). Shot 3 = sea pulled back during the quake;
 *  shots 4-8 follow the tau-driven wave (climb 4-6, stop 7, recede 8); all other shots calm sea. */
export type WavePose = { front: number; y: number; h: number } | null;
export const wavePose = (id: number, t: number): WavePose => {
  const s = SHOTS[id - 1], tau = s.tau(t);
  if (id === 3) return { front: -115, y: 0.2, h: 1.5 };
  if (id >= 4 && id <= 8) { const u = waveU(tau); return u <= 0 ? null : { front: waveFrontZ(tau), y: waterY(tau), h: waveH(tau) }; }
  return null;
};

// ---------------- shots ----------------
export type Light = "day" | "golden";
export type Crowd = "none" | "survivors" | "villagers" | "flee" | "kimura";
export type ShotDef = { id: number; a: number; b: number; light: Light; crowd: Crowd; tau: (t: number) => number };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 136, light: "day", crowd: "none", tau: (t) => t }, // hook: the blue line CU
  { id: 2, a: 136, b: 394, light: "day", crowd: "villagers", tau: (t) => t }, // setting: Aneyoshi, road to the 11 houses
  { id: 3, a: 394, b: 530, light: "day", crowd: "flee", tau: (t) => t }, // action 1: the quake
  { id: 4, a: 530, b: 628, light: "day", crowd: "flee", tau: (t) => t }, // action 2: the water comes up the valley
  { id: 5, a: 628, b: 727, light: "day", crowd: "none", tau: (t) => t }, // action 3: the water swallows the road
  { id: 6, a: 727, b: 912, light: "day", crowd: "villagers", tau: (t) => t }, // action 4: the houses wait, water still rising
  { id: 7, a: 912, b: 998, light: "day", crowd: "kimura", tau: (t) => t }, // snap: the water stops at the line
  { id: 8, a: 998, b: 1195, light: "day", crowd: "kimura", tau: (t) => t }, // deadpan: Untungnya / Sialnya
  { id: 9, a: 1195, b: 1454, light: "day", crowd: "none", tau: (t) => t }, // explanation: the stone is the real warning
  { id: 10, a: 1454, b: 1688, light: "day", crowd: "villagers", tau: (t) => t }, // consequence: roofs dry, road below the line wet
  { id: 11, a: 1688, b: TOTAL, light: "golden", crowd: "villagers", tau: (t) => t }, // callback: "bukan cat, catatan", crane out
];
/** crossfades (frames) at place/time changes; a white 6-frame flash after the hook */

export const XFADE: Record<number, number> = { 2: 9, 9: 12, 11: 12 };
export const FLASH_AT = 136;

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
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
type Shot = Partial<Cam> & { pos: V3; look: V3 };
type Key = { f: number; dur?: number; cut?: boolean; s: (f: number) => Shot };
/** reference camera ease: symmetric smootherstep (attack = release) */
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
/** zoom push (camera stays put): tan(fov/2) shrinks by k */
const zoom = (pos: V3, look: V3, fov: number, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos, look, fov: (360 / Math.PI) * Math.atan(Math.tan((fov * Math.PI) / 360) * k), ...rest });

// the blue line on the road axis (x = 0), a hair above the road surface.
 // Uses the PAINTED line (z=-20, y=groundY(-20)+0.07), not the wave front (-25).
const LINE: V3 = [0, groundY(PAINT_Z) + 0.07, PAINT_Z];

// ---- framings (f -> camera); each pushes in from the frame its key starts ----
// shot 1 (hook): low on the road just below the line, looking uphill across it; the village is soft behind
// v2: camera was 9.9 m from the painted line and aimed 5 m past it (at the
// wave front, z=-25), so the line read as a thin sliver at the top edge.
// Now 4.9 m away, aimed at the paint itself, fov 36: the line sits centred
// and ~3x thicker in frame.
const S1a = (f: number) => dolly([1.8, 9.6, -24.5], LINE, pushK(f, 0, 0.0022), { fov: 36 });
const S1b = (f: number) => dolly([1.5, 9.4, -23.6], LINE, pushK(f, 50, 0.002, 0.006, 46), { fov: 34, roll: -0.03 }); // punch on "garis cat biru"
// shot 2 (setting): high over the road below the line, looking up the valley to the terrace; then tighten on the line
const S2a = (f: number) => zoom([0, 22, -46], [0, 7, -10], 46, pushK(f, 136, 0.0015));
const S2b = (f: number) => zoom([0, 22, -46], [0, 8.4, -20], 36, pushK(f, 300, 0.0015, 0.005, 40)); // "garis biru itu melintang"
// shot 3 (quake): street level in the village, villagers looking up; shake comes from the kicks
const S3a = (f: number) => dolly([7, 13.6, 28], [0, 12.5, 8], pushK(f, 394, 0.002), { fov: 42 });
const S3b = (f: number) => dolly([5, 13.2, 22], [0, 12.8, 6], pushK(f, 444, 0.0025, 0.006, 46), { fov: 38, roll: 0.04 }); // punch on "gempa 9,0"
// shot 4 (water comes up): high on the hill looking down the valley
const S4a = (f: number) => dolly([38, 32, 42], [0, 6, -60], pushK(f, 530, 0.0018), { fov: 44 });
// shot 5 (water swallows the road): on the road axis above the terrace edge, the climbing wall ahead, the line low in frame
const S5a = (f: number) => dolly([0, 17, -8], [0, 6, -60], pushK(f, 628, 0.002), { fov: 42 });

// shot 6 (houses wait): high over the terrace, looking across the roofs down to the line and the rising water
const S6a = (f: number) => dolly([-10, 19, 16], [0, 9, -12], pushK(f, 727, 0.0018), { fov: 42 });
const S6b = (f: number) => dolly([-6, 17.5, 10], [0, 8.6, -18], pushK(f, 820, 0.0025, 0.006, 46), { fov: 38, roll: 0.03 }); // "tidak ada yang tahu sampai mana"
// shot 7 (snap): at the stone, looking down the road to the waterline + blue line. Same pattern as Aneyoshi #1 S8:
// the camera stays PUT on the punch (zoom), so the near stone never swallows the frame.
// v2: S7a was a DOLLY, not a zoom — by f955 it had driven ~3 m toward the
// stone, halving the stone distance and doubling its size while out of focus.
// Now both keys are zoom from the same fixed position (Aneyoshi #1 S8 v2d),
// and both aim at the PAINTED line (z=-20) via LINE.
const S7a = (f: number) => zoom([STONE[0], 13.8, 12], LINE, 42, pushK(f, 912, 0.0015));
const S7b = (f: number) => zoom([STONE[0], 13.8, 12], LINE, 42, pushK(f, 955, 0.0015)); // centred on "garis biru"
// shot 8 (deadpan): stone + Kimura, then his face on "Sialnya"
const S8a = (f: number) => dolly([6.6, 13.2, 1.6], [3.4, 12.4, 7], pushK(f, 998, 0.002), { fov: 40 });
const S8b = (f: number) => dolly([5.6, 12.9, 3.2], [3.6, 12.5, 7.2], pushK(f, 1094, 0.0025), { fov: 36, roll: 0.03 });
// shot 9 (explanation): from the road, the stone up at the terrace edge; CUT to its carved face
const S9a = (f: number) => dolly([-3.2, 12.0, -8], [STONE[0], STONE[1] + 0.9, STONE[2]], pushK(f, 1195, 0.0018), { fov: 40 });
const S9b = (f: number) => dolly([5.2, 12.7, 2.4], [STONE[0] + 0.2, STONE[1] + 0.5, STONE[2]], pushK(f, 1330, 0.0025), { fov: 36 });
// shot 10 (consequence): aerial over the dry roofs, then down the road to the line
const S10a = (f: number) => dolly([-12, 24, 26], [0, 12, 12], pushK(f, 1454, 0.0015), { fov: 42 });
const S10b = (f: number) => dolly([5, 16.5, -2], LINE, pushK(f, 1562, 0.002, 0.005, 40), { fov: 42, roll: -0.03 }); // "Jalan di bawah garis basah"
// shot 11 (callback, golden): the hook framing again, then crane out over the road to the village
// Same framing as the fixed S1 (hook), so the callback inherits the fix.
const S11a = (f: number) => dolly([1.8, 9.6, -24.5], LINE, pushK(f, 1688, 0.002), { fov: 36 });
const S11b = (f: number) => dolly([1.5, 9.4, -23.6], LINE, pushK(f, 1725, 0.0025, 0.006, 36), { fov: 34, roll: -0.03 }); // punch on "Itu catatan"
/** crane out: a curved path (quadratic Bezier) rising from the line, backing toward the sea, looking up at the 11 houses */
const CRANE: V3[] = [[10, 18, -46], [0, 30, -62], [0, 6, 0]]; // control, end position, end look
const S11c = (f: number): Shot => {
  const a = S11b(1770), s = glide((f - 1770) / 90), r = 1 - s, [C, B, L] = CRANE;
  return { pos: [0, 1, 2].map((i) => r * r * a.pos[i] + 2 * s * r * C[i] + s * s * B[i]) as V3,
    look: [0, 1, 2].map((i) => a.look[i] + (L[i] - a.look[i]) * s) as V3, fov: (a.fov ?? 40) + (44 - (a.fov ?? 40)) * s, roll: (a.roll ?? 0) * (1 - s) };
};

const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: S1a },
    { f: 50, dur: 46, s: S1b }, // centred on 73, punch on "garis cat biru"
  ],

  2: [
    { f: 136, s: S2a }, // cut under the flash + crossfade
    { f: 300, dur: 30, s: S2b }, // centred on 315, "Dan garis biru itu melintang"
  ],
  3: [
    { f: 394, s: S3a }, // cut on "Tanggal 11 Maret 2011"
    { f: 444, dur: 36, s: S3b }, // centred on 462, "gempa 9,0"
  ],
  4: [{ f: 530, s: S4a }], // cut on "Lalu air datang"
  5: [{ f: 628, s: S5a }], // cut on "Air menelan pantai"
  6: [
    { f: 727, s: S6a }, // cut on "Di atas jalan"
    { f: 820, dur: 30, s: S6b }, // centred on 835
  ],
  7: [
    { f: 912, s: S7a }, // cut on "Lalu berhenti" (kick)
    { f: 955, dur: 36, s: S7b }, // centred on 973, the blue line
  ],
  8: [
    { f: 998, s: S8a }, // cut on "Untungnya"
    { f: 1094, dur: 36, s: S8b }, // centred on 1112, "Sialnya" -> Kimura's face
  ],
  9: [
    { f: 1195, s: S9a }, // "Garis itu cuma mencatat" — crossfade from the deadpan
    { f: 1330, cut: true, s: S9b }, // cut on "Isinya satu kalimat" — the carved face
  ],
  10: [
    { f: 1454, s: S10a },
    { f: 1562, dur: 36, s: S10b }, // centred on 1580
  ],
  11: [
    { f: 1688, s: S11a }, // "Ternyata itu bukan cat" — crossfade into golden

    { f: 1725, dur: 36, s: S11b }, // centred on 1743, "Itu catatan"
    { f: 1770, cut: true, s: S11c }, // crane pull-out on its own curved path (seamless: starts at S11b(1770))
  ],
};

// impact kicks: the image offset flips sign every frame (~3 px at 720p per unit), decays to 0 in 11 f,
// roll +-0.23 deg per unit. Quake hits (tau 13.2 / 14.8 / 16.3) + the snap (tau 30.4, when the water stops).
const KICKS: [number, number][] = [[13.2, 0.8], [14.8, 0.6], [16.3, 0.6], [30.4, 1.0]];
export const kickAt = (t: number) => {
  let a = 0;
  for (const [t0, g] of KICKS) {
    const n = Math.floor((t - t0) * FPS + 1e-6);
    if (n >= 0 && n < 11) a += g * (n % 2 ? -1 : 1) * (1 - n / 11) ** 1.5;
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
 *  Entries switch on cuts (no dur) or ramp with the camera glide they share f/dur with. */
export type Dof = { f: number; dur?: number; cInf: number; focus?: (f: number) => V3 };
export const DOF: Dof[] = [
  { f: 0, cInf: 14, focus: () => LINE }, // hook: the blue line CU
  { f: 50, dur: 46, cInf: 14, focus: () => LINE },
  { f: 136, cInf: 0 }, // setting wide
  { f: 300, dur: 30, cInf: 6, focus: () => [0, 8.4, BLUE_LINE_Z] }, // tighten on the line
  { f: 394, cInf: 10, focus: () => [0, 12.5, 8] }, // quake street
  { f: 530, cInf: 0 }, // the water climbs / swallows the road / houses wait (wide, shots 4-6)
  { f: 912, cInf: 12, focus: () => LINE }, // snap: the blue line (painted, z=-20)
  { f: 998, cInf: 14, focus: () => [3.6, 12.5, 7.2] }, // deadpan: Kimura's eyes
  { f: 1195, cInf: 6, focus: () => [STONE[0], STONE[1] + 0.9, STONE[2]] }, // explanation: the stone from the road
  { f: 1330, cInf: 12, focus: () => [STONE[0] + 0.2, STONE[1] + 0.5, STONE[2]] }, // the carved face
  { f: 1454, cInf: 0 }, // consequence: roofs, sharp
  { f: 1562, dur: 36, cInf: 6, focus: () => LINE }, // down the road to the line (painted, z=-20)
  { f: 1688, cInf: 8, focus: () => LINE }, // callback: the line again, mild
  { f: 1770, dur: 40, cInf: 0 }, // crane out: ramps to sharp
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

/** near framing objects: visible while a <= f < b; ranges stay inside one shot. Kosong di episode ini:

 *  geometri frame vertikal sempit (setengah-lebar ~0,2 x jarak), jadi tambahkan hanya setelah lihat still storyboard. */
export type Fg = { a: number; b: number; kit: string; pos: V3; s?: number; yaw?: number };
export const FOREGROUND: Fg[] = [];
