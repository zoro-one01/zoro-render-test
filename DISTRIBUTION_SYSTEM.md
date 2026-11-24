# Imagine V1 — Distribution System (Fase 4)

Sistem distribusi dan feedback Imagine: kapan tayang, bagaimana tiap platform
diperlakukan, bagaimana komentar dibalas, dan bagaimana angka harian kembali
menjadi keputusan cerita. Semua aturan di sini datang dari kejadian nyata
(ledger distribusi + log analitik), bukan dari teori platform.

> **Status:** Fase 4 selesai 24 Nov 2026. Dokumen ini adalah patokan distribusi.
> Angka-angka di sini adalah Snapshot 32 (24 Nov 19:42) dan run distribusi
> 24 Nov 15:42 — sumber kebenaran untuk angka adalah log di goal
> (`hidden_files/analitik-log.md`, `hidden_files/distribusi-ledger.md`).

## Prinsip

1. **Slot adalah janji.** Slot 18:30 yang kosong = jatah distribusi yang hilang
   hari itu. Produksi ada untuk mengisi slot, bukan sebaliknya.
2. **CTA dipasang saat tayang, bukan sesudahnya.** Episode yang tayang tanpa
   CTA = episode yang tidak bisa diukur perbandingan TEBAK vs PILIHAN GANDA-nya.
3. **Satu aset, tiga perlakuan.** Video yang sama di-YouTube, TikTok, dan
   Facebook — tapi judul, caption, dan waktunya disesuaikan per platform.
   Menyalin mentah-mentah adalah cara tercepat kena penalti distribusi.
4. **Angka dulu, vonis kemudian.** Jangan nilai video dari jam pertama.
   Vonis setelah 24 jam, dari retensi — dan dari sumber yang sama setiap kali.
5. **Komentar penonton adalah sinyal, bukan hiasan.** Komentar pertama
   penonton dibalas dalam hitungan jam, terverifikasi tampil.

## 1. Jadwal

| Slot | Platform | Waktu (WIB) | Isi |
|---|---|---|---|
| Short harian | YouTube | 18:30 | 1 Short/hari, segmen harian |
| Short harian | Facebook Page | 18:30 | Repost Short hari itu (1/hari) |
| Short harian | TikTok | 19:30 | Clone episode YouTube terbaru (mode clone) |
| Video panjang | YouTube | Rabu + Sabtu, 19:00 | Deep-dive 8–12 menit dari tema segmen hari itu |

Run otomatis (cron):

| Run | Waktu | Tugas |
|---|---|---|
| Produksi harian | 08:42 | Produksi episode hari itu |
| Distribusi | 15:42 | Upload/jadwalkan + pasang CTA + rekonsiliasi |
| Analitik harian | ±19:42 | Snapshot + verdict UPGRADE vs MAINTENANCE (laporan WA) |
| Produksi video panjang | Selasa + Jumat, 20:00 | Produksi video panjang untuk slot besok |

Aturan kadensi: ritme 1 Short/hari + 2 video panjang/minggu TETAP sampai
evaluasi Minggu 29 Nov. Syarat naik kadensi (Studio pulih ✓, retensi format
baru sehat ✓, subscriber bergerak ✓) ketiganya terpenuhi per Snapshot 32 —
tapi keputusan naik tetap di evaluasi mingguan, bukan dari satu snapshot.

## 2. Per platform

### YouTube Shorts

