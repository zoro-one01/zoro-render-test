# Repo Pilihan untuk Build Video Animasi di GitHub

Kurasi repo open-source yang cocok dengan pipeline repo ini: HyperFrames CLI + GSAP → GitHub Actions → MP4 vertikal 1080×1920, repo public (menit Actions gratis), tanpa GPU.

Riset: 23 Nov 2026 (angka stars dari GitHub API saat riset, kecuali yang ditandai *). Repo yang sudah tidak aktif atau butuh GPU/bayar dicoret — lihat bagian bawah.

## Daftar pendek (13 repo)

| # | Repo | Stars | Lisensi | Peran di pipeline kami |
|---|------|-------|---------|------------------------|
| 1 | [Anime.js](https://github.com/juliangarnier/animejs) | ~74.870* | MIT | Mesin animasi alternatif/pelengkap GSAP di dalam komposisi (timeline, stagger, teks kinetik) |
| 2 | [Motion Canvas](https://github.com/motion-canvas/motion-canvas) | 20.142 | MIT | Engine kedua — render headless Chrome seperti HyperFrames, cocok untuk explainer kode |
| 3 | [Manim Community](https://github.com/ManimCommunity/manim) | 42.802 | MIT | Explainer matematika/data-viz, render CPU (Cairo), tanpa GPU |
| 4 | [Remotion](https://github.com/remotion-dev/remotion) | 74.928 | Source-available | Sudah ada sebagai skill di repo ini — gratis ≤3 orang di perusahaan for-profit, di atas itu lisensi Company berbayar |
| 5 | [Revideo](https://github.com/midrender/revideo) | 4.225 | MIT | Penerus Motion Canvas — 2D motion graphics code-first |
| 6 | [bang-motion](https://github.com/bangtutorial/bang-motion) | 2.923 | MIT (terverifikasi dari file LICENSE) | Kinetic typography — output single `index.html` (= input workflow HyperFrames, langsung bisa di-render) |
| 7 | [motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | 3.548 | MIT | Prinsip motion design (timing, easing, Disney) untuk AI agent — memperkuat rules komposisi |
| 8 | [OpenFilm](https://github.com/openfilm/openfilm) | 8.972 | MIT/Apache-2.0 | AI video agent skill-first + editor |
| 9 | [Editly](https://github.com/mifi/editly) | 4.650 | MIT | JSON deklaratif → MP4 via ffmpeg — paling sederhana untuk rakit klip, tapi aktivitas terakhir terkonfirmasi Jul 2024 |
| 10 | [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | 22.082 | Apache-2.0 | 124 kartu resep shot promo sinematik untuk Remotion |
| 11 | [rea-video](https://github.com/JuneYaooo/rea-video) | 12.123 | Belum terverifikasi | Reverse-engineer video shot-by-shot — cocok untuk cron analisa harian |
| 12 | [dotlottie-web](https://github.com/LottieFiles/dotlottie-web) | 953 | MIT | Player animasi vektor Lottie, bisa di-embed di komposisi HyperFrames |
| 13 | [claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts) | 4.570 | MIT (kode + dokumen; frame referensi hanya untuk studi gaya) | Skill Shorts animasi kartun 3D (three.js + Remotion): karakter 2D di dunia 3D, pipeline lengkap + template bridge + audio sintesis — **SUDAH DI-VENDOR** di `skills/claude-animated-shorts/` |

Juga relevan: [Three.js](https://github.com/mrdoob/three.js) (~117 ribu*, MIT) sebagai sumber 3D di dalam komposisi — tapi berat untuk runner Actions, pakai seperlunya. Fondasi kami sendiri, [HyperFrames](https://github.com/heygen-com/hyperframes) (Apache-2.0), tercatat 88.161 stars.

\* Angka dari artikel kurasi (API menolak diakses saat riset).

## Yang sudah diintegrasikan

> Catatan keamanan (23 Nov 2026): kedua repo di bawah sempat saya clone untuk diperiksa, tapi isinya memicu pemeriksaan risiko eksekusi — jadi file-filenya TIDAK saya salin ke repo ini. Keduanya tetap terdaftar di sini sebagai referensi (tautan + cara pakai), dan prinsip-prinsipnya saya tuangkan dengan kata-kata sendiri ke rules komposisi. Kalau Pak Bosss tetap mau file aslinya di-vendor ke repo, kabari — itu butuh persetujuan eksplisit karena kontennya pernah memicu pemeriksaan tersebut.

### 1. LottieFiles motion-design-skill — "otak" kualitas rules
- Status: REFERENSI (tidak di-vendor). Lisensi MIT, Copyright 2025 LottieFiles (terverifikasi dari file LICENSE).
- Dipakai untuk: memperkuat `skills/hyperframes-composition-rules/SKILL.md` (timing, easing, koreografi).
- Risiko: hampir nol — isinya dokumen; manfaatnya hanya terasa kalau rules-nya dipakai saat menulis komposisi.

### 2. bang-motion — sumber komposisi kinetic typography
- Status: REFERENSI (tidak di-vendor). Lisensi MIT, Copyright 2026 Bang Tutorial (terverifikasi dari file LICENSE — laporan riset awal sempat menulis "belum terverifikasi", sudah dikoreksi).
- Dipakai untuk: minta komposisi opener/promo/kinetic typography, lalu render lewat workflow HyperFrames yang sama tanpa perubahan.
- Risiko: repo baru (Sep 2026), relatif kecil — kualitas output wajib diuji dulu sebelum dipakai serius.

### 3. Anime.js — mesin animasi alternatif (UJI DULU, jangan langsung pakai)
- Status: BELUM dipasang — butuh uji seekability dulu.
- Rencana: `npm install animejs` di workflow, atau vendor `anime.min.js` ke folder proyek (seperti GSAP sekarang); tulis komposisi memakai timeline Anime.js; workflow render tidak berubah.
- Risiko: GSAP adalah runtime yang didukung resmi HyperFrames — timeline Anime.js belum terbukti seekable/paused dengan benar di renderer; API v4 berbeda dari v3, kunci versinya bila dipakai.

### 4. claude-animated-shorts (mromidev) — skill Shorts animasi kartun 3D, DI-VENDOR 23 Nov 2026
- Status: **DI-VENDOR** di `skills/claude-animated-shorts/` (40 file, 844 KB). Lisensi MIT (kode + dokumen). Nama internal skill: `cartoon-3d-short`.
- Isi: pipeline Shorts 55–70 detik "karakter 2D di dunia 3D" (three.js + Remotion, render lokal, tanpa AI video generator); template lengkap Shorts contoh "The Bridge That Fell for a Song" (`templates/bridge/`, 13 file); sintesis audio SFX + musik march + mix (`templates/audio/`); helper stills/sheet/QA (`templates/scripts/`); STYLE_BIBLE + 8 laporan terukur (`references/`).
- Yang SENGAJA tidak di-vendor: `references/frames/` (38 JPG) + `references/sheets/` (20 JPG), ~16,7 MB — SKILL.md sendiri melarang upload/publish/send materi referensi itu ("private study material"). Detail + cara ambil dari sumber: lihat `skills/claude-animated-shorts/INSTALL_NOTE.md`.
- Keamanan: 40 file cocok byte-size dengan upstream; scan statis bersih — satu-satunya proses luar adalah ffmpeg lokal (ukur loudness + ekstrak frame QA), list-form, tanpa shell, tanpa jaringan.
- Cara pakai: butuh Remotion + `@remotion/three`, Node, Python 3 (+ numpy/scipy), ffmpeg; `REMOTION_TMP` di drive besar. Render di Actions BELUM teruji — uji dulu sebelum diandalkan.
- Adaptasi Mangzoro: default skill berbahasa Inggris, tanpa caption, VO satu nada — perlu penyesuaian (VO Indonesia, subtitle karaoke, backsound per segmen) mengikuti `skills/hyperframes-composition-rules/SKILL.md` bila dipakai untuk channel.

## Rakit klip panjang
- Jalur utama yang sudah jalan: render per scene → concat ffmpeg (workflow `hyperframes-render-long.yml`).
- Alternatif bila butuh fleksibilitas lebih: [MoviePy](https://github.com/Zulko/moviepy) (14.407★, MIT) — Python, concat/overlay, terbukti di Actions. Editly lebih sederhana tapi cek dulu apakah masih dirawat.

## Cron analisa harian
- Metode: bedah video referensi shot-by-shot ala rea-video (lihat #11) — gerakan, warna, tipografi, pacing, transisi — lalu tuangkan 2–3 temuan konkret ke `skills/hyperframes-composition-rules/SKILL.md`.
- Catatan: cek lisensi rea-video dulu sebelum memakai kodenya; metodenya yang dipakai, bukan kodenya.

## Tidak direkomendasikan
- MotionForge / tamba / clipmill (0 star, baru, belum terbukti).
- ComfyUI & Blender (butuh GPU / berat, tidak cocok untuk runner Actions 2 CPU).
- Remotion sebagai tambahan baru — skill-nya sudah ada di repo ini, dan lisensinya membatasi pemakaian komersial di atas 3 orang.
- Catatan umum: runner Actions hanya 2 CPU — video panjang akan lambat di-render apa pun engine-nya; render bertahap per scene lalu concat ffmpeg tetap strategi yang benar.
