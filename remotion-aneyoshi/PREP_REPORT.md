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

## Fix run #2 (23 Nov 2026, setelah run Actions #2 GAGAL di frame 68/150)
- Run #2 (45106758348, 10:41 WIB): render jalan sampai 68/150 frame (45%) lalu
  gagal: `TypeError: fx.ink.dispose is not a function` saat merender frame 68.
  Frame 68 = momen layer crossfade pertama dilepas (XFADE shot 2: frame 62–67,
  hilang di 68) — cleanup `useEffect(() => () => fx.ink.dispose(), [fx])` di
  Aneyoshi.tsx jalan saat ShotView "over" unmount.
- Penyelidikan: InkPass DOES define `override dispose()` (ink.ts:370) dan method
  itu ADA di bundle hasil compile (bundle.js:101801); `tsc` bersih; versi
  postprocessing lokal = lock = Actions (6.39.6, tidak ada drift). Penyebab
  persis mengapa method hilang saat cleanup tetap tidak teridentifikasi
  (console.log diagnostik dari page tidak diteruskan CLI Remotion).
- Perbaikan: cleanup dijadikan `fx.ink.dispose?.()` (guard) + komentar penjelas.
  Diverifikasi lokal: render frame 66–68 (melewati transisi gagal) SELESAI
  exit 0, MP4 valid (h264 540×960, 3 frame, 0,1 dtk) — sebelumnya gagal di
  frame 68 dengan error yang sama. Kebocoran: 1 InkPass per crossfade (4 total)
  tidak di-dispose; dapat diterima karena proses render pendek.
- Re-run: workflow dipicu ulang setelah upload perbaikan (run #3).

## Run #3 — TEST RENDER BERHASIL (23 Nov 2026, 11:11 WIB)
- Run #3 (45109392581): **SUCCEEDED** dalam 9 mnt 31 dtk; step "Render test clip"
  8 mnt 29 dtk, melewati frame 68 yang dulu gagal. MP4 ter-commit:
  `renders/aneyoshi-test-5s.mp4` (585 KB, commit 674f7a0).
- Verifikasi parent (11:19): unduh dari raw URL → h264 540×960 30fps 5,000 dtk,
  md5 `55feeb8504837e0a8a9ea7379c19c262`; salinan di
  `~/workspace/your_files/aneyoshi-test-5s.mp4`. Cek frame: t0,5 (hook, batu
  terbaca jelas, fasad masih Eropa — placeholder yang sudah diketahui); t2,5 +
  t4,5 (shot 2, golden) tampak LAPANG/kosong — langit + laut + figur kecil,
  desa/rumah tidak terlihat di frame tersebut. Bukan gagal render, tapi catatan
  framing untuk pass berikutnya.
- **Kecepatan terukur run #3: ~3 dtk/frame di 540×960** (150 frame ≈ 7,5 mnt
  render murni). Artinya render penuh 1.890 frame TIDAK muat 1 run: di scale 0.5
  ≈ 95 mnt, di scale 1 (4× piksel) ≈ 3–6 jam — melewati timeout workflow
  60 mnt. Rencana render penuh: pecah jadi segmen-segmen (mis. 6× ±10,5 dtk)
  lalu jahit dengan ffmpeg; butuh penyesuaian workflow. Jangan janjikan
  "±10 mnt" (patokan bridge tidak berlaku — scene Aneyoshi jauh lebih berat).
- Langkah lanjut menunggu user: tonton test 5 dtk → putuskan render penuh
  (chunked) dan fasad Jepang; VO Indonesia menyusul via Chrome user.

