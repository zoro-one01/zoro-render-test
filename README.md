# Imagine V1

Pipeline render animasi prosedural — dari naskah sampai video vertikal, gratis di GitHub Actions.

> **Nama tool: Imagine V1.** Repo ini tetap bernama `zoro-render-test`; "Imagine" adalah nama tool-nya, "V1" adalah versinya.

## Apa itu

Imagine mengubah naskah cerita menjadi video animasi 3D prosedural (Remotion + three.js) tanpa GPU dan tanpa biaya render. Semua frame di-render deterministik di runner GitHub Actions (CPU), lalu dirakit lokal dengan VO, subtitle karaoke, dan backsound.

Yang sudah terbukti jalan (23–24 Nov 2026):

- **Aneyoshi — "Batu yang Menyelamatkan Desa"**: video 95 detik, 1080×1920, 2.871 frame, terbit sebagai GitHub Release. Naskah dikunci → storyboard still → review → render penuh → assembly.
- **Render penuh ~12–16 menit wall** untuk video 95 detik (12 segmen paralel, scale 0.5) — setelah benchmark: concurrency 4 dan multisampling 0 (hemat 19,3% waktu, tanpa penurunan kualitas terlihat di still).

## Cara kerja (storyboard-first)

1. **Naskah dikunci** — fakta terverifikasi + sumber, formula beat: Hook → Setting → eskalasi 3–4 beat → Snap → deadpan "Luckily…/Unluckily…" → Explanation → Consequence → Callback twist.
2. **Storyboard** — render still per camera setup (`remotion-aneyoshi-storyboard.yml`, 26 setup), review framing/karakter/overlay/lighting/latar.
3. **Perbaiki** — ubah kode adegan, ulang still yang bermasalah. Jangan render penuh sebelum storyboard disetujui.
4. **Render penuh** — `remotion-aneyoshi-full.yml`: job `plan` → job `render` (matrix segmen, `--concurrency 4 --gl swangle`) → job `stitch` (ffmpeg concat) → MP4 di `renders/`.
5. **Assembly lokal** — VO (satu generation, lalu alignment per baris) + subtitle karaoke + backsound 30% (tanpa sidechain) + loudnorm. QC sebelum tayang.

Detail lengkap: `remotion-aneyoshi/STORYBOARD_WORKFLOW.md`.

## Struktur repo

| Folder / file | Isi |
|---|---|
| `remotion-aneyoshi/` | Proyek utama: komposisi `AneyoshiShort` (1080×1920, 30fps) + workflow storyboard/full/benchmark |
| `remotion-bridge-test/` | Uji jembatan Remotion + three.js (berhasil: 5 detik, 540×960) |
| `hyperframes-test/`, `hyperframes-long/` | Komposisi HyperFrames (GSAP timeline) + hasil render |
| `skills/` | Skill yang di-vendor: motioncut, panduan-video-motion, local-remotion, hyperframes, claude-animated-shorts |
| `stories/` | Naskah cerita (Aneyoshi, Tacoma — draf) |
| `analysis/` | Laporan analisa video + benchmark |
| `REPOS.md` | Daftar repo referensi yang dikurasi |
| `renders/` | MP4 hasil render (batas upload web GitHub 25 MB/file; file besar via GitHub Release) |

## Aturan yang mengikat

- **Deterministik:** tidak ada `Math.random`, `Date.now`, atau network saat render — semua random seeded.
- **Lisensi repo publik:** yang boleh di-commit = CC0 (Kenney, KayKit, Poly Haven) dan MIT (three.js, drei). Quaternius (QAL) dan Mixamo **dilarang** di-commit mentah — unduh saat build.
- **AI text-to-video bukan jalannya** untuk cerita berkarakter (butuh GPU, konsistensi tokoh belum terpecahkan). Yang dilatih di sini = sistem prosedural (rig + animasi + shader), bukan model video.
- **Batas GitHub:** upload web 25 MB/file; file besar diterbitkan sebagai Release asset (hati-hati: membuat tag memicu workflow yang punya trigger tag).

## Status V1

- Jalan: storyboard loop, render penuh + stitch, benchmark (concurrency, multisampling), assembly + QC, rilis via Release.
- Menunggu keputusan: visual v3 Aneyoshi — (a) air + langit (Water.js + Sky.js + HDRI), (b) karakter (KayKit CC0), atau (c) tahan v2.
- Berikutnya: verifikasi satu still scale penuh di render penuh pertama yang memakai multisampling 0.
