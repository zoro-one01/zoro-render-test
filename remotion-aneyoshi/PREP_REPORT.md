# PREP REPORT — Aneyoshi ("The Stone That Saved a Village")

Short animasi 63 detik (1890 frame @30fps, 1080×1920), gaya claude-animated-shorts:
karakter 2D bean-head di dunia 3D (three.js dalam Remotion). Naskah DIKUNCI dari
`stories/tsunami-jepang-aneyoshi/SCRIPT.md` (~233 kata, 12 beat, 13 shot) — tidak ada
kata naskah yang diubah. **Tanpa VO** (words.json/voice.wav tidak di-import; VO
Indonesia menyusul via Chrome user). Render test pertama yang disarankan: **5 detik,
scale 0.5** (frame 0–149, seperti bridge test).

## Yang diadaptasi dari template bridge

- `story.ts` (ditulis ulang): 13 shot memetakan 12 beat; `groundY(z)` lembah naik
  0,5→11,3 lalu terrace 11,3→12,5; `wavePose()` (dinding air stilasi, bukan simulasi);
  `quakeU`; `STONES_EAST` (3 batu di lereng timur, shot 12); `FOREGROUND` (cabang
  cedar di shot 1/9, semak di shot 13); `XFADE {2:6, 5:8, 10:8, 13:8}`; `FLASH_AT=65`.
- `build.ts` → `buildVillage()`: lantai lembah mengikuti `groundY`, jalan cobble
  menanjak, garis cat biru, batu utama + 2 batu timur, 11 rumah gaya Jepang (atap
  abu-abu gelap, dinding plester/kayu), pelabuhan (breakwater + 2 perahu), hutan
  cedar (114 pohon prosedural), bukit horizon. `buildTown` template (gereja, mill)
  dihapus total. `stoneMonument()`: slab meruncing + alas + ukiran abstrak.
- `cast.ts` (ditulis ulang): penyintas 1896/1933 (6 orang, pengukir + palu +
  siklus pahat 0,9 dtk, 3 pengamat termasuk 1 anak), warga 2011 (11 orang),
  pelari gempa (8 orang), Kimura (64 thn, stout, rambut + kumis abu-abu; relief
  saat air berhenti, netral di "Sayangnya"), surveyor di batu timur, `waveFx`
  (splash + ring). Kostum dua era: 1896/1933 earth-tone gelap, 2011 warna biasa.
- `world.ts` (ditulis ulang): langit/lampu/air/awan dari template; jembatan diganti
  lembah + dinding gelombang stilasi (dinding + foam crest + flood plane, dipose
  per frame dari `wavePose`); `KENNEY` hanya berisi nama vegetasi prosedural.
- `Aneyoshi.tsx` / `Root.tsx` / `index.ts` / `package.json` / `tsconfig.json`:
  salinan bridge test dengan nama diganti (`AneyoshiShort`, `ANEYOSHI_FRAMES`,
  1890 frame). Workflow `.github/workflows/remotion-aneyoshi-test.yml` meniru
  bridge test (workflow_dispatch, inputs seconds/scale/output, REMOTION_TMP ke
  workspace, timeout 60 mnt, MP4 ke `renders/`).
- 8 file disalin TANPA perubahan dari `templates/bridge/`: toon.ts, paint.ts,
  shade.ts, cardshade.ts, grade.ts, ink.ts, lensblur.ts, lights.ts.

## Verifikasi lokal (23 Nov 2026)

- `npm install` OK (281 paket, versi sesuai daftar terbukti di Actions).
- `npx tsc --noEmit` **bersih (exit 0)** — setelah 3 perbaikan: (a) `cobbleHD`/
  `grassHD` ditambahkan ke import paint di build.ts; (b) `s.sunAz/sunEl` dihapus
  dari world.ts (ShotDef tidak punya field itu — override matahari hanya lewat
  `SUN_SHOT`); (c) Aneyoshi.tsx: children EffectComposer dibangun imperatif
  (tipenya `ReactElement`, bukan `ReactNode` — ternary `? : null` ditolak tsc;
  pola sama ada di Bridge.tsx dan lolos karena bridge test tidak pernah di-tsc).
- Render still lokal via headless shell Remotion (`--browser-executable` ke
  chrome-headless-shell; Chromium Muse Browser tidak bisa dipakai) — **3 still
  terverifikasi visual**, tersimpan di `verification/`:
  - f30 (hook): batu + ukiran + rumah blur di belakang — OK.
  - f1000 (snap): dinding air ber-streak + foam crest + Kimura + garis biru — OK.
  - f1100 (deadpan): Kimura (rambut/kumis abu-abu, relief) + warga + batu — OK.
- Render still default timeout 30 dtk: f1000 sempat gagal sekali (timeout
  Puppeteer); **`--timeout 180000` memperbaikinya**. Bila render Actions terasa
  lambat, ini bukan error — frame berat (dinding + crowd + DOF) butuh waktu.

## Bug yang ditemukan & diperbaiki saat verifikasi

1. `poseWave` membagi `t` dengan FPS dua kali (`wavePose(id, f/FPS)` padahal
   `update()` sudah mengirim detik) → dinding + flood HILANG di shot 7–8.