## Render penuh 63 dtk — SELESAI (23 Nov 2026, 13:23 WIB)
- User memilih "Lanjut, render penuh 63 detik" (12:32). Workflow ditambah input
  `start_frame`/`end_frame` (commit 7fb97f9). Render 4 segmen PARALEL, semua
  Success: P1 run #7 (29 mnt, frame 0–471), P2 run #8 (37 mnt, 472–943),
  P3 run #9 (36 mnt, 944–1415), P4 run #10 (30 mnt, 1416–1889) — scale 0.5.
  (Percobaan picu pertama #4–#6 salah isi form, dibatalkan sebelum commit.)
- Jahit lokal (ffmpeg concat, tanpa re-encode): `aneyoshi-full-63s.mp4`,
  7,67 MB, h264 540×960 30fps, **1.890 frame, 63,000 dtk**,
  md5 `21bfffd6cb57751b7cee59d108866dc6`; salinan di
  `~/workspace/your_files/aneyoshi-full-63s.mp4` (+ 4 segmen di
  `~/workspace/your_files/aneyoshi-full/`).
- Verifikasi sambungan (frame ±0,2 dtk di tiap batas 15,73 / 31,47 / 47,20 dtk):
  ketiganya MULUS, tanpa lompatan — seed deterministik terbukti. Spot-check:
  t35 (snap, Kimura + dinding air terbaca), t60 (callback sunset, batu dari
  atas). Catatan visual yang tersisa: shot 2 tetap lapang; fasad Eropa.
- Sisa: upload video final ke `renders/` repo; VO Indonesia (Chrome user);
  fasad Jepang; opsi re-render 1080p.

## Revisi v2 — visual realistis + overlay teks + retiming 2871 frame (23 Nov 2026, lokal saja)

Perintah user 13:43–13:51: visual seperti nyata + 7 overlay teks informatif + perpanjang ke ~95 dtk (VO 95,68 dtk).
Dikerjakan lokal oleh subagent; TIDAK di-upload ke repo (menunggu laporan parent). `npx tsc --noEmit` bersih.

### Retiming proporsional x1,519 (1890 -> 2871 frame, 95,70 dtk)
- `TOTAL = 2871` (story.ts). Shot baru (frame): 1: 0-99, 2: 99-273, 3: 273-445, 4: 445-778, 5: 778-1037,
  6: 1037-1297, 7: 1297-1493, 8: 1493-1666, 9: 1666-1899, 10: 1899-2127, 11: 2127-2368, 12: 2368-2578, 13: 2578-2871.
- FLASH_AT 65->99; XFADE {2:6,5:8,10:8,13:8} -> {2:9,5:12,10:12,13:12}; WAVE_T0/T1/T2 28.5/32.6/36.5 -> 43.3/49.5/55.4 dtk;
  QUAKE_T0/T1 22.8/28.5 -> 34.6/43.3 dtk; KICKS -> [[34.6,0.8],[37.4,0.6],[40.1,0.6],[49.5,1.0]]; jendela kick 7->11 frame.
- Semua kunci kamera (CAMS f/dur), pushK f0, punch n (30->46, 35->53), DOF f/dur, FOREGROUND, S13c (1830->2780, /60->/91)
  dikali 1,519. RATES per-frame (kecepatan lari 1,6 m/dtk, tempo palu 0,9 dtk, pushK rate) TIDAK diubah.
- cast.ts: SWAPS {6:[22.8,24.6], 9:[39.2]} -> {6:[34.6,37.4], 9:[59.5]}; fleeAt (t-22.8)->(t-34.6); kimuraAt t<39.2->t<59.5.
- Audit grep: tidak ada sisa tau lama di semua file kecuali komentar retiming.
- Catatan: retiming ini aproksimasi; timing persis per baris VO dari alignment faster-whisper di assembly nanti.

### Visual realistis (file diubah)
- Aneyoshi.tsx: InkPass default OFF (toggles ink:false; re-enable via inputProps {post:{ink:true}}); konstruksi
  InkPass kondisional; cleanup fx.ink?.dispose?.(); flash 6 frame; wiring <Overlays /> setelah flash div.
- Overlays.tsx (BARU): 7 overlay (lihat bawah). paint.ts: graniteHD() baru (speckle granit seeded); facadeHD opsi jp
  (shoji + pintu geser, tanpa shutter/kaca biru/tirai).
- build.ts: lam()/toLambert() buang twoTone -> MeshLambertMaterial polos; house() HAPUS culling inTheWay (baris timur
  desa kini berdiri); facadeHD jp: si>=8; cerobong/cornice dilewati untuk JP; stoneMonument + harbor -> graniteHD;
  stoneCarveTex base #b9b3a6 -> #8f8880.
- toon.ts: INK #241726 -> #2e2118; Pen.ol 12->7; proporsi ~3,5 -> ~4,7 kepala (adult a:88, torso:1.6, legs:2.1,
  tw:1.05; stout a:92, torso:1.6, legs:1.9, tw:1.15; kid a:84, torso:1.35, legs:1.7, tw:0.95); outline ow 5u->3.2u;
  mix INK anggota badan 0.55/0.5 -> 0.25/0.22 dst; footStroke w+3 -> w+1.2.
- cast.ts: palet coat villager dimutekan (ungu/biru/merah jenuh -> slate/olive/cokelat kusam).
- lights.ts: sunI day 2.8->2.4, hemiI 0.55->0.85 (v2b); golden sunI 5.5->3.2, hemiI 0.5->0.8 (v2b).
- world.ts: glint matahari di air (uniform wSunDir; specular Blinn pow 180 di lights_fragment_end, pakai
  geometryNormal agar dinding gelombang vertikal tidak kena glint salah).