- Judul **ALL CAPS** + `| <Segmen> #shorts` (contoh: "115 ORANG HILANG,
  TINGGAL SATU KATA DI TIANG! | Misteri #shorts").
- Thumbnail kustom terpasang; bukan untuk anak-anak; bahasa Indonesia;
  hak cipta bersih — semua diverifikasi di halaman detail sebelum dinyatakan
  terjadwal.
- **CTA dipasang + di-pin saat tayang.** Teks CTA = satu pertanyaan, satu
  variabel (TEBAK vs PILIHAN GANDA bergantian). Tes berikutnya: pertanyaan
  yang jawabannya sudah terlihat/terucap di video.
- Judul tampil di Studio untuk video lama **JANGAN** dipakai untuk analisis
  hook (anomali judul Studio belum terverifikasi).
- Video panjang **JANGAN** mengandung "#shorts" di judul (kesalahan Baikal —
  perbaiki di Bermuda).

### TikTok (mode clone)

- Clone episode YouTube terbaru yang tayang dan belum di-clone, 1 jam setelah
  slot YouTube (19:30).
- **Cek duplikat dulu** (pencarian judul + Drafts 0) sebelum upload — jangan
  pernah upload ulang episode yang sama.
- Caption = persis judul YouTube; audience Everyone; lencana jadwal
  terverifikasi di daftar Postingan + setelah reload.
- Jam TikTok dari analisa: puncak WIB 12.00–13.00 & 19.00–21.00, hari
  terkuat Selasa–Kamis; posting 30–60 menit sebelum puncak (slot 19:30
  masuk jendela ini).

### Facebook Page

- **1 posting/hari**, 18:30. Kartu persetujuan user berlaku per posting —
  write hanya setelah user tap kartu.
- Caption **sentence case + relevan dengan isi video**. All-caps HANYA untuk
  judul YouTube — jangan pernah disalin ke caption Facebook.
- Caption hanya mendeskripsikan apa yang benar-benar ada di video; jangan
  pakai janji judul yang subjeknya berbeda dari footage.
- **Peringatan distribusi 3 Nov 12:32 (masih terbuka):** FB memberi sinyal
  "keterangan mungkin menyesatkan/tidak berkaitan" (pemicu yang disebut FB:
  terlalu banyak huruf kapital atau tidak relevan). Dugaan kuat: caption
  memakai judul YouTube FULL CAPS. Postingan yang kena peringatan **belum
  teridentifikasi** — jangan klaim sudah diperbaiki sebelum postingannya
  ditemukan. Aturan caption di atas adalah pencegahan untuk posting
  berikutnya, bukan perbaikan yang terverifikasi.
- Setelah tayang, baca kembali postingan dan bandingkan caption live dengan
  yang disetujui sebelum melaporkannya sebagai terbit.

### Persetujuan (aturan 30 Okt)

- Upload YouTube + TikTok **TIDAK** menunggu oke pratinjau — pratinjau WA =
  info saja, upload jalan langsung.
- Kartu persetujuan Facebook **tetap berlaku** per posting.

## 3. Run distribusi (checklist 15:42)

1. **Cek disk dulu** (lihat `PRODUCTION_SYSTEM.md` §7): final episode hari
   ini ada? MD5 cocok ledger? Cover ada?
2. **Rekonsiliasi tiap platform:** cari duplikat (filter judul di Studio /
   TikTok / posts list FB) sebelum upload.
3. **YouTube:** upload/jadwalkan 18:30, pasang thumbnail kustom, verifikasi
   status Dijadwalkan di halaman detail.
4. **CTA:** pasang + pin di episode yang tayang hari ini (dan episode
   sebelumnya yang CTA-nya masih tertunda, bila sesinya tersedia).
5. **TikTok:** clone 19:30 setelah cek duplikat.
6. **Facebook:** tulis caption sentence case, tunggu kartu persetujuan user,
   jadwalkan 18:30, rekonsiliasi posts list.
7. **Tulis ledger** (`distribusi-ledger.md`): apa yang tayang/terjadwal di
   tiap platform + ID + status CTA + 3 video berikutnya + BUTUH USER.
8. **Jangan retry publish otomatis.** Bila hasil tidak pasti, cari dulu
   postingannya — percobaan pertama mungkin sudah berhasil.

## 4. Komentar — protokol balasan

- Komentar penonton dibalas **dalam hitungan jam**, bukan hari. Balasan
  diverifikasi tampil di bawah komentarnya sebelum dilaporkan.
- Balasan singkat, hangat, dan membenarkan jawaban yang benar bila memang
  benar — tanpa ceramah, tanpa template panjang.
- Komentar sematan CTA (komentar channel sendiri) **bukan** komentar penonton
  — jangan pernah diklaim sebagai komentar penonton sebelum isinya
  terverifikasi.
- **Contoh yang benar (Ep51, 24 Nov 23:39–23:40):** komentar penonton
  pertama episode terbaru — @EyhAkuTakdeKomenApepunPada: "Amin Amarth,
  🤟🏻🤟🏻" (jawab opsi A, benar; CTA sematan Ep51 sendiri BELUM terpasang —
  penonton menjawab dari isi video). Dibalas: "Betul! 🤟 Amon Amarth, band
  metal asal Swedia. Makasih udah jawab!" — terverifikasi tampil.
