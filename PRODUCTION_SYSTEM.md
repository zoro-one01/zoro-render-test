# Imagine V1 — Production System (Fase 3)

Sistem produksi dan ketahanan Imagine: bagaimana kode disusun, bagaimana batch
3–4 episode dijalankan tanpa mengulang kerjaan, dan apa yang terjadi saat
sesuatu gagal. Dibangun dari audit kode `remotion-aneyoshi/` (4.580 baris),
workflow render yang sudah terbukti jalan, dan dua skill yang lahir dari
kegagalan nyata (`batch-video-run-recovery`, `disk-inventory-before-empty-report`).

> **Status:** Fase 3 selesai 24 Nov 2026. Dokumen ini adalah patokan produksi.
> Angka-angka di sini adalah hasil ukur, bukan janji — yang masih proyeksi
> ditandai **proyeksi**, yang belum diuji ditandai **belum diuji**.

## Prinsip

1. **Checkpoint dulu, kerja kemudian.** Setiap batch punya satu file checkpoint
   di folder outputnya. Tanpa checkpoint, run berikutnya tidak tahu apa yang
   sudah selesai.
2. **Resume, jangan restart.** File tahap yang sudah selesai dipakai ulang —
   setelah diverifikasi ulang. Kerjaan yang diulang adalah kerjaan yang dibuang.
3. **Suara yang disetujui tidak diganti sendiri.** Bila jalur VO yang disetujui
   tidak tersedia, episode itu berhenti dan menunggu keputusan user. Jangan
   ganti suara diam-diam.
4. **Disk dulu, baru lapor kosong.** Slot tidak boleh dinyatakan kosong sebelum
   folder output diperiksa. Laporan "tidak ada episode" yang tidak menyebut
   folder yang diperiksa = laporan yang belum selesai.
5. **Satu kegagalan tidak membunuh batch.** Segmen yang gagal di-render ulang
   sendiri; episode yang gagal tidak menghentikan episode lain.

## 1. Peta modul — engine vs episode

`remotion-aneyoshi/src/videos/aneyoshi/` — 16 file, 4.580 baris (per 24 Nov 2026):

| File | Baris | Tanggung jawab | Berubah seberapa sering |
|---|---|---|---|
| `toon.ts` | 913 | Gambar karakter (proporsi ~4,7 kepala, kartu 2D) | Sering (v2: proporsi) |
| `paint.ts` | 778 | Cat dunia (graniteHD, facadeHD incl. `jp`) | Sering (v2: granit + shoji) |
| `build.ts` | 711 | Bangun desa (MeshLambertMaterial, flip winding) | Sering (v2: material + winding) |
| `ink.ts` | 393 | Efek tinta (InkPass, default OFF) | Jarang |
| `cast.ts` | 384 | Pemeran + palet dimutekan | Per episode |
| `world.ts` | 329 | Dunia (glint matahari di air, kabut) | Jarang |
| `story.ts` | 328 | **Seam episode:** 13 shot, 26 setup kamera, TOTAL | Per episode |
| `grade.ts` | 179 | Grading warna | Jarang |
| `lensblur.ts` | 139 | Depth of field | Jarang |
| `Aneyoshi.tsx` | 127 | Komposisi root (EffectComposer, multisampling) | Jarang |
| `cardshade.ts` | 85 | Bayangan kartu karakter | Jarang |
| `shade.ts` | 77 | Bayangan dua-nada | Jarang |
| `Overlays.tsx` | 74 | 7 overlay informatif | Per episode |
| `lights.ts` | 63 | Preset cahaya `day` / `golden` | Jarang |
| `Root.tsx` + `index.ts` | — | Entry Remotion | Hampir tidak pernah |

