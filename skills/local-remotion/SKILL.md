---
name: local-remotion
description: Render video motion graphics dengan Remotion (React → MP4). Project siap pakai di ~/workspace/remotion-studio; render lokal terverifikasi di VM ini.
---

# Remotion Studio (lokal)

Project Remotion terpasang dan terverifikasi di VM ini: **~/workspace/remotion-studio** (Remotion 4.0.536).

## Kapan pakai skill ini
- User minta video motion graphics / animasi programatik (judul, lower third, explainer, motion-graphic korporat).
- Bukan untuk video AI generatif (Veo/Runway) — itu urusan `mkt_video`.

## Perintah dasar

```bash
cd ~/workspace/remotion-studio

# render komposisi (format: npx remotion render <entry> <id> <output>)
npx remotion render src/index.ts HelloWorld out/namafile.mp4

# render dengan props dinamis (data-driven)
npx remotion render src/index.ts HelloWorld out/namafile.mp4 \
  --props='{"titleText":"Pedee NOC","titleColor":"#9fe870"}'

# codec web-friendly
npx remotion render src/index.ts HelloWorld out/namafile.mp4 --codec=h264 --crf=18
```

Preview interaktif (`npx remotion studio`) hanya bisa dibuka dari browser — untuk QA headless cukup render MP4 lalu cek durasi/resolusi dengan `ffprobe`.

## Workflow bikin video baru
1. Tulis komposisi baru di `src/compositions/<Nama>.tsx` (React + `remotion` hooks: `useCurrentFrame`, `spring`, `interpolate`, `AbsoluteFill`).
2. Daftarkan di `src/RemotionRoot.tsx` lewat `<Composition id="..." durationInFrames fps width height defaultProps />`.
3. Render ke `out/` dan verifikasi (ffprobe / tonton file).
4. Kirim MP4 ke user sebagai attachment.

## Aturan render
- **Deterministik:** jangan pakai `Date.now()`, `Math.random()`, atau fetch network saat render — input sama harus menghasilkan MP4 sama.
- Animasi: otomatis via spring/interpolate (sesuai preferensi user: CSS/JS otomatis, bukan parallax mouse-driven — untuk video memang tidak relevan, tapi prinsipnya sama: tidak ada interaksi manual).
- Default: 30fps. Resolusi umum: 1280x720 (landscape), 1080x1920 (portrait).
- Voiceover/narasi: render video bisu dulu, lalu gabung audio dengan ffmpeg (ffmpeg tersedia di VM).
- Untuk ide struktur & storytelling video marketing, baca juga `~/workspace/custom-skills/mkt-video/SKILL.md`.