- Komentar penonton lama (Ep28/Ep29/Ep19/Ep10/Ep7) semua sudah dibalas
  channel. Total per 24 Nov 23:36: 42 komentar (6 penonton + 31 sematan
  channel + 5 balasan channel).

## 5. Analitik harian (snapshot 19:42)

Sumber kebenaran berlapis — bila berbeda, urutannya:

1. **YouTube Analytics** = referensi.
2. Daftar Konten Studio (views + komentar).
3. `yt-dlp` exact (angka mentah, tanpa pembulatan Studio).

**Aturan hitung (dari mkt-analytics):**

- Hitung dari data baris, jangan dari ingatan — dan cek ulang angka headline
  dengan cara kedua yang independen (mis. Analytics vs daftar Konten vs
  yt-dlp) sebelum dilaporkan. Selisih apa pun ditelusuri ke barisnya.
- Samakan jendela observasi: laju/rasio membagi pembilang dan penyebut dari
  jendela yang sama dan sudah tertutup. Jangan bagi views periode penuh
  dengan hasil periode parsial.
- **Jangan nilai dari jam pertama — tunggu 24 jam.** Episode yang masih di
  dalam jendelanya = pending, bukan gagal.
- Laporkan angka per segmen/episode dengan angkanya sendiri; jangan biarkan
  total grup mewakili satu episode.
- Tandai masalah kualitas data apa adanya, jangan diam-diam diakali:
  tampilan Studio "Indonesia 113%" (Ep43) = kemungkinan kesalahan tampilan;
  jumlah retensi 100,1% (Ep46) = pembulatan Studio.

**Field snapshot per episode:** views (+delta), like (+like rate), komentar
(penonton vs channel — isi terverifikasi atau tidak), subscriber (+delta),
retensi (ditonton vs swipe), jam tonton, penayangan 48 jam, sumber traffic
(Feed Shorts / Penelusuran / lainnya), catatan.

**Pola yang sudah terbukti (Snapshot 32):**

| Episode | Views | Retensi | Status |
|---|---|---|---|
| Ep49 Titor (Teori) | 2.852 | 72,6% | **Rekor + retensi tertinggi channel** |
| Ep35 Kola (Fakta) | 2.078 | 65,4% | Kontributor subs kumulatif terbaik (+5) |
| Ep27 Coober Pedy (Fakta) | 2.030 | 65,4% | Benchmark internal |
| Ep15 Sumur (Tempat) | 2.018 | 68,1% | Like terbanyak (51) |
| Ep46 Cooper (Misteri) | 1.388 | 65,6% | Format baru sehat |
| Ep47 Waitomo (Tempat) | 1.248 | 54,7% | Format baru sehat |
| Ep43 Svalbard (Tempat) | 1.333 | 32,6% | **Retensi terendah — kasus hook** |
| Pilot Tual | 261 | 38,0% | Kasus format karakter |
| Baikal (panjang) | 70 | 42% (3:14/7:36) | Terlalu dini untuk vonis; CTR 2,1% |

- Video matang DATAR TOTAL (+0) kecuali Ep49 (+186), Baikal (+42), Ep41
  (+4), Ep36 (+~2) — pertumbuhan kini HANYA dari video baru + Ep49.
- Plafon video matang ±1,3 rb; baseline Founder ±1.300; target bertahap
  dari baseline (keputusan 9 Nov).
- Audiens: 99% penonton baru, 0% kembali, mayoritas pria 25–34, Indonesia
  ±97%.

## 6. Dashboard (spesifikasi)

Dasbor per episode — datanya dari `analitik-log.md` (bukan dari ekspor yang
tidak ada). Panelnya, mengikuti `analytics-dashboard` yang diadaptasi ke
YouTube Shorts:

1. **Headline:** total views 28 hari, subscriber, rata-rata views/episode
   baru, retensi rata-rata format baru, total komentar penonton.
