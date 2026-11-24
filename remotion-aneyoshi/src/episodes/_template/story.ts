// story.ts — TEMPLATE episode Imagine V1 (salin folder ini untuk episode baru)
// Cara pakai: salin folder `_template/` menjadi `episodes/<slug>/`, lalu isi:
//   1. TOTAL = durasi VO (detik) x FPS — isi SETELAH VO jadi (lihat Aneyoshi: retiming x1.519)
//   2. SHOTS — satu baris per shot, a/b berurutan, shot terakhir b: TOTAL
//   3. CAMS — key kamera per shot (key pertama = awal shot)
//   4. DOF, FOREGROUND, XFADE, FLASH_AT — sesuai kebutuhan episode
//   5. Jalankan `node scripts/validate-story.mjs <file-ini> <Overlays.tsx-ini>` SEBELUM storyboard.
// File ini adalah contoh MINIMAL yang valid: 2 shot, TOTAL 180 frame (6 dtk).
// Grammar kamera mengikuti Aneyoshi (story.ts): glide simetris, push-in pelan,
// reframe besar = cut. Impact kicks (kickAt) TIDAK ada di template — salin dari
// Aneyoshi bila episode butuh hentakan.
export const FPS = 30;
export const TOTAL = 180; // CONTOH: 6 dtk — ganti dengan durasi VO episode ini
export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// ---------------- shots ----------------
export type Light = "day" | "golden";
export type Crowd = "none" | "survivors" | "villagers" | "flee" | "kimura";
export type ShotDef = { id: number; a: number; b: number; light: Light; crowd: Crowd; tau: (t: number) => number };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 90, light: "day", crowd: "none", tau: (t) => t }, // CONTOH: hook
  { id: 2, a: 90, b: TOTAL, light: "golden", crowd: "villagers", tau: (t) => t }, // CONTOH: callback
];
/** crossfades (frames) at place/time changes; a white 6-frame flash after the hook */
export const XFADE: Record<number, number> = { 2: 9 };
export const FLASH_AT = 90;

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
// Grammar: setiap move adalah glide smootherstep simetris 18-40 f; reframe lebih
// besar dari ~setengah lebar frame atau 40% zoom adalah hard cut di key frame-nya.
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
/** zoom push (camera stays put): tan(fov/2) shrinks by k */
const zoom = (pos: V3, look: V3, fov: number, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos, look, fov: (360 / Math.PI) * Math.atan(Math.tan((fov * Math.PI) / 360) * k), ...rest });

// ---- framings (f -> camera); each pushes in from the frame its key starts ----
// CONTOH: ganti angka-angka ini dengan framing dunia episode ini.
const S1a = (f: number) => dolly([5, 13, 1], [0, 12, 6], pushK(f, 0, 0.0025), { fov: 40 });
const S2a = (f: number) => zoom([0, 26, -8], [0, 11, 30], 40, pushK(f, 90, 0.0015));
const S2b = (f: number) => zoom([0, 20, 0], [0, 11, 30], 40, pushK(f, 135, 0.0015, 0.005, 46));

const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: S1a },
  ],
  2: [
    { f: 90, s: S2a },
    { f: 135, dur: 24, s: S2b },
  ],
};

export const camAt = (id: number, f: number): Cam => run(CAMS[id], f);
/** frame at which the current key's move has finished (for picking billboard views per key, not per frame) */
export const keyEnd = (id: number, f: number) => {
  let e = 0;
  for (const k of CAMS[id]) if (f >= k.f) e = k.f + (k.cut ? 0 : k.dur ?? 24);
  return Math.max(f, e);
};

// ---------------- lens: depth of field + foreground framing ----------------
/** Lens blur per shot (thin lens). cInf = blur-disc radius in px at 1080x1920 for things at infinity; 0 = all sharp. */
export type Dof = { f: number; dur?: number; cInf: number; focus?: (f: number) => V3 };
export const DOF: Dof[] = [
  { f: 0, cInf: 0 },
  { f: 90, cInf: 8, focus: () => [0, 11, 30] },
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

/** near framing objects: visible while a <= f < b; ranges stay inside one shot. */
export type Fg = { a: number; b: number; kit: string; pos: V3; s?: number; yaw?: number };
export const FOREGROUND: Fg[] = [];
