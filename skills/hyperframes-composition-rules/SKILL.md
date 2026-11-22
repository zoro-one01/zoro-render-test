---
name: hyperframes-composition-rules
description: Aturan komposisi HyperFrames agar hasil render tidak kepotong, layout pas, animasi/warna/teks beragam dan sesuai komposisi, mengikuti storyboard dan frame. Dibaca sebelum menulis atau mereview komposisi apa pun, dan dipakai sebagai checklist sebelum render.
---

# Aturan Komposisi HyperFrames

Tujuan file ini: setiap render lolos tanpa teks atau gambar terpotong, layout rapi, dan tiap scene terasa beda tapi tetap satu gaya. Aturan di sini lahir dari kegagalan nyata (judul "HYPERFRAMES" 148px terpotong kiri-kanan di render pertama, 23 Nov 2026) — jadi angkanya sudah diuji, bukan teori.

## 0. Cara pakai

- Baca file ini SEBELUM menulis `index.html` baru atau mengubah scene.
- Ikuti checklist §7 sebelum render. Render hanya jalan bila `hyperframes check` bersih dari error.
- Kalau ada aturan yang bertabrakan dengan permintaan eksplisit user, permintaan user menang — tapi catat penyimpangannya di laporan.

## 1. Anti-kepotong (aturan paling penting)

- **Zona aman:** semua teks dan elemen penting minimal 8% dari tepi canvas. Vertikal 1080x1920 → 86px dari tiap tepi. Horizontal 1920x1080 → 86px atas-bawah, 154px kiri-kanan.
- **Hitung lebar judul SEBELUM render.** Rumus huruf kapital tebal (system-ui bold):
  `lebar_teks ≈ jumlah_karakter × font_px × 0,75 + (jumlah_karakter − 1) × letter_spacing`
  Syarat lolos: `lebar_teks ≤ lebar_canvas × 0,92`.
  Contoh nyata: "HYPERFRAMES" (11 karakter) di 148px + spacing 6px → 11×148×0,75 + 10×6 = 1.281px > 993px → GAGAL, terbukti terpotong di render. Di 112px + spacing 4px → 11×112×0,75 + 10×4 = 964px ≤ 993px → LOLOS.
- **Tabel ukuran aman** (huruf kapital tebal, letter-spacing ≤ 4px):
  - Canvas lebar 1080: ≤ 6 karakter → 160px; 7–9 → 140px; 10–12 → 110px; 13–16 → 88px; > 16 → 64px atau pecah 2 baris.
  - Canvas lebar 1920: ≤ 10 karakter → 170px; 11–14 → 140px; 15–20 → 110px; > 20 → 88px atau 2 baris.
- Judul lebih dari 16 karakter (vertikal) wajib 2 baris — jangan diperkecil sampai tak terbaca.
- **Cek visual:** `hyperframes snapshot --at <detik tengah beat>` lalu buka PNG-nya. Tidak ada teks yang menyentuh tepi, tidak ada elemen yang setengah keluar frame.
- Jangan pakai `white-space: nowrap` pada teks panjang; izinkan wrap dengan `max-width` + `text-align: center`.
- Elemen absolut harus punya posisi yang jelas (`inset` / `left` / `right`); jangan mengandalkan posisi default.

## 2. Layout / komposisi

- **Satu titik fokus per frame:** judul ATAU gambar ATAU angka — bukan ketiganya berebut perhatian.
- **Ritme vertikal:** jarak antar blok 32–48px (canvas vertikal). Grup yang terkait lebih rapat (16–24px), antar grup lebih longgar.
- **Grid:** konten dalam kolom tengah 84% lebar canvas. Jangan tempel elemen ke tepi kecuali background atau dekorasi.
- **Latar:** gradient atau warna solid. Dekorasi (lingkaran, garis) opacity ≤ 0,15 dan tidak boleh menabrak teks.
- **Hierarki ukuran** display : sub : body : caption ≈ 3 : 1,6 : 1,1 : 0,8. Contoh vertikal: 110 : 54 : 40 : 28.
- **Konsistensi antar scene:** kotak aman dan posisi titik fokus sama di semua scene, supaya mata penonton tidak loncat-loncat.

## 3. Animasi beragam

- **Katalog gerakan masuk** (pilih SATU per elemen, jangan digabung semua): rise (naik + fade), fade, pop (`back.out`), slide-x, stagger, wipe (`scaleX`), Ken Burns (scale 1.0 → 1.08 selama 6–10 dtk).
- **Aturan variasi:** dua scene berurutan WAJIB beda gerakan utama. Satu gerakan tidak boleh dipakai di lebih dari 2 scene berurutan dalam satu video.
- **Durasi:** gerakan masuk 0,4–0,7 dtk; jeda stagger antar item 0,25–0,4 dtk; tahan (hold) minimal 0,5 dtk sebelum beat berikutnya.
- **Easing:** masuk pakai `power3.out`; pop pakai `back.out(1.7)`; gerakan latar (Ken Burns, bar progres) pakai `none`/linear.
- **Satu scene = satu gerakan dominan + maksimal satu gerakan sekunder** (mis. bar progres). Jangan animasikan semua elemen sekaligus.
- **Larangan:** jangan tween `display` / `visibility` / `autoAlpha` pada `.clip`; jangan gabung CSS `transform` awal + tween GSAP pada properti yang sama (pakai `fromTo`); tidak ada `Math.random`, jam, atau network saat render.