2. **Tren:** views harian per episode baru (garis) + subscriber kumulatif.
3. **Scatter episode** (X = views, Y = retensi):
   - **Stars** (views tinggi + retensi tinggi): Ep49, Ep15, Ep35, Ep27.
   - **Viral tapi dangkal** (views tinggi + retensi rendah): Ep43.
   - **Niche gold** (views rendah + engagement tinggi): Ep51 sinyal awal
     (like rate jam pertama 2,36% tertinggi) — penempatan menunggu vonis 24 jam.
   - **Underperformer** (keduanya rendah): pilot Tual.
4. **Heatmap hari:** hari terkuat tayang (TikTok: Selasa–Kamis; YouTube:
   kadensi harian — pola per hari tayang masih dikumpulkan).
5. **Audiens:** baru vs kembali, usia, geografi.
6. **Status slot:** slot terisi/kosong per hari + episode berikutnya + blocker.

Format angka: `2.852` bukan `2852`; retensi satu desimal; delta selalu
dengan pembandingnya (kemarin / 24 jam lalu). **Tidak ada angka tanpa sumber.**

Bangun dasbor interaktifnya saat ada ekspor Studio — dokumen ini adalah
spesifikasinya, bukan dasbornya.

## 7. Feedback loop — dari angka kembali ke cerita

Setiap snapshot ditutup dengan verdict:

- **UPGRADE** (perbaiki sekarang): item konkret + dasar angkanya.
- **MAINTENANCE** (jangan diubah): apa yang terbukti jalan + dasar angkanya.

**Contoh Snapshot 32:** UPGRADE = pasang CTA Ep51 + Ep49 segera; bedah hook
Ep43 vs Ep37/Ep47 (selisih 22–25 poin dalam satu pilar); verifikasi notifikasi
"Video diblokir" Ep43. MAINTENANCE = format footage + Remotion + VO
Sadaltager (retensi sehat); slot 18:30 prioritas; ritme tetap sampai 29 Nov.

**Yang kembali ke Fase 1 (Story & Hook):**

- **Vonis Ep51 — 25 Nov:** bila 24 jam tembus ±2.000, formula "klaim ekstrem
  + angka" resmi; bila kembali ke ±1,3 rb, Ep49 adalah outlier topik. Tulis
  hasilnya ke `STORY_HOOK_SYSTEM.md` + MEMORY.md.
- **Bedah Ep43:** bandingkan 3 detik pertama + judulnya dengan Ep37/Ep47
  sebelum produksi episode Tempat berikutnya; jangan ulangi pola judul tenang.
- **Baikal 48 jam:** pantau sampai 25 Nov malam sebelum vonis video panjang.
- **CTA TEBAK vs PILIHAN GANDA:** perbandingan MASIH belum bisa dibaca —
  CTA Ep51 + Ep49 sama-sama belum terpasang saat snapshot. Jangan simpulkan
  sebelum keduanya terpasang + ada komentar penonton di keduanya.
- **Evaluasi mingguan Minggu 29 Nov:** keputusan naik kadensi + pola menang
  masuk bank ide Fase 1 berikutnya.

## 8. Ledger + log (sumber kebenaran)

- `hidden_files/distribusi-ledger.md` — tiap run: disk, YT, TikTok, FB,
  CTA, 3 video berikutnya, BUTUH USER. Diperbarui tiap run 15:42.
- `hidden_files/analitik-log.md` — tiap snapshot: per episode + video matang
  + baca cepat + UPGRADE vs MAINTENANCE. Diperbarui tiap run 19:42.
- Keduanya adalah arsip, bukan chat — bila chat dan log berbeda, log yang
  menang setelah diverifikasi ke sumbernya.

## 9. Yang tidak boleh diulang

- Tayang tanpa CTA terpasang (Ep49: rekor views, komentar kosong).
- Judul tenang/faktual tanpa klaim ekstrem untuk segmen yang butuh hook
  (Ep43: 32,6%).
- "#shorts" di judul video panjang (Baikal).
- Menilai video dari jam pertama (tunggu 24 jam).
- Mengklaim komentar penonton sebelum isinya terverifikasi (Ep49: 1 komentar
  yang isinya belum jelas — jangan diklaim).
- Caption Facebook memakai judul YouTube FULL CAPS (peringatan 3 Nov).
- Mengulang upload tanpa cek duplikat (TikTok clone).
- Memakai judul tampil Studio video lama untuk analisis hook.