2. Flood plane: `rotateX` di-bake ke geometri membuat `scale.y` tidak berpengaruh
   (plane tetap sedalam 1 m). Rotasi dipindah ke mesh.
3. Dinding flat navy polos → kini memakai material air laut yang sama (mark
   tekstur jadi streak vertikal, terbaca sebagai air jatuh).
4. Garis cat biru di z=-25 terendam 0,4 m di bawah permukaan banjir → dipindah
   ke z=-20 (jalan kering tepat setelah tepi air, z≈-22).
5. Kimura shot 8 tidak terlihat: posisi awal di luar frustum — half-fov
   horizontal frame 9:16 hanya ~12° (bukan ~34°). Posisi akhir (1, 2), ~5°
   off-axis, terverifikasi muncul di frame.

## Placeholder / batasan (bukan blocker test render)

- **Fasad rumah masih Eropa** (`facadeHD` template — townhouse + shutter); hanya
  warna atap/dinding yang Jepang. Paling terasa di shot 5/9 (aerial + deadpan).
  Perlu tekstur fasad Jepang (kayu + plester + atap genteng) di pass berikutnya.
- **Ukiran batu abstrak** (garis horizontal), bukan teks Jepang — canvas headless
  tidak punya font Jepang. Jangan klaim ukiran terbaca.
- **Skala "90 meter" dikompresi artistik**: air berhenti ~31 m di depan batu
  dalam koordinat scene (bukan 90 m), beda tinggi ~2,7 m — demi keterbacaan frame.
- **Satu scene statis untuk dua era**: flashback 1896/1933 dan 2011 berbagi desa
  yang sama; pembeda era hanya grading golden + kostum + crowd (tidak ada rumah
  pantai lama terpisah).
- **GLB Kenney tidak ada** (`public/` kosong): lentera/stall/gerobak absen;
  pohon/semak prosedural tetap tampil. 404 GLB di log render sudah diduga
  (di-catch → null).
- Garis biru di shot 8 terbaca tipis dari jauh (bayangan + fog); di gerakan +
  narasi tetap jelas konteksnya.
- Node_modules TIDAK ikut staging (dibuat ulang di Actions via `npm install`);
  `package-lock.json` disertakan agar versi paket di Actions identik.

## File

```
remotion-aneyoshi/
  package.json  package-lock.json  tsconfig.json
  public/README.md
  src/Root.tsx  src/index.ts
  src/videos/aneyoshi/
    story.ts  build.ts  world.ts  cast.ts  Aneyoshi.tsx
    toon.ts  paint.ts  shade.ts  cardshade.ts  grade.ts
    ink.ts  lensblur.ts  lights.ts
  verification/
    still-f30-hook-stone.png
    still-f1000-snap-wall.png
    still-f1100-deadpan-kimura.png
.github/workflows/remotion-aneyoshi-test.yml
```

## Yang masih butuh keputusan parent

- Test render pertama: **5 detik scale 0.5** (default workflow) — bila OK, lanjut
  render penuh 63 detik scale 1 (ekspektasi ~10 menit di Actions, mengikuti
  patokan bridge: render 2K ~4 fps).
- Fasad Jepang (butuh tekstur baru) — dikerjakan sekarang atau setelah test
  render pertama lolos?
- VO Indonesia menyusul (jalur Chrome user, seperti Baikal) — bukan bagian
  tugas ini.

## Fix run #1 (23 Nov 2026, setelah run Actions #1 GAGAL)
- Run #1 (45104067837, 10:09 WIB): gagal di step "Render test clip" — "Rendered
  0/150", lalu "Error: Timed out evaluating page function" (puppeteer-evaluate).
  Log menunjukkan 22 baris 404 untuk `public/aneyoshi/kenney/*.glb` sebelum timeout.
- Penyebab: `useKit()` di Aneyoshi.tsx memanggil `delayRender("aneyoshi kit")`
  dan `AneyoshiShort` mengembalikan `null` sampai `loadKit()` selesai. `loadKit()`
  menembak 11 `GLTFLoader.loadAsync` ke file yang TIDAK ADA (public/ kosong by
  design) — dan frame pertama tidak pernah dievaluasi sampai janji itu selesai.
- Perbaikan (3 file): (1) `world.ts`: `loadKit()` kini langsung `Promise.resolve({})`
  — runtime kit memang sudah `{}` (semua GLB 404 lalu ter-filter), jadi visual
  tidak berubah; import GLTFLoader/staticFile dihapus. (2) `Aneyoshi.tsx`: `useKit()`
  mengembalikan `EMPTY_KIT` tanpa delayRender; guard `if (!kit) return null`
  dihapus. (3) Workflow: render ditambah `--timeout 180000` (stills lokal dulu
  sempat timeout di default 30 dtk; f1000 butuh 180 dtk).
- Verifikasi lokal pasca-fix (23 Nov 10:31): `npx tsc --noEmit` bersih; still
  frame 30 scale 0.5 ter-render 1/1 (`/tmp/aneyoshi-fix-f30.png`, 357.195 byte —
  identik dengan still f30 sebelumnya, visual tidak berubah).
- Re-run: workflow dipicu ulang setelah upload perbaikan (run #2).
