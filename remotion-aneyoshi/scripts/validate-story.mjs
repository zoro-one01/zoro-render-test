// validate-story.mjs — Imagine V1
// Checks an episode's story.ts + Overlays.tsx for timing consistency BEFORE any
// render is dispatched. A broken timeline costs a full render (~15-80 min per
// segment); this script costs <1 s. Run: node scripts/validate-story.mjs
//   [path/to/story.ts] [path/to/Overlays.tsx]
// Defaults assume it runs from remotion-aneyoshi/.
// Exit 0 = all checks pass. Exit 1 = at least one ERROR (warnings do not fail).
// The checks mirror what the render actually does:
//   - workflow plan job greps `export const TOTAL`
//   - Remotion renders frames [start, end] per segment; a shot boundary that does
//     not line up with TOTAL strands frames or drops them
//   - overlays are frame ranges; one outside [0, TOTAL) never appears, one that
//     crosses a shot boundary shows over the wrong shot
import { readFileSync, existsSync } from "node:fs";

const storyPath = process.argv[2] ?? "src/videos/aneyoshi/story.ts";
const overlaysPath = process.argv[3] ?? "src/videos/aneyoshi/Overlays.tsx";

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const mustExist = (p) => {
  if (!existsSync(p)) {
    err(`file tidak ada: ${p}`);
    return false;
  }
  return true;
};

let story = "";
let overlays = "";
if (mustExist(storyPath)) story = readFileSync(storyPath, "utf8");
if (mustExist(overlaysPath)) overlays = readFileSync(overlaysPath, "utf8");
if (errors.length) {
  console.log(errors.map((e) => `ERROR: ${e}`).join("\n"));
  process.exit(1);
}

// ---------- TOTAL ----------
const totalMatch = story.match(/export const TOTAL = (\d+)/);
if (!totalMatch) err("TOTAL tidak ditemukan (export const TOTAL = N)");
const TOTAL = totalMatch ? parseInt(totalMatch[1], 10) : 0;
const FPS = parseInt(story.match(/export const FPS = (\d+)/)?.[1] ?? "30", 10);
if (TOTAL <= 0) err("TOTAL harus > 0");
console.log(`TOTAL=${TOTAL} frame (${(TOTAL / FPS).toFixed(2)} dtk @ ${FPS}fps)`);

