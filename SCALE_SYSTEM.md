# Imagine V1 — Scale System (Fase 5)

Sistem skala Imagine: bagaimana satu episode yang terbukti jalan menjadi
banyak episode tanpa menurunkan kualitas — lewat template, batch mingguan,
dan (opsional) Imagine sebagai MCP tool. Skala di sini berarti lebih banyak
episode dengan kualitas yang sama, bukan lebih banyak volume dengan kualitas
yang turun.

> **Status:** Fase 5 selesai 24 Nov 2026. Dokumen ini adalah patokan skala.
> Tacoma masih DRAF (Gate 1 belum lewat — jangan dibangun sebelum user
> menyetujui naskahnya). MCP masih SPEK — servernya belum dibangun.

## Prinsip

1. **Template adalah pengali.** Setiap episode baru mulai dari template yang
   sudah teruji, bukan dari halaman kosong. Waktu yang dihemat dipakai untuk
   cerita dan dunia — bukan untuk mengulang setup.
2. **Batch adalah unit kerja.** Produksi jalan per batch 3–4 episode, bukan
   per episode dadakan. Batch punya checkpoint, dan checkpoint yang membuat
   batch aman (lihat `PRODUCTION_SYSTEM.md` §4).
3. **Bottleneck-nya VO, bukan render.** Render bisa paralel; VO Sadaltager
   hanya bisa lewat satu sesi Chrome user. Jadwal batch dihitung dari VO,
   bukan dari kecepatan render.
4. **Jangan skala yang belum terbukti.** Yang diskala hanya pola yang sudah
   menang (formula hook, format, design system). Yang masih hipotesis tetap
   diuji satu episode dulu.

## 1. Throughput (yang terukur)

| Tahap | Waktu terukur | Sumber |
|---|---|---|
| Storyboard (26 still) | 2 mnt 3 dtk | Run 45150318613 |
| Render penuh skala 0.5, 12 segmen | **proyeksi** ~12–16 mnt wall | Benchmark (4,0 dtk/frame) |
| Render segmen terberat (gempa/air) | 82 mnt (skala 0,25) | Run 45150405960 |
| VO satu episode | 1 generation AI Studio | Ep51/Ep52 (Chrome user) |
| Aneyoshi v1→final (naskah disetujui → final 95 dtk) | ~6,5 jam wall, 1 hari | 23 Nov 09:29 → 15:49 |
| Batch 4 episode (Ep50–Ep53) | 1 hari (produksi + VO + QC) | 24 Nov |

**Kapasitas saat ini:** 1 Short/hari 18:30 + 2 video panjang/minggu.
**Target Founder (9 Nov):** bertahap dari baseline ~1.300 views. Target
kadensi 2 episode/hari adalah keputusan evaluasi Minggu 29 Nov — bukan
dari satu snapshot (lihat `DISTRIBUTION_SYSTEM.md` §1).

**Batas keras Actions (Free, repo publik):** 20 job konkuren, job maks 6 jam,
cache repo 10 GB, runner 4 vCPU/16 GB. Batch 4 episode = 4 workflow × 12
segmen = 48 job — melebihi 20 konkuren, jadi antre. Itu normal (antre,
bukan gagal); wall time batch tumbuh. Dispatch episode berurutan dengan
jeda ~15 menit, atau terima antrean.

## 2. Episode template

Lokasi: `remotion-aneyoshi/src/episodes/_template/` — `story.ts` +
`Overlays.tsx`. Keduanya **teruji**: `validate-story` PASS (2 shot,
1 overlay, 0 warning) dan `tsc --noEmit` bersih untuk seluruh proyek
(24 Nov).

Isi template:

- `story.ts` — kerangka lengkap: FPS, TOTAL, tipe `ShotDef`/`Cam`/`Key`,
  `SHOTS` (2 shot contoh), `XFADE`, `FLASH_AT`, `shotAt`, `layersAt`,
  grammar kamera (`glide`, `pushK`, `dolly`, `zoom`, `run`, `camAt`),
  `DOF`, `FOREGROUND` (kosong). Impact kicks sengaja TIDAK ada — salin
  dari Aneyoshi bila episode butuh hentakan.