**Temuan arsitektur (kandidat #1 — Strong):** semua file bernama "aneyoshi".
Episode kedua (mis. Tacoma) hari ini berarti menyalin seluruh struktur.
Pisahkan **engine** (dunia, cat, karakter, cahaya, grading — yang tidak berubah
antar episode) dari **episode** (`story.ts` + `cast.ts` + `Overlays.tsx` +
`SCRIPT.md` — yang berubah tiap episode). Struktur target:

```
remotion-aneyoshi/src/
  engine/            # toon, paint, build, world, lights, shade, grade, ink, lensblur
  episodes/
    aneyoshi/        # story.ts, cast.ts, Overlays.tsx
    tacoma/          # episode berikutnya
```

**Kapan:** saat episode kedua dimulai (Tacoma adalah pemicunya). Jangan
refactor sekarang — v2 sedang stabil dan refactor tanpa episode kedua untuk
diuji adalah refactor buta. Aturan pemisahnya: file engine tidak boleh
menyebut nama episode; file episode tidak boleh menduplikasi logika engine.

## 2. Episode baru = template

Untuk memulai episode baru (setelah §1 diterapkan; sebelum itu, salin folder
`aneyoshi/`):

1. `stories/<slug>/SCRIPT.md` — naskah dikunci (Gate 1, lihat
   `STORY_HOOK_SYSTEM.md`).
2. `episodes/<slug>/story.ts` — shot + kamera + TOTAL. **Jalankan
   `validate-story` sebelum dispatch apa pun (§6).**
3. `episodes/<slug>/cast.ts` — pemeran + palet (pakai token
   `DESIGN_SYSTEM.md`).
4. `episodes/<slug>/Overlays.tsx` — overlay informatif (maks. 1 per beat).
5. Storyboard dulu (workflow storyboard, 26 still) → review → baru render penuh.

## 3. Pipeline render (yang terbukti jalan)

Workflow: `.github/workflows/remotion-aneyoshi-full.yml` — `plan` (baca TOTAL
dari `story.ts` + hitung matrix segmen) → `render` (matrix, `fail-fast: false`)
→ `stitch` (download artifact → ffmpeg concat → commit MP4 ke `renders/`).

**Angka terukur:**

| Ukuran | Nilai | Sumber |
|---|---|---|
| Concurrency render | **4** (4,0 dtk/frame; c1/c2 5,7–5,8) | Benchmark 23 Nov |
| Multisampling | **0** (19,3% lebih cepat dari 4; visual sama) | Benchmark 24 Nov |
| Skala 0.5, 12 segmen | **proyeksi** ~12–16 mnt wall (segmen ~239 frame paralel) | Dari benchmark |
| Skala 0.25, 3 segmen | 84 mnt wall (segmen terberat 82 mnt: shot gempa/air) | Run 45150405960 |
| Skala 1.0 | **belum diuji** | — |
| Runner publik | 4 vCPU / 16 GB, 20 job konkuren, job maks 6 jam | Riset 23 Nov |
| Cache | `node_modules` (+ Chrome Headless Shell) per `package-lock.json` | Workflow |
| Timeout job render | 120 mnt | Workflow |
| Timeout job stitch | 30 mnt | Workflow |

**Aturan segmentasi:** skala 1.0 belum pernah diuji dan segmen terberat
(gempa/air) adalah risikonya terhadap timeout 120 mnt. Untuk skala 1.0, pakai
16–24 segmen supaya tiap segmen tetap di bawah ~60 mnt. Jangan naikkan skala
tanpa menaikkan jumlah segmen.

**Yang sudah benar dan jangan diubah:** `--gl=swangle` eksplisit,
`--concurrency 4`, `--timeout 180000`, `fail-fast: false` di matrix,
`[skip ci]` di commit hasil render.

## 4. Batch produksi (3–4 episode sekaligus)

Perintah batch 24 Nov ("produksi banyak aja sekaligus 3 atau 4 biar gak
tertunda lagi") adalah cara kerja resmi. Aturannya dari
`batch-video-run-recovery`:

### 4a. Checkpoint

Satu file checkpoint untuk seluruh batch, di folder yang sama dengan output
batch. Satu baris per episode per tahap yang selesai, dengan nama tahap +
path file hasil. Tahap berurutan: `script`, `clip cut`, `voice`, `body render`,
`cover`, `final file`. Tahap dianggap selesai hanya setelah filenya dibuka dan
diputar/dirender dengan ukuran yang diharapkan.

Format (contoh batch Ep50–Ep53):

```
# batch-2026-11-24 — checkpoint
# stage: script | clip | voice | body | cover | final
ep50 | script | prod/2026-11-23/ep50-cikande/ep-050.md
ep50 | voice | prod/2026-11-23/ep50-cikande/vo-full.wav
ep50 | final | your_files/ep50-final.mp4
ep51 | final | your_files/ep51-final.mp4
ep52 | voice | prod/2026-11-25/ep52-roanoke/vo-full.wav
ep53 | voice | PENDING — jalur VO tidak tersedia (Chrome user)
```

### 4b. Gate suara

Jalur VO yang disetujui: **Chrome user + Google AI Studio** (akun yang
sesi-nya aktif; Sadaltager, satu generation per episode). Jalur cloud 403
("No API key selected" / "The caller does not have permission") — bukan
kuota, dan jangan dibuatkan/impor proyek atau billing tanpa perintah user.
Bila jalur yang disetujui tidak tersedia: hentikan tahap VO episode itu,
catat sebagai menunggu keputusan user, dan **jangan** ganti suara sendiri.
Episode lain yang jalurnya tersedia tetap jalan.

### 4c. Resume

Run batch yang dimulai setelah run sebelumnya gagal/berhenti **wajib** membaca
checkpoint dulu, memakai ulang semua file tahap yang selesai (verifikasi ulang
dulu), dan memulai lagi hanya dari tahap pertama yang belum selesai per
episode. Urutkan episode yang bisa diselamatkan berdasarkan slot tayang
terdekat — episode yang slotnya paling dekat dikerjakan dulu.

### 4d. Laporan batch

Satu baris per episode: tahap saat ini, path file final bila selesai, dan
blocker bila macet. Sebutkan episode yang akan kehilangan slotnya dan tahap
apa yang masih hilang. Cantumkan path checkpoint supaya run berikutnya bisa
melanjutkan. Tutup dengan aksi berikutnya dan siapa yang harus melakukannya.

## 5. Recovery — celah yang ditemukan + prosedur hari ini

**Celah (temuan audit 24 Nov):**

| # | Celah | Dampak | Perbaikan yang dispesifikasi |
|---|---|---|---|
| R-1 | Job `stitch` `needs: render` — satu segmen gagal = stitch tidak jalan meski 11/12 segmen jadi | Render penuh gagal total karena satu segmen | Workflow `stitch-only` (dispatch manual, unduh artifact run tertentu) + naikkan retensi artifact segmen 1 → **7 hari** |
| R-2 | MP4 hasil stitch hanya di-commit; bila commit/push gagal, MP4 hilang | Render hilang meski sudah jadi | Upload MP4 final sebagai **artifact dulu**, baru commit |
| R-3 | Langkah setup (checkout, node 22, ffmpeg, npm install, browser ensure) diduplikasi di 4 workflow | Satu kelupaan = bug (benchmark lupa ffmpeg, exit 127 setelah render selesai) | Composite action `.github/actions/remotion-setup/action.yml` dipakai semua workflow |
| R-4 | Skala 1.0 belum diuji vs timeout 120 mnt | Segmen terberat bisa timeout | 16–24 segmen untuk skala 1.0 (§3) |

**Prosedur recovery hari ini (sampai R-1–R-3 diterapkan):**

1. Lihat job render yang gagal di run tersebut; catat nomor segmen + frame-nya.
2. Render ulang segmen itu sendiri via workflow test lama
   (`remotion-aneyoshi-test.yml`, isi `start_frame` + `end_frame`).
3. Unduh semua artifact segmen run penuh + segmen pengganti.
4. Jahit lokal: `ffmpeg -f concat -safe 0 -i list.txt -c copy <output>.mp4`
   (cara yang dipakai untuk v2 penuh 23 Nov — 6 segmen, sambungan mulus).
5. QC file jahitan (durasi = TOTAL/30, putar sambungan), lalu commit ke
   `renders/` seperti biasa.

## 6. Validasi sebelum render — `validate-story`

`remotion-aneyoshi/scripts/validate-story.mjs` (Node, tanpa dependensi).
Jalankan dari `remotion-aneyoshi/` sebelum dispatch render/storboard apa pun:

```
node scripts/validate-story.mjs
```

Yang dicek: TOTAL ter-parse; shot berurutan, mulai 0, berakhir tepat di
TOTAL, tanpa celah/tumpang tindih; key kamera pertama = awal shot, semua key
di dalam shot, glide tidak melewati akhir shot; DOF menaik dan di dalam
rentang; foreground di dalam satu shot; XFADE untuk shot yang ada; FLASH_AT
di batas shot; WAVE/QUAKE dalam durasi video; overlay di dalam [0, TOTAL),
tidak tumpang tindih, dan tidak melewati batas shot (warning).

**Teruji 24 Nov:** PASS di kode v2 (13 shot, 7 overlay, 0 warning); FAIL
dengan benar di salinan rusak (3 error + 1 warning: celah shot, key kamera
di luar shot, glide melewati shot, overlay melewati batas shot). Exit 0 =
lolos, exit 1 = ada error.

**Pemasangan berikutnya (belum diterapkan):** tambah npm script
`"validate:story": "node scripts/validate-story.mjs"` di `package.json`,
dan jalankan di job `plan` workflow full/storyboard sebelum matrix dihitung —
supaya timeline rusak gagal di detik pertama, bukan setelah render.

## 7. Disk inventory — sebelum lapor kosong

Dari `disk-inventory-before-empty-report` (lahir dari run yang melaporkan
slot kosong padahal file ada di disk):

1. Baca checkpoint batch dulu bila ada.
2. List folder output meski checkpoint kosong/hilang:
   - `workspace/goals/serial-youtube-proses-langka/hidden_files/prod/<tanggal>/`
     (produksi Mangzoro)
   - `~/workspace/your_files/` (file final)
   - `renders/` di repo (hasil render Actions)
3. Cocokkan file dengan slot dari nama + tanggalnya; buka/putar sebentar
   untuk memastikan lengkap sebelum dipakai.
4. File di luar sistem batch yang nama + tanggalnya cocok = kerjaan yang
   ditemukan — laporkan sebagai ditemukan (dengan status verifikasinya),
   jangan di-regenerate.
5. Bila tetap tidak ada: sebutkan folder yang sudah diperiksa + hasil
   checkpoint, baru minta bagian yang hilang ke user.

Aturan ini mengikat run analitik juga: laporan "tidak ada episode" wajib
dicek ke disk dulu (aturan lama yang sama).

## 8. Checklist per episode (gate)

- [ ] Gate 0: fakta terverifikasi (lihat `STORY_HOOK_SYSTEM.md` §7)
- [ ] Gate 1: naskah dikunci user
- [ ] `validate-story` PASS
- [ ] Storyboard 26 still → review → perbaikan (lihat
      `remotion-aneyoshi/STORYBOARD_WORKFLOW.md`)
- [ ] Render penuh (skala 0.5 dulu; skala 1.0 hanya dengan §3)
- [ ] Assembly: VO + karaoke + backsound 30% (tanpa sidechain) + loudnorm
      I=-14:TP=-1.5:LRA=11
- [ ] QC: durasi, karaoke di titik cek, loudnorm, sambungan segmen
- [ ] Checkpoint diperbarui (§4a)
- [ ] CTA dipasang + di-pin **saat tayang** (bukan sesudahnya)

## 9. Yang tidak boleh diulang

- **Membuat tag/release tanpa cek trigger workflow.** Tag memicu workflow
  yang punya trigger tag (23 Nov: 3 run otomatis dari tag `aneyoshi-final-v1`).
- **Lupa install ffmpeg di workflow baru.** Benchmark 24 Nov: render 150/150
  selesai, lalu gagal `ffprobe: command not found` (exit 127).
- **Menilai video dari jam pertama.** Vonis setelah 24 jam, dari retensi.
- **Tayang tanpa CTA terpasang.** Ep49: rekor views, komentar kosong.
- **Membuat/impor proyek atau mengatur billing AI Studio tanpa perintah user.**
  Diagnosis 403 cloud = sesi belum menautkan proyek/API key berbayar.
- **Render skala 1.0 dengan 12 segmen.** Pakai 16–24 segmen (§3).
- **Melaporkan slot kosong tanpa cek disk** (§7).
