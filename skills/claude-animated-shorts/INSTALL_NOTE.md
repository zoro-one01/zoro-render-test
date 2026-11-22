# Catatan instalasi — claude-animated-shorts

Sumber: https://github.com/mromidev/claude-animated-shorts
(mromidev, MIT, 4.570★ / 951 fork, di-vendor ke repo ini 23 Nov 2026)
Nama internal skill: **cartoon-3d-short**

## Yang dipasang (40 file, 844 KB)

- `SKILL.md` — pipeline lengkap Shorts animasi 55–70 detik: karakter 2D di dunia 3D, three.js di dalam Remotion, render lokal tanpa AI video generator.
- `README.md`, `LICENSE` (MIT).
- `references/STYLE_BIBLE.md` + `references/reports/` (8 laporan terukur: motion, depth, textures, characters, lighting, outlines, grade, konteks).
- `templates/bridge/` — source lengkap Shorts contoh "The Bridge That Fell for a Song" (13 file .ts/.tsx: world, karakter, ink, lens blur, grade, story/camera).
- `templates/audio/` — sintesis suara: SFX + musik march + mix (7 file .py, numpy/scipy).
- `templates/scripts/` — helper stills, side-by-side sheet, QA frame-by-frame (5 file).
- `templates/SCRIPT_example.md`, `templates/sandbox_index_example.tsx`, `templates/audio/cues.md`.

## Yang SENGAJA tidak dipasang (58 file, ~16,7 MB)

- `references/frames/` (38 JPG) dan `references/sheets/` (20 JPG).
- Alasan: `SKILL.md` sendiri menyatakan materi referensi itu "private study material" dan melarang upload / publish / send. Jadi frame & sheet tetap tinggal di repo sumber — ambil dari sana bila butuh langkah look-check visual (side-by-side).
- Semua ukuran teksnya (nilai look, warna, kamera, dsb.) tetap ada di `SKILL.md` + `references/reports/`, jadi skill tetap bisa dipakai tanpa gambar-gambar itu.

## Pengecekan keamanan (sebelum pasang)

- 40 file cocok byte-size dengan upstream (GitHub API).
- Scan statis: satu-satunya pemanggilan proses luar adalah ffmpeg lokal di `templates/audio/mix.py` (ukur loudness ebur128) dan `templates/scripts/short_qa.py` (ekstrak frame untuk QA) — keduanya list-form, tanpa `shell=True`, tanpa jaringan, tanpa `eval`/`exec`.
- Tidak ada kredensial, token, atau network call di dalam skill ini.

## Kebutuhan untuk memakai

- Remotion + `@remotion/three`, Node, Python 3 (+ numpy, scipy), ffmpeg.
- Set `REMOTION_TMP` ke drive besar — tiap bundle menyalin `public/` (~1,3 GB) ke temp.
- Render di GitHub Actions BELUM teruji — uji dulu di runner sebelum diandalkan; runner hanya 2 CPU.

## Catatan adaptasi untuk Mangzoro

- Default skill: Bahasa Inggris, tanpa caption di video, VO satu nada steady.
- Bila dipakai untuk channel Mangzoro, perlu penyesuaian: VO Indonesia (Sadaltager), subtitle karaoke kata-per-kata, backsound per segmen, CTA TEBAK/PILIHAN GANDA — mengikuti rules di `skills/hyperframes-composition-rules/SKILL.md`.