- `Overlays.tsx` — 1 overlay contoh + aturan gaya (lihat
  `DESIGN_SYSTEM.md` §4).

Cara memulai episode baru:

1. Salin folder `_template/` menjadi `episodes/<slug>/`.
2. Tulis `SCRIPT.md` di `stories/<slug>/` (Gate 0: fakta terverifikasi;
   Gate 1: user setujui naskah).
3. Isi `story.ts`: TOTAL dari durasi VO (isi SETELAH VO jadi — Aneyoshi
   di-retime ×1,519), SHOTS berurutan, CAMS per shot.
4. Isi `Overlays.tsx`: maks. 1 overlay per beat.
5. Jalankan `validate-story` pada kedua file itu SEBELUM storyboard.
6. Ikuti playbook `STORYBOARD_WORKFLOW.md` (storyboard → review → render
   penuh → assembly → QC).

**Pisah engine/episode (dari Fase 3):** pemisahan `engine/` vs `episodes/`
dijalankan saat episode kedua dimulai — yaitu saat Tacoma lewat Gate 1.
Sampai saat itu, template hidup berdampingan dengan kode Aneyoshi tanpa
mengubahnya.

## 3. Batch mingguan

Satu minggu produksi (Short harian + 1 video panjang):

| Hari | Kerja |
|---|---|
| Senin | Planning: pilih topik dari bank ide (Fase 1) untuk 7 Short + 1 panjang; kunci naskah 2–3 episode terdekat |
| Selasa | Storyboard + review episode Rabu–Kamis; produksi video panjang Rabu (run 20:00) |
| Rabu | Render + assembly episode Kamis–Jumat; video panjang tayang 19:00 |
| Kamis | Storyboard + review episode Jumat–Sabtu |
| Jumat | Render + assembly episode Sabtu–Minggu; produksi video panjang Sabtu (run 20:00) |
| Sabtu | Render + assembly episode Minggu–Senin; video panjang tayang 19:00 |
| Minggu | Evaluasi mingguan: snapshot + UPGRADE vs MAINTENANCE + pola menang masuk bank ide |

Setiap batch punya checkpoint (`PRODUCTION_SYSTEM.md` §4a). Episode yang
slotnya paling dekat dikerjakan dulu bila ada yang macet.

## 4. Tacoma — calon episode kedua

Status: **DRAF naskah, Gate 1 BELUM lewat.** User belum menyetujui Tacoma
secara eksplisit (23 Nov pindah minta tsunami). Jangan bangun sebelum
persetujuan. Yang sudah ada: `stories/tacoma-narrows/SCRIPT.md` (fakta
terverifikasi: Wikipedia + UW Film Collection + EARTH Magazine) dan
`stories/tacoma-narrows/SHOT_PLAN.md` (pemetaan beat → shot).

**Koreksi penting dari shot plan:** naskah menulis "~66 detik pada 3,7
kata/detik" — itu laju bahasa Inggris. VO Indonesia (Sadaltager ~2,4
kata/dtk) membuat ±226 kata menjadi **~94 detik (~2.828 frame)** — sekelas
Aneyoshi (95,7 dtk), bukan 66 detik. Pilihannya di Gate 1: terima ~95 dtk,
atau potong beat (naskah sendiri menyarankan potong beat 4 atau 11).

**Cakupan dunia (baru, bukan daur ulang):** jembatan gantung 1940 (dua
menara + kabel utama + lantai pelat), Selat Puget, mobil era 1940, angin.
Yang dipakai ulang dari engine: pipeline Remotion + three.js, post chain,
gaya karakter. Yang baru: builder jembatan, Tubby (anjing — desain
karakter hewan baru di `toon.ts`), gerakan angin/laut. Tokoh: Profesor
Farquharson, pengemudi, Tubby.

**Shot kunci (dari catatan produksi naskah):** wide jembatan utuh hari
cerah; close-up lantai bergelombang; twist memuntir (satu sisi naik, sisi
lain turun); mobil ditinggalkan + profesor berlari; snap lantai 180 meter
robek jatuh; laut tenang + terumbu karang (callback).

## 5. Imagine sebagai MCP (spek)