## 4. Warna beragam dan sesuai komposisi

- **Sistem:** tiap scene = 1 warna latar + 1 warna aksen utama + 1 warna teks + (opsional) 1 aksen kedua. Maksimal 3 hue per scene.
- **Kontras:** teks di atas latar minimal 4.5:1. Kuning #FFD60A di navy #0B1026 lolos; putih di teal gelap lolos; kuning di putih TIDAK lolos.
- **Palet siap pakai (putar per scene):**
  1. Navy Malam: bg `#0B1026` → `#0E3A5D`, aksen `#FFD60A`, teks `#FFFFFF`.
  2. Teal Dalam: bg `#062A2A` → `#0B6E6E`, aksen `#FFFFFF`, aksen kedua `#FFD60A`, teks `#FFFFFF`.
  3. Plum Senja: bg `#1E1033` → `#4C1D95`, aksen `#5EEAD4`, teks `#FFFFFF`.
  4. Ink Coral: bg `#111111` → `#262626`, aksen `#FF6B6B`, aksen kedua `#FFD60A`, teks `#FFFFFF`.
- **Aturan putar:** scene berurutan beda palet. Satu palet boleh dipakai 2 kali dalam satu video hanya bila dipisah minimal 1 scene lain.
- **Aksen hemat:** warna aksen hanya untuk 1–2 kata kunci per frame, bukan seluruh kalimat.
- **Mood → palet:** misteri = Navy; penemuan = Teal; horor = Ink (aksen merah); fakta = Navy/Teal; teori = Plum.

## 5. Teks beragam dan sesuai komposisi + style

- **Variasi bukan cuma ukuran.** Bedakan lewat weight (800/600/400), case (UPPER untuk display, Sentence untuk body), dan letter-spacing (display 4–12px, body 0–2px).
- **Batas baris:** display ≤ 2 baris; sub ≤ 2 baris; body ≤ 3 baris; caption 1 baris.
- **Satu frame maksimal 3 kelompok teks** (judul + sub + label). Lebih dari itu, pecah jadi 2 beat.
- **Sorot kata kunci** dengan warna aksen atau weight lebih tebal — maksimal 2 kata per frame.
- **Bahasa mengikuti segmen** (Indonesia, natural, bukan terjemahan kaku). Angka ditulis konsisten ("1.642 m", "25 JUTA TAHUN").
- **Dilarang:** `<br>` di body text; ALL CAPS untuk body panjang; font bernama tanpa `@font-face` lokal.

## 6. Storyboard → frame

- **Tiap video WAJIB punya storyboard tabel sebelum render:**

  | Beat | Waktu | Visual | Teks | Gerakan | Palet |
  | ---- | ----- | ------ | ---- | ------- | ----- |
  | 1 | 0–3 dtk | ... | ... | rise | Navy Malam |

- **Satu beat = satu ide, 2–10 detik.** Beat ganti → minimal satu dari (visual / teks / gerakan / palet) ikut ganti.
- **Frame checkpoint:** tiap beat dicek di titik tengahnya via `hyperframes snapshot --at <detik tengah beat>`. Snapshot dibuka dan dinilai: tidak kepotong, fokus jelas, kontras cukup.
- **Transisi antar beat:** potong keras (cut) sebagai default; crossfade hanya bila suasana berubah total.
- **Durasi total = jumlah durasi beat.** Root `data-duration` harus sama dengan total itu.

## 7. Checklist sebelum render

- [ ] `hyperframes check` — 0 error (warning dicatat, error wajib dibersihkan dulu).
- [ ] Semua judul display lolos rumus lebar §1 (hitung manual).
- [ ] Snapshot tiap beat dicek: tidak ada yang terpotong atau menabrak tepi.
- [ ] Scene berurutan beda gerakan utama dan beda palet.
- [ ] Kontras teks ≥ 4.5:1; maksimal 3 hue per scene.
- [ ] Satu timeline paused per komposisi, terdaftar di `window.__timelines[id]`; `data-duration` = total durasi.
- [ ] GSAP lokal (bukan CDN); tidak ada network / random / jam saat render.
- [ ] Perintah render: `hyperframes render . --workers 1 --quality draft --output <nama>.mp4` (coba draft dulu; delivery untuk final).

## 8. Kalau gagal

- Teks kepotong → kecilkan font sesuai tabel §1 atau pecah 2 baris. Jangan geser posisi untuk "mengakali".
- Lint error → baca nama error-nya (mis. `gsap_css_transform_conflict`) dan perbaiki di tempat yang ditunjuk, jangan tulis ulang file.
- Render lambat → turunkan quality ke draft, workers 1; cek durasi total dulu.
- Warna terlihat "mati" → cek kontras dan pastikan aksen hanya di kata kunci, bukan di mana-mana.
