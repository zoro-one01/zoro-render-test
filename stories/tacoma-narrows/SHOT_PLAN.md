# Tacoma Narrows — Shot Plan (calon episode kedua Imagine)

Status: **DRAF — Gate 1 BELUM lewat.** Naskah di `SCRIPT.md` belum disetujui
user secara eksplisit. Dokumen ini hanya pemetaan beat → shot supaya episode
ini bisa langsung masuk template saat disetujui. Jangan bangun sebelum Gate 1.

## Koreksi durasi (penting)

Naskah menulis "~66 detik pada 3,7 kata/detik" — itu laju bahasa Inggris.
VO Indonesia (Sadaltager ~2,4 kata/dtk, terukur di Aneyoshi) membuat naskah
ini jauh lebih panjang:

- Hitung kata per beat dari teks naskah: **±226 kata** (naskah menulis ~245).
- Estimasi durasi: 226 / 2,4 ≈ **94 detik ≈ 2.828 frame @ 30fps**.
- Artinya episode ini sekelas Aneyoshi (95,7 dtk / 2.871 frame), bukan 66 dtk.
- Pilihan di Gate 1: terima ~95 dtk, atau potong beat (naskah sendiri
  menyarankan potong beat 4 atau 11).

Semua rentang frame di bawah adalah **ESTIMASI dari hitung kata** — re-time
dari VO asli via faster-whisper setelah VO jadi (seperti retiming Aneyoshi
×1,519).

## Beat → shot (12 shot)

| Shot | Beat | Kata | Estimasi | Rentang frame | Cahaya | Catatan kamera/dunia |
|---|---|---|---|---|---|---|
| S1 | HOOK — jembatan runtuh karena angin | 16 | 6,7 dtk | 0–200 | day | Wide jembatan utuh hari cerah, slow push-in. Momen ekstrem di 3 detik pertama: lantai robek (flash ke S7). |
| S2 | SETTING — 1940, bentang 853 m | 19 | 7,9 dtk | 200–438 | day | Wide + overlay "1940" dan "853 METER". Jembatan kebanggaan kota. |
| S3 | ACTION 1 — Galloping Gertie | 20 | 8,3 dtk | 438–688 | day | **Close-up lantai bergelombang** naik-turun. Gerakan gelombang = animasi deck (baru). |
| S4 | ACTION 2 — insinyur gagal | 10 | 4,2 dtk | 688–813 | day | Kabel penahan + pemberat, close-up. Beat pendek — potong bila perlu (saran naskah). |
| S5 | ACTION 3 — angin 68 km/jam, memuntir | 29 | 12,1 dtk | 813–1176 | day | **Twist memuntir: satu sisi naik, sisi lain turun.** Shot terberat (deck twist + angin). Overlay "68 KM/JAM". |
| S6 | ACTION 4 — mobil ditinggalkan, profesor + anjing | 21 | 8,8 dtk | 1176–1439 | day | Mobil era 1940 ditinggalkan; profesor berlari ke mobil Tubby. Tokoh: Farquharson + Tubby (desain hewan baru). |
| S7 | SNAP — lantai 180 m robek jatuh | 12 | 5,0 dtk | 1439–1589 | day | **Snap: lantai robek dan jatuh ke laut.** Impact kick + flash. Overlay "180 METER". |
| S8 | DEADPAN — 0 manusia tewas, 1 anjing | 15 | 6,3 dtk | 1589–1777 | day | Laut tenang setelah runtuh; overlay "TUBBY". Nada deadpan, kamera diam. |
| S9 | EXPLANATION a — ayunan | 23 | 9,6 dtk | 1777–2065 | day | Analogi ayunan: dorongan kecil tepat waktu. Visual: ayunan / grafik dorongan (overlay grafis). |
| S10 | EXPLANATION b — flutter | 17 | 7,1 dtk | 2065–2278 | day | Angin mendorong berulang sampai tak terkendali. Overlay "FLUTTER". |
| S11 | CONSEQUENCE — terowongan angin | 22 | 9,2 dtk | 2278–2553 | day | Lantai berlubang, angin lewat. Beat pendek — potong bila perlu (saran naskah). |
| S12 | CALLBACK — jembatan 1950 + terumbu karang | 22 | 9,2 dtk | 2553–2828 | golden | **Laut tenang + terumbu karang** di dasar laut. Crane out golden hour. Overlay "1950". |

**TOTAL estimasi: ±2.828 frame (94,3 dtk).**

## Overlay yang diusulkan (maks. 1 per beat)

1940 (S2) · 853 METER (S2) · 68 KM/JAM (S5) · 180 METER (S7) · TUBBY (S8) ·
FLUTTER (S10) · 1950 (S12). Semua mengikuti `DESIGN_SYSTEM.md` §4
(atas-tengah, angka kuning #FFD23F). Bukan keputusan final — dikunci saat
storyboard.

## Cakupan dunia (baru)

- **Baru:** jembatan gantung 1940 (dua menara + kabel utama + lantai pelat),
  Selat Puget, mobil era 1940, gerakan angin + gelombang deck + twist.
- **Dipakai ulang dari engine:** pipeline Remotion + three.js, post chain
  (ink → lens blur → bloom → grade), gaya karakter.
- **Karakter baru:** Profesor Farquharson, pengemudi, Tubby (anjing —
  butuh desain karakter hewan baru di `toon.ts`).
- **Judul draf (gaya Mangzoro):** "JEMBATAN RAKSASA INI RUNTUH HANYA KARENA ANGIN!"
- **Segmen (belum diputuskan):** Fakta Dunia, Sabtu — atau hanya test skill.

## Yang belum diputuskan

- Episode ini untuk test skill saja, atau langsung jadi episode Mangzoro?
- Terima ~95 dtk, atau potong beat 4 / 11?
- Segmen + slot tayang (bila jadi episode Mangzoro).