- story.ts framing shot 2 (v2): S2a close-up penyintas di pantai [-2,8.5,-34]->[0,7.5,-50] fov 42; S2b CUT ke jalan
  desa teras [0,26,-8]->[0,11,30] fov 40 (v2b: kamera mundur+tinggi dari sisi pantai; S2b v2 pertama [2,17,26]
  terlalu dekat — satu fasad memenuhi frame).

### Bug besar ditemukan + diperbaiki (pra-eksisting v1)
- quad() tanah di buildVillage ber-winding TERBALIK: normal menghadap ke bawah, ter-backface-cull; yang terlihat
  adalah background #cfe3f2 (langit) tembus — inilah penyebab "tanah pucat" di semua shot siang v1. Di-flip ke
  (d,c,b,a): lantai lembah 5 quad, apron teras, hillside timur saja (barat sudah benar), beach, road 4 quad, garis
  biru. Plus quad ukiran batu sisi -z di-flip (normalnya +z ke dalam batu; ukiran tak terlihat dari kamera hook).
  Diverifikasi: still f900 v2b — rumput hijau + jalan cobble + garis biru kini tampil.

### Shot 8 (v2d, 23 Nov ~14:24)
- S8b dolly+punch v1 mendorong kamera melewati Kimura (terpotong di tepi kiri). Percobaan v2b (dolly lembut tanpa
  punch) justru gagal: batu yang out-of-focus (5 m dari lensa, fokus garis biru 35 m) memburam memenuhi frame.
  Solusi v2d: S8b jadi zoom (kamera TETAP di posisi S8a, fov melebar pelan 42->~46) — Kimura + batu tetap dalam
  frame, tidak ada yang melintasinya. Diverifikasi f1595 + f1650 v2d.

### 7 overlay teks (Overlays.tsx; pop-in scale 0.8->1 + fade 8 frame, tahan ~60 frame, fade-out 8 frame;
### posisi atas-tengah, paddingTop 26%, backing rgba(8,12,18,0.62), angka kuning #ffd23f 132px, sub putih 46px)
- O1 "1896 / Hanya 2 orang selamat" f165-241 (shot 2, 5,50-8,03 dtk)
- O2 "1933 / Hanya 4 orang selamat" f300-376 (shot 3, 10,00-12,53 dtk)
- O3 "Jangan membangun rumah / di bawah titik ini" f650-726 (shot 4, 21,67-24,20 dtk)
- O4 "11 Maret 2011 / Gempa 9,0" f1045-1121 (shot 6, 34,83-37,37 dtk)
- O5 "39 METER" f1320-1396 (shot 7, 44,00-46,53 dtk)
- O6 "90 METER / SEBELUM BATU" f1505-1581 (shot 8, 50,17-52,70 dtk)
- O7 "78 TAHUN" f1690-1766 (shot 9, 56,33-58,87 dtk)
- Tidak ada tumpang tindih; tidak ada di zona bawah (subtitle karaoke nanti).

### Still verifikasi (verification/after/; sebelum di verification/before/)
- v2 (pertama): f23-hook, f114-shot2a, f230-shot2b, f900-shot5-village, f1595-snap-kimura, f2734-sunset,
  f200-overlay1-1896, f1080-overlay4-gempa, f1540-overlay6-90m.
- v2b (setelah flip tanah + S2b baru + hemi): f23-hook-v2b, f114-shot2a-v2b, f230-shot2b-v2b, f900-shot5-v2b,
  f1080-shot6-v2b, f1540-shot8-v2b, f1595-shot8b-v2b, f2734-sunset-v2b.
- v2d (setelah fix S8b zoom): f1595-shot8b-v2d, f1650-shot8-end-v2d, f200-overlay1-1896-v2d,
  f1080-overlay4-gempa-v2d, f1540-overlay6-90m-v2d.
- Penilaian jujur: batu granit + ukiran + fasad shoji + desa kedua sisi jalan + tanah/jalan/garis biru + overlay
  SUDAH nyata. Masih kartun: karakter (kepala masih ~1/4,7 tubuh, kaki lidi, torso blob — perbaikan penuh butuh
  gambar ulang sistem figur toon.ts, di luar scope pass ini); air laut (marks putih seperti coretan, glint belum
  terverifikasi jelas); rumput sangat jenuh (#73b23d, nyaris neon); shot golden (2-3) gelap/moody (matahari el 7
  deg, fasad menghadap kamera dalam naungan); shot 6 masih ada tepi atap rumah di foreground (blur DOF).
- Render penuh v2: BELUM — butuh workflow segmen di-update ke frame 0-2871 (4 segmen baru) + upload kode v2 ke repo.
  Perkiraan biaya: ~3 dtk/frame scale 0.5 (InkPass off menghemat sedikit; Lambert vs twoTone netral).