Mengikuti skill `mcp-builder`. **Spek saja — server belum dibangun.**
Keputusan implementasi: TypeScript, MCP SDK **v2**
(`@modelcontextprotocol/server` — v1 hanya menerima bug/security fix),
Zod 4 untuk skema, transport **stdio** untuk lokal dan **Streamable HTTP +
bearer auth** untuk remote.

### Tools

| Tool | Deskripsi | Anotasi |
|---|---|---|
| `imagine_list_episodes` | Daftar episode + status + slot tayang | readOnly |
| `imagine_get_episode` | Rekor lengkap satu episode (naskah, shot, overlay, file, QC) | readOnly |
| `imagine_validate_story` | Jalankan `validate-story` pada file story + overlays; kembalikan PASS/FAIL + error | readOnly |
| `imagine_list_ideas` | Bank ide 56 topik + status (IDE / dipakai / menang) | readOnly |
| `imagine_get_analytics` | Snapshot analitik terakhir per episode (views, retensi, verdict) | readOnly |
| `imagine_get_system_doc` | Satu dokumen sistem (story/design/production/distribution/scale) | readOnly |
| `imagine_render_episode` | Dispatch workflow render penuh untuk satu episode (perlu konfirmasi user — Gate) | openWorld, **bukan** idempotent, **bukan** readOnly |

### Resources & prompts

- Resources: `imagine://docs/*` (5 dokumen sistem), `imagine://episodes/*`,
  `imagine://analytics/latest`.
- Prompt: `new-episode-brief` (input: segmen + topik → output: checklist
  Fase 0: Gate 0, formula hook, bank ide yang relevan).

### Pengujian (saat dibangun)

- `npm run build` + self-check script dari panduan v2 + MCP Inspector
  (`npx @modelcontextprotocol/inspector`).
- Error message harus actionable (menunjuk solusi + langkah berikutnya),
  bukan sekadar kode error.

### Evaluasi (10 pertanyaan — jawaban terverifikasi dari repo)

| # | Pertanyaan | Jawaban |
|---|---|---|
| 1 | Berapa TOTAL frame episode Aneyoshi? | 2871 |
| 2 | Berapa overlay episode Aneyoshi? | 7 |
| 3 | Hex kuning brand di design token? | #FFD23F |
| 4 | Episode dengan retensi tertinggi? | Ep49, 72,6% |
| 5 | Nilai multisampling di Aneyoshi.tsx? | 0 |
| 6 | Jumlah segmen default workflow full? | 12 |
| 7 | Jam tayang Short harian? | 18:30 WIB |
| 8 | Concurrency render penuh? | 4 |
| 9 | Nama anjing di cerita Tacoma? | Tubby |
| 10 | Views Ep49 di Snapshot 32? | 2.852 |

## 6. Yang tidak boleh diskala

- Penggantian suara tanpa keputusan user (gate VO).
- Caption Facebook hasil salinan judul YouTube (peringatan 3 Nov).
- Menilai dari jam pertama (vonis 24 jam).
- Tayang tanpa CTA terpasang.
- Membuat tag/release tanpa cek trigger workflow.
- Render skala 1.0 dengan 12 segmen (pakai 16–24).
- Melaporkan slot kosong tanpa cek disk.

## 7. Sesudah Fase 5 — apa berikutnya

1. **Vonis Ep51 (25 Nov)** → tulis ke `STORY_HOOK_SYSTEM.md` + MEMORY.md.
2. **Evaluasi mingguan (Minggu 29 Nov)** → keputusan naik kadensi.
3. **Tacoma Gate 1** → bila user setujui: jalankan pisah engine/episode,
   bangun dunia jembatan, ikuti template.
4. **Perbaikan workflow (dari Fase 3, R-1–R-3)** → `stitch-only` workflow,
   retensi artifact 7 hari, composite action setup — sebelum render penuh
   berikutnya.
5. **Dasbor interaktif (spek di Fase 4 §6)** → bangun saat ada ekspor Studio.
6. **MCP server (§5)** → bangun bila ada kebutuhan nyata (agen lain atau
   integrasi eksternal yang memanggil Imagine), bukan karena bisa.
