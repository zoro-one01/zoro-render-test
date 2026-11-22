# PREP REPORT — Test render claude-animated-shorts (template bridge)

Tanggal: 23 Nov 2026 ±02:35 WIB. Dibuat setelah interupsi 02:30 — subagent
prep pertama dibatalkan sebelum menulis file apa pun; persiapan ini dibuat
ulang dari nol oleh Muse (bukan subagent).

## Yang diuji

Render 5 detik pertama (frame 0–149, 30 fps) komposisi `BridgeShort` dari
`skills/claude-animated-shorts/templates/bridge/` — Short contoh "The Bridge
That Fell for a Song" (67,5 detik, TOTAL 2025 frame). Tujuannya membuktikan
rantai Remotion + three.js + ffmpeg jalan di runner GitHub Actions sebelum
render penuh.

## Struktur scaffold (`remotion-bridge-test/`)

- `package.json` — dependensi (lihat bawah)
- `tsconfig.json` — template standar Remotion
- `src/index.ts` — registerRoot
- `src/Root.tsx` — Composition `BridgeShort`, 1080×1920, 30 fps,
  durationInFrames = BRIDGE_FRAMES (2025)
- `src/videos/bridge/` — salinan 13 file template (Bridge, build, cardshade,
  cast, grade, ink, lensblur, lights, paint, shade, story, toon, world)
- `public/` — KOSONG (lihat "Aset hilang")

## Dependensi yang dipilih (upstream TIDAK punya package.json)

Repo mromidev/claude-animated-shorts tidak menyertakan package.json
(404 di raw.githubusercontent), jadi versi dipilih dari matriks kompatibel:

- `remotion` + `@remotion/cli` + `@remotion/three` ^4.0.0 (Remotion 4,
  React 18)
- `react` + `react-dom` ^18.3.1
- `@react-three/fiber` ^8.17.10 (fiber v8 = pasangan Remotion 4)
- `@react-three/postprocessing` ^2.16.3 + `postprocessing` ^2.16.1
- `three` ^0.180.0 — masih menyediakan `three/examples/jsm/...`
  (dipakai build.ts + world.ts: BufferGeometryUtils, GLTFLoader)
- Node 22 di workflow; ffmpeg via apt; Chrome via
  `npx remotion browser ensure`

## Aset hilang + dampak

- **26 file Kenney GLB** (`public/bridge/kenney/*.glb`: tree_oak,
  tree_default, ..., windmill, canoe) — TIDAK ada di skill, tidak ikut
  di-vendor. `loadKit()` menangkap gagal load per file → `null`.
  Dampak: pohon/semak/hedge/banner tetap tampil (digambar prosedural
  di build.ts); yang absen hanya properti Kenney: lentera, stall,
  gerobak, kincir angin, kano, lily. Jembatan, kota, karakter, dan
  kamera tetap jalan — cukup untuk test pipeline.
- **words.json / voice.wav** — TIDAK dibutuhkan render: hanya disebut di
  komentar story.ts, tidak di-import kode mana pun. Video hasil tanpa
  audio (Remotion menulis track audio senyap; mux terpisah bila perlu).

## Workflow (`.github/workflows/remotion-bridge-test.yml`)

- Trigger: `workflow_dispatch` saja (inputs: seconds default 5,
  scale default 0.5, output default bridge-test-5s.mp4).
- `npx remotion render src/index.ts BridgeShort <output> --codec h264
  --crf 16 --scale <scale> --frames 0-<seconds*30-1>`.
- Commit MP4 ke `renders/` mengikuti pola workflow HyperFrames
  (fetch + rebase + push, pesan `[skip ci]`, permissions contents: write).
- `REMOTION_TMP`/`TMPDIR` diarahkan ke workspace (public/ kosong jadi
  bundle kecil; tetap jaga-jaga sesuai catatan SKILL soal temp menumpuk).
- Timeout 60 menit.

## Risiko yang diketahui

1. Versi three/postprocessing/fiber — dipilih dari matriks, belum
   terbukti di runner; bila bundle gagal, log Actions menunjukkan
   paket mana yang bentrok.
2. Render 3D + post chain (ink, DOF, bloom, grade) berat — SKILL
   mencatat render 2K ~4 fps; 150 frame skala 0.5 mestinya beberapa
   menit, tapi bundling + npm install bisa makan waktu.
3. Tanpa GLB Kenney, frame test tidak identik dengan referensi —
   ini test pipeline, bukan test look.

## Rekomendasi

- Bila 5 detik lolos: lanjut render penuh 67,5 detik (seconds=67,
  scale=1) dan bandingkan frame dengan referensi; lalu tambah GLB
  Kenney CC0 bila mau look penuh.
- Bila gagal di npm/bundle: pin versi eksak dari log error, jangan
  tebak ulang.