// ---------- SHOTS ----------
const shotsBlock = story.match(/export const SHOTS: ShotDef\[\] = \[([\s\S]*?)\n\];/);
const shots = [];
if (!shotsBlock) {
  err("SHOTS tidak ditemukan");
} else {
  const re = /\{\s*id:\s*(\d+),\s*a:\s*(\d+),\s*b:\s*(\d+|TOTAL),\s*light:\s*"(\w+)",\s*crowd:\s*"(\w+)"/g;
  let m;
  while ((m = re.exec(shotsBlock[1])) !== null) {
    shots.push({
      id: parseInt(m[1], 10),
      a: parseInt(m[2], 10),
      b: m[3] === "TOTAL" ? TOTAL : parseInt(m[3], 10),
      light: m[4],
      crowd: m[5],
    });
  }
}
if (shots.length === 0) err("tidak ada shot yang ter-parse dari SHOTS");
for (let i = 0; i < shots.length; i++) {
  const s = shots[i];
  if (s.id !== i + 1) err(`shot id tidak berurutan: posisi ${i + 1} punya id ${s.id}`);
  if (s.a >= s.b) err(`shot ${s.id}: a (${s.a}) >= b (${s.b})`);
  if (i === 0 && s.a !== 0) err(`shot pertama harus mulai di frame 0, mulai di ${s.a}`);
  if (i > 0 && s.a !== shots[i - 1].b) {
    err(`shot ${s.id}: a (${s.a}) != b shot sebelumnya (${shots[i - 1].b}) — ada celah/tumpang tindih`);
  }
  if (!["day", "golden"].includes(s.light)) err(`shot ${s.id}: light "${s.light}" bukan day/golden`);
  if (!["none", "survivors", "villagers", "flee", "kimura"].includes(s.crowd)) {
    warn(`shot ${s.id}: crowd "${s.crowd}" di luar daftar yang dikenal`);
  }
}
if (shots.length > 0 && shots[shots.length - 1].b !== TOTAL) {
  err(`shot terakhir berakhir di ${shots[shots.length - 1].b}, bukan TOTAL (${TOTAL})`);
}
const shotAt = (f) => shots.find((s) => f >= s.a && f < s.b);

// ---------- CAMS ----------
const camsBlock = story.match(/const CAMS: Record<number, Key\[\]> = \{([\s\S]*?)\n\};/);
if (!camsBlock) {
  err("CAMS tidak ditemukan");
} else {
  const shotRe = /^\s*(\d+): \[/gm;
  const blocks = [];
  let sm;
  while ((sm = shotRe.exec(camsBlock[1])) !== null) blocks.push(sm);
  for (let i = 0; i < blocks.length; i++) {
    const shotId = parseInt(blocks[i][1], 10);
    const start = blocks[i].index + blocks[i][0].length;
    const end = i + 1 < blocks.length ? blocks[i + 1].index : camsBlock[1].length;
    const body = camsBlock[1].slice(start, end);
    const shot = shots.find((s) => s.id === shotId);
    if (!shot) {
      err(`CAMS punya shot ${shotId} yang tidak ada di SHOTS`);
      continue;
    }
    const keys = [...body.matchAll(/\{\s*f:\s*(\d+)(?:,\s*dur:\s*(\d+))?(?:,\s*cut:\s*true)?/g)].map((k) => ({
      f: parseInt(k[1], 10),
      dur: k[2] ? parseInt(k[2], 10) : null,
      cut: body.slice(k.index, k.index + 60).includes("cut: true"),
    }));
    if (keys.length === 0) {
      err(`shot ${shotId}: tidak ada key kamera`);
      continue;
    }
    if (keys[0].f !== shot.a) err(`shot ${shotId}: key kamera pertama di ${keys[0].f}, harus di ${shot.a} (awal shot)`);
    for (let j = 0; j < keys.length; j++) {
      const k = keys[j];
      if (k.f < shot.a || k.f >= shot.b) err(`shot ${shotId}: key kamera di frame ${k.f} di luar shot [${shot.a}, ${shot.b})`);
      if (j > 0 && k.f <= keys[j - 1].f) err(`shot ${shotId}: key kamera tidak menaik (${keys[j - 1].f} -> ${k.f})`);
      if (!k.cut) {
        const endF = k.f + (k.dur ?? 24);
        if (endF > shot.b) err(`shot ${shotId}: glide key ${k.f} + dur ${k.dur ?? 24} = ${endF} melewati akhir shot ${shot.b}`);
      }
    }
  }
}

// ---------- DOF ----------
const dofBlock = story.match(/export const DOF: Dof\[\] = \[([\s\S]*?)\n\];/);
if (dofBlock) {
  const fs = [...dofBlock[1].matchAll(/\{\s*f:\s*(\d+)/g)].map((k) => parseInt(k[1], 10));
  for (let i = 0; i < fs.length; i++) {
    if (fs[i] < 0 || fs[i] >= TOTAL) err(`DOF entry di frame ${fs[i]} di luar [0, ${TOTAL})`);
    if (i > 0 && fs[i] <= fs[i - 1]) err(`DOF tidak menaik (${fs[i - 1]} -> ${fs[i]})`);
  }
} else {
  warn("DOF tidak ditemukan — lewati cek DOF");
}

// ---------- FOREGROUND ----------
const fgBlock = story.match(/export const FOREGROUND: Fg\[\] = \[([\s\S]*?)\n\];/);
if (fgBlock) {
  const re = /\{\s*a:\s*(\d+),\s*b:\s*(\d+),\s*kit:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(fgBlock[1])) !== null) {
    const a = parseInt(m[1], 10);
    const b = parseInt(m[2], 10);
    const s = shotAt(a);
    if (!s) err(`foreground "${m[3]}": mulai di ${a} di luar semua shot`);
    else if (b > s.b) err(`foreground "${m[3]}": ${a}-${b} melewati batas shot ${s.id} (${s.b}) — harus dalam satu shot`);
    if (a >= b) err(`foreground "${m[3]}": a (${a}) >= b (${b})`);
  }
}

// ---------- XFADE / FLASH / WAVE / QUAKE ----------
const xfadeBlock = story.match(/export const XFADE: Record<number, number> = \{([^}]*)\}/);
if (xfadeBlock) {
  for (const [, id, v] of xfadeBlock[1].matchAll(/(\d+):\s*(\d+)/g)) {
    if (!shots.some((s) => s.id === parseInt(id, 10))) err(`XFADE untuk shot ${id} yang tidak ada`);
    if (parseInt(v, 10) <= 0) err(`XFADE shot ${id}: ${v} frame (harus > 0)`);
  }
}
const flash = story.match(/export const FLASH_AT = (\d+)/);
if (flash) {
  const f = parseInt(flash[1], 10);
  if (!shots.some((s) => s.a === f)) warn(`FLASH_AT ${f} bukan di batas awal shot mana pun`);
}
for (const name of ["WAVE_T0", "WAVE_T1", "WAVE_T2", "QUAKE_T0", "QUAKE_T1"]) {
  const m = story.match(new RegExp(`export const ${name} = ([\\d.]+)`));
  if (m) {
    const t = parseFloat(m[1]);
    if (t < 0 || t > TOTAL / FPS) err(`${name}=${t} dtk di luar durasi video (${(TOTAL / FPS).toFixed(2)} dtk)`);
  }
}

// ---------- OVERLAYS ----------
const ovRe = /\{\s*a:\s*(\d+),\s*b:\s*(\d+),\s*big:\s*"([^"]+)"/g;
const ovs = [...overlays.matchAll(ovRe)].map((k) => ({ a: parseInt(k[1], 10), b: parseInt(k[2], 10), big: k[3] }));
if (ovs.length === 0) {
  warn("tidak ada overlay yang ter-parse dari Overlays.tsx");
} else {
  for (let i = 0; i < ovs.length; i++) {
    const o = ovs[i];
    if (o.a < 0 || o.a >= TOTAL) err(`overlay "${o.big}": mulai di ${o.a} di luar [0, ${TOTAL})`);
    if (o.b > TOTAL) err(`overlay "${o.big}": berakhir di ${o.b} melewati TOTAL (${TOTAL})`);
    if (o.a >= o.b) err(`overlay "${o.big}": a (${o.a}) >= b (${o.b})`);
    if (i > 0 && o.a < ovs[i - 1].b) err(`overlay "${o.big}" tumpang tindih dengan overlay sebelumnya`);
    const s = shotAt(o.a);
    if (s && o.b > s.b) warn(`overlay "${o.big}": ${o.a}-${o.b} melewati batas shot ${s.id} (${s.b}) — tampil di atas shot yang salah`);
  }
}

// ---------- report ----------
console.log(`shots: ${shots.length}, overlays: ${ovs.length}`);
for (const w of warnings) console.log(`WARN: ${w}`);
if (errors.length) {
  for (const e of errors) console.log(`ERROR: ${e}`);
  console.log(`\nFAIL: ${errors.length} error, ${warnings.length} warning`);
  process.exit(1);
}
console.log(`\nPASS: semua cek lolos (${warnings.length} warning)`);
