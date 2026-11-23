# Storyboard-First — Playbook Produksi Animasi Aneyoshi

Cara kerja baru: **gambar dulu, video belakangan.** Tiap camera setup di-review
sebagai still SEBELUM render video penuh. Iterasi visual jadi murah (menit,
bukan puluhan menit), dan hasil akhir konsisten karena framing sudah disetujui.

## Alur (5 langkah)

```
1. Naskah dikunci        stories/tsunami-jepang-aneyoshi/SCRIPT.md
2. Storyboard            workflow "Remotion Aneyoshi storyboard" (1 dispatch)
                         -> 25 still di storyboard/aneyoshi/ -> REVIEW
3. Perbaiki scene        ubah kode di src/videos/aneyoshi/ (bila ada catatan)
                         -> ulangi langkah 2 sampai still disetujui
4. Render penuh          workflow "Remotion Aneyoshi render (full...)" (1 dispatch)
                         -> 12 segmen paralel -> stitch otomatis
                         -> MP4 final di renders/
5. Assembly              lokal: VO + backsound + subtitle karaoke + loudnorm
                         -> QC (ffprobe + loudness + spot-check frame) -> kirim
```

## Workflow 1 — Storyboard (still per camera setup)

- File: `.github/workflows/remotion-aneyoshi-storyboard.yml`
- Cara jalan: GitHub repo → Actions → "Remotion Aneyoshi storyboard" →
  Run workflow (biarkan default) → tunggu ~3–5 menit.
- Hasil: 25 JPG di `storyboard/aneyoshi/` (satu per camera setup), scale 0.5
  (540×960), nama `still-<key>-f<frame>.jpg`.
- Daftar camera setup (key — frame — isi):
  - s01a 21 hook batu close-up · s01b 66 punch "menyelamatkan"
  - s02a 142 penyintas 1896 di pantai · s02b 229 jalan desa 1896
  - s03a 315 setting 1933 · s03b 380 dinding air
  - s04a 526 pengukir batu · s04b 631 pahat
  - s05a 842 desa 2011 · s05b 920 "sebelas rumah"
  - s06a 1102 gempa · s06b 1185 lari
  - s07a 1345 air naik · s07b 1415 dinding air mendekat
  - s08a 1536 Kimura + air berhenti · s08b 1598 garis biru
  - s09a 1724 deadpan batu + Kimura · s09b 1800 wajah Kimura
  - s10a 2013 laut dalam · s11a 2187 air dangkal · s11b 2268 gelombang
  - s12a 2420 batu-batu di bukit · s12b 2491 batu
  - s13a 2641 sunset desa · s13b 2727 sunset batu · s13c 2825 crane pull-out
- Bila shot berubah (story.ts), update daftar frame di input `frames`
  workflow (default-nya sudah berisi 25 key di atas).

### Checklist review still (yang dicek tiap still)

1. Framing: subjek utama tidak terpotong / tidak terlalu kecil.
2. Karakter: proporsi dan posisi masuk akal; wajah tidak aneh di close-up.
3. Overlay teks: terbaca, tidak tabrakan dengan subjek.
4. Lighting: tidak terlalu gelap (khusus shot golden).
5. Latar: desa/laut/batu terlihat sesuai deskripsi shot.

Catat perbaikan per still (nomor key-nya), perbaiki kode, jalankan storyboard
lagi. **Jangan render penuh sebelum still disetujui.**

## Workflow 2 — Render penuh (matrix + auto-stitch)

- File: `.github/workflows/remotion-aneyoshi-full.yml`
- Cara jalan: Actions → "Remotion Aneyoshi render (full...)" → Run workflow.
- Input:
  - `scale`: 0.25 = preview 270×480 (~6–8 mnt wall),
    0.5 = 540×960 (~12–15 mnt wall),
    1 = 1080×1920 asli (~30 mnt wall).
  - `segments`: 12 = penuh (default); 3 = uji cepat (3 segmen, tetap full video).
  - `output`: nama MP4 final (default `aneyoshi-full.mp4`).
- Hasil: MP4 final di-commit otomatis ke `renders/<output>`.
- Optimasi yang sudah dipasang: cache `node_modules` (+ Chrome Headless
  Shell), `--concurrency 4` (default Remotion hanya pakai 2 dari 4 core!),
  `--gl swangle` (wajib di runner tanpa GPU), `--jpeg-quality 70`,
  `--x264-preset veryfast`, `--crf 18`, runner di-pin `ubuntu-24.04`,
  commit memakai `[skip ci]` supaya tidak memicu workflow lain.

## Aturan main

- Still dulu, render penuh belakangan. Satu still ~30 detik; satu render
  penuh 12–30 menit. Jangan buang waktu render untuk framing yang belum dicek.
- Preview scale 0.25 untuk cek gerakan/animasi; final scale 1.0 untuk
  1080p asli (berhenti upscale 540p).
- Bila satu segmen gagal, render ulang segmen itu saja lewat workflow lama
  `remotion-aneyoshi-test.yml` (input start_frame/end_frame), lalu jahit
  manual — jangan ulangi 12 segmen.
- Bila render `concurrency 4` kehabisan RAM (OOM), turunkan ke 2 di
  workflow (satu baris di perintah render).
- TOTAL frame dibaca otomatis dari `story.ts` (`export const TOTAL`) —
  jangan hardcode di workflow.

## Riwayat latihan

- 23 Nov 2026: workflow storyboard + full dibuat (latihan pertama).
  Storyboard 25 still + uji matrix 3 segmen scale 0.25 (preview full).
  Hasil latihan: (diisi setelah run pertama).
