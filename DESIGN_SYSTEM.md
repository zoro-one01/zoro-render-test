# Imagine V1 — Design System (Fase 2)

Sistem visual untuk semua episode Imagine: palet, tipografi, gerakan, dan komposisi
yang sama di setiap video — diekstrak dari kode yang sudah terbukti jalan
(`remotion-aneyoshi/`, template Remotion `LangkaShort`), bukan dari selera default.

> **Status:** Fase 2 selesai 24 Nov 2026. Dokumen ini adalah `DESIGN.md`-nya
> Imagine: arah visual yang dipakai antislop sebagai filter.
> Semua nilai di §2 diekstrak dari kode nyata (bukan dikarang). Nilai yang belum
> diputuskan ditandai **TBD** — jangan diisi dengan tebakan (R-38).

## 1. Gerakan visual: "Diorama Nyata"

Dunia Imagine dibangun seperti diorama museum: miniatur yang dibuat dengan teliti,
diterangi seperti panggung teater, difoto dari sudut yang sudah dipilih — bukan
dunia yang pura-pura nyata. Tanahnya granit yang diukir, fasadnya shoji dan kumiko,
rumputnya hijau yang sudah dijinakkan. Setiap frame harus bisa berdiri sendiri
sebagai poster: satu titik fokus, satu cahaya yang punya arah, satu warna yang
berteriak sementara yang lain berbisik.

Ruangnya berlapis, bukan datar. Kabut memisahkan latar dari subjek, depth-of-field
memisahkan wajah dari dunia di belakangnya, dan kamera bergerak pelan seperti
seseorang yang berjalan masuk ke dalam diorama — lalu menyentak tepat di momen
yang penting. Tidak ada gerakan yang hanya mengisi waktu; setiap dorongan kamera
dan setiap kemunculan teks menjawab satu ketukan cerita.

Warnanya datang dari bumi dan langit yang sudah dikenal: coklat kayu, granit,
krem kertas, biru horizon, hijau yang tidak norak. Satu warna kuning — kuning
angka, kuning kata yang sedang diucapkan — dipakai hemat, hanya di momen yang
paling penting, supaya saat ia muncul mata langsung tahu ke mana harus melihat.
Palet yang sama boleh berjalan sepanjang video; yang berganti adalah konten,
gerakan, dan aksennya, bukan latarnya.

Teks di sini bukan keterangan — ia adalah grafis. Angka besar kuning di tengah
atas frame, kutipan putih di atas latar gelap, kata karaoke yang menyala kuning
saat diucapkan. Hurufnya padat, ringkas, dan tidak pernah menjelaskan apa yang
sudah terlihat di gambar. Dan di balik semua itu ada satu aturan yang tidak
ditawar: ceritanya nyata. Angka-angkanya benar, sumbernya ada, dan bila sebuah
klaim tidak bisa dibuktikan, ia tidak masuk ke frame.

Hasil akhirnya harus terasa seperti dikerjakan berjam-jam oleh seseorang yang
sangat ahli — bukan seperti template yang diisi. Bila logo dan nama diganti,
video ini tetap harus terasa seperti Imagine.

## 2. Token (diekstrak dari kode nyata)

Setiap token punya alasan satu baris (R-31). Bila alasannya tidak bisa ditulis,
tokennya tidak valid.

### 2a. Warna

Palet aktif dibatasi 2–3 warna inti + 1 aksen (R-29). Inti: tinta/navy + bumi +
krem. Aksen: kuning brand.

| Token | Nilai | Peran | Alasan (R-31) |
|---|---|---|---|
| `ink` | `#080C12` | Latar backing overlay, teks gelap | Terbaca di atas shot apa pun |
| `navy` | `#141235` | Keluarga latar gelap (adegan malam) | Latar dalam untuk segmen gelap |
| `navy-2` | `#23205A` | Varian navy | Kedalaman tanpa ganti palet |
| `navy-3` | `#34307A` | Varian navy terang | Hierarki di dalam gelap |
| `outline` | `#17132E` | Garis tepi grafis | Bukan hitam murni — lebih hangat |
| `brand` | `#FFD23F` | **Aksen tunggal:** angka besar, kata karaoke terucap | Satu aksen di momen kunci saja |
| `brand-2` | `#F2A516` | Bayangan/naungan aksen | Kedalaman aksen tanpa warna baru |
| `cream` | `#F7F2E8` | Kertas / adegan terang | Lawan tenang dari navy |
| `cream-2` | `#FBF8F1` | Kertas lebih terang | Variasi adegan terang |
| `earth` | `#4A3426` | Kayu, granit, tanah | Warna dunia desa |
| `earth-2` | `#3A2A1A` | Tanah gelap / rambut | Bayangan dunia |
| `earth-3` | `#5A3B2A` | Kayu menengah | Variasi material |
| `gold` | `#E8C45A` | Emas hangat | Aksen hangat, bukan aksen utama |
| `gold-2` | `#D1AA5C` | Emas redup | Variasi emas |
| `skin` | `#FFE2C2` / `#F5C9A0` / `#ECD0B6` / `#C99067` | Kulit karakter (4 varian) | Variasi warga tanpa warna baru |
| `coat-muted` | `#4A5A6E` / `#6E4A42` / `#5A6A45` / `#8A5F45` / `#44555E` / `#5A5468` | Mantel warga (v2) | v2: palet lama terlalu jenuh (biru terang, merah, ungu) |
| `sky-day` | `#3E7FD2` | Langit atas (siang) | Langit siang dari preset `day` |
| `horizon` | `#B8D0EC` | Horizon / kabut (siang) | Transisi langit ke bumi |
| `sea` | `#3F6FB5` | Laut / air | Biru air yang tenang |
| `teal` | `#2F5F6A` | Air dalam / bayangan air | Kedalaman air |
| `golden-sun` | `#FFAB5E` | Matahari golden hour | Cahaya hangat sore |
| `golden-hor` | `#FFD08A` | Horizon golden | Langit sore |
| `golden-disc` | `#FFCF9E` | Piringan matahari | Sumber cahaya terlihat |
| `golden-fog` | `#EFB489` | Kabut golden | Kedalaman sore |
| `grass` | `#5D8A42` | Rumput (didesaturasi) | Hijau yang tidak norak |
| `leaf` | `#2B7A4B` | Daun / vegetasi | Hijau dalam |
| `red` | `#FF3B30` | Dampak / peringatan saja | Hanya untuk momen benturan — dose cap |
| `red-2` | `#B81F2A` | Ekstrusi / bayangan merah | Kedalaman momen benturan |
| `segment-misteri` | `#7C3AED` | Pil segmen Misteri | Satu-satunya aksen segmen yang dikunci |
| `segment-lain` | TBD | Pil segmen lainnya | **Belum diputuskan — jangan dikarang** |

Catatan palet:

- Kuning overlay `#FFD23F` adalah nilai di kode (`Overlays.tsx`, karaoke ASS).
  Skill pop-cinematic memakai `#FFD21F` sebagai saudara dekatnya — kanonik
  Imagine adalah `#FFD23F` karena sudah ada di kode.
- Satu palet dasar boleh dipakai sepanjang video; ganti palet hanya saat segmen
  atau suasana berubah total (§4, terverifikasi 24 Nov dari 3 reel).
- Gradien biru-ungu sebagai default **dilarang** (R-01). Gradien hanya bila
  melayani hierarki, dengan alasan tertulis.
- Glow hanya untuk 1–2 elemen fokus (R-13). Glassmorphism hanya aksen 1–2
  elemen (R-10). Bayangan hanya sebagai penanda elevasi (R-12).

### 2b. Tipografi

| Token | Nilai | Peran | Alasan (R-31) |
|---|---|---|---|
| `display` | Anton, uppercase, line-height 0.9 | Judul, cover, angka besar | Suara poster yang padat |
| `ui` | system-ui / Inter 800–900 | Overlay, label, UI | Terbaca, tanpa font eksternal |
| `karaoke` | DejaVu Sans Bold 64px | Subtitle karaoke | Terbukti terbaca di 1080×1920 |
| `karaoke-word` | `#FFD23F` (kata terucap) | Kata yang sedang diucapkan | Mata mengikuti suara |
| `karaoke-outline` | hitam, 4px | Outline karaoke | Terbaca di atas shot apa pun |

Aturan font (kontrak render — tanpa jaringan saat render):

- Font bernama butuh `@font-face` lokal (vendored). `system-ui` aman tanpa font.
- Overlay memakai `system-ui` (tanpa font eksternal) — sengaja, supaya render
  tidak bergantung unduhan.
- Jangan pakai monospace besar sebagai estetika "terminal" tanpa alasan (R-06).
- Jangan pakai uppercase dengan tracking ekstrem sebagai label default (R-06).

### 2c. Radius, jarak aman, kontras

| Token | Nilai | Peran |
|---|---|---|
| `radius-overlay` | 20px | Backing overlay |
| `safe-content` | ≥8% dari tepi | Semua teks konten (§1) |
| `safe-micro` | 4–5% dari tepi | Label mikro dekoratif ≤~20px (§1) |
| `band-text` | y 150–1500 (9:16) | Zona teks kunci (UI reel menutupi bawah) |
| `display-width` | 57–67% lebar canvas | Lebar teks display (terverifikasi) |
| `contrast-normal` | ≥4,5:1 | Teks normal (R-25, WCAG AA) |
| `contrast-large` | ≥3:1 | Teks besar bold (R-25, WCAG AA large) |

Catatan kontras: observasi 24 Nov — teks display besar 3,85:1 (oranye di krem)
di bawah 4,5:1 tapi di atas ambang large text 3:1 dan tetap terbaca. **Belum**
jadi aturan baru — verifikasi di video lain dulu sebelum mengubah angka.

### 2d. Token gerak

| Token | Nilai | Peran |
|---|---|---|
| `overlay-pop` | 8 frame: scale 0.8→1 + fade | Kemunculan overlay |
| `overlay-hold` | ~60 frame (~2 dtk) | Tahan overlay |
| `overlay-fade` | 8 frame: fade-out | Hilangnya overlay |
| `beat` | ~2 dtk | Panjang satu beat (terverifikasi) |
| `camera-push` | pelan + snap zoom di ketukan | Kamera per shot |
| `spring-text` | k170, d26–28, tanpa overshoot | Teks masuk |
| `spring-ui` | k300–500, d20–24 | Elemen UI muncul |
| `spring-heavy` | k90, d14–16 | Logo / elemen berat |

## 3. Aturan dunia 3D (prosedural)

Diekstrak dari `remotion-aneyoshi/src/videos/aneyoshi/` (v2, 23 Nov):

- **Material:** MeshLambertMaterial. Bayangan dua-nada (shade.ts) — bukan PBR
  penuh. InkPass default OFF.
- **Palet dunia dimutekan.** Pelajaran v2: palet lama terlalu jenuh (biru terang,
  merah, ungu) sehingga dunia terasa kartun — mantel warga diganti ke
  `coat-muted`.
- **Proporsi karakter ~4,7 kepala** (`toon.ts`). Kepala besar + kaki lidi adalah
  kelemahan yang diketahui — perbaikan penuh butuh gambar ulang `toon.ts`.
- **Directing karakter:** hindari close-up wajah diam (wajah datar). Pakai medium
  shot, siluet, atau gerakan tubuh. Satu karakter = satu suara VO, tidak dipakai
  ulang.
- **Cahaya (preset `lights.ts`):**
  | Preset | Matahari (az/el) | Sun | Sky | Ground | Hemi |
  |---|---|---|---|---|---|
  | `day` | 75° / 48° | `#fff3e0`, 2.4 | `#dcecff` | `#b49a78` | 0.85 |
  | `golden` | 6° / 7° | `#ffab5e`, 3.2 | `#d8b0b8` | `#8a6a60` | 0.8 |
  Matahari itu camera-relative dan beku per shot. Kabut: siang `#b8d0ec`
  (25–300), golden `#efb489` (50–380).
- **Target (belum diterapkan, dari riset 23 Nov):** elevasi matahari golden
  7° → ~10–12°; ACESFilmicToneMapping exposure ~1,0–1,2. Jangan klaim sudah
  diterapkan sebelum render membuktikannya.
- **Air & langit (v3 opsi A, menunggu keputusan):** three.js `Water.js` +
  `Sky.js` + HDRI Poly Haven (CC0) — file HDRI di-commit lokal, **jangan**
  preset drei (mengunduh dari CDN saat runtime). Air sekarang: plane + marks
  putih seperti coretan di beberapa shot (kelemahan diketahui).
- **Determinisme (kontrak render):** semua random seeded; tidak ada
  `Math.random` / `Date.now` / network saat render. Satu `gsap.timeline`
  yang di-pause di `window.__timelines`. Jangan tween `.clip` dengan
  visibility/autoAlpha. Jangan gabung transform CSS awal + tween GSAP pada
  properti yang sama (pakai fromTo). Koordinat layout dihitung sekali di setup,
  bukan diukur saat tween (`getBoundingClientRect` saat tween = desync).
- **Pelajaran bug yang tidak boleh terulang:** flip winding semua quad tanah
  (normal menghadap ke bawah = tanah pucat karena langit tembus); cleanup
  `fx.ink.dispose?.()`; `--timeout 180000` untuk still lokal.

## 4. Aturan lapisan grafis 2D (overlay + karaoke + cover)

- **Overlay informatif** (`Overlays.tsx`): posisi atas-tengah (`paddingTop: 26%`),
  **tidak pernah** di bawah. Angka besar kuning 132px + sub putih 46px; kutipan
  putih 58px dua baris. Backing `rgba(8, 12, 18, 0.62)`, radius 20.
  Muncul sekali per beat, rentang tidak tumpang tindih. Animasi: pop-in 8f,
  tahan ~60f, fade-out 8f. Deterministik (frame-based).
- **Subtitle karaoke** (assembly): kata naskah, timing dari timestamp kata
  transkripsi. DejaVu Sans Bold 64px, kata terucap kuning `#FFD23F`, outline
  hitam 4, MarginV 110, PlayRes 1080×1920. Zona bawah.
- **Cover:** dari frame terbaik (bukan asal crop). Anton, angka/klaim besar.
  Cover kustom terbatas jatah hariannya (channel belum verifikasi telepon) —
  jangan boros.
- **Label mikro dekoratif** (≤~20px) boleh di 4–5% tepi; batas 8% tetap untuk
  teks konten (§1).
- **Dekorasi full-opacity boleh menyentuh tepi** selama tidak menabrak teks.

## 5. Kosakata gerak (HyperFrames)

Dari `hyperframes-animation` — pilih 2–4 aturan per adegan, bukan semuanya:

| Aturan | Pakai untuk |
|---|---|
| `spring-pop-entrance` | Overlay / elemen masuk |
| `kinetic-beat-slam` | Momen benturan (angka, fakta, Snap) |
| `decode` | Judul 1–2 kata gaya tech: scramble→resolve per huruf, ~2 dtk |
| `depth-of-field-blur` | Rack focus (fokus pindah subjek ↔ latar) |
| `multi-phase-camera` | Shot a/b/c di dalam satu shot (26 setup di Aneyoshi) |
| `3d-camera-flight` | Perjalanan kamera antar lokasi |
| `gradient-text-sweep` | Sapuan warna pada teks display (hemat — satu aksen) |

**Transisi:** potong keras adalah default (§6, terverifikasi). Transisi grafis
(diagonal slash, shutter bars, iris) hanya bila melayani momen — tulis
alasannya. Jangan pakai transisi yang sama untuk semua potongan.
**Yang dilarang:** semua elemen Fade Up + Floating + Scale + Bounce sekaligus
(R-19); loop tanpa henti tanpa pemicu (R-19); gerakan tanpa tujuan tertulis.

## 6. Aturan komposisi (terverifikasi 24 Nov)

Dari analisa animasi harian + `skills/hyperframes-composition-rules/SKILL.md`
(lokal — update 24 Nov ada di staging, belum di-push ke GitHub):

- **§1 — Zona aman:** teks konten ≥8% dari tepi; label mikro ≤~20px boleh
  di 4–5% tepi. Display 57–67% lebar canvas.
- **§3 — Katalog gerakan masuk:** termasuk `decode` (baru, 24 Nov).
- **§4 — Palet:** satu palet dasar boleh sepanjang video bila tiap beat ganti
  konten/gerakan/aksen; ganti palet wajib saat segmen/suasana berubah total.
- **§6 — Transisi & pacing:** potong keras default; ~2 dtk/beat.
- **Framing penutup (temuan s13c):** crane penutup dinaikkan/dijauhkan sampai
  atap tidak mendominasi frame (temuan: atap gelap memenuhi ~60% frame shot
  penutup). Subjek penutup harus terlihat utuh.
- **Satu titik fokus per shot** (antislop Part 3): tepat satu elemen yang paling
  penting; sisanya mengalah.

## 7. Arah visual per segmen

Mood + cahaya per segmen (dikunci 18 Nov; backsound per segmen ada di
`CATALOG.md` — jangan diduplikasi di sini):

| Segmen | Mood visual | Cahaya | Catatan |
|---|---|---|---|
| Senin — Dunia Terkini | Jelas, tegas | `day` | Fakta di depan, tanpa kabut suasana |
| Selasa — Penemuan | Takjub, terang | `day` | Cahaya penuh, warna hidup tapi tetap muted |
| Rabu — Misteri | Penasaran, suspense | `day` → bayangan panjang | Ungu aksen `#7C3AED` |
| Kamis — Tempat Tersembunyi | Kagum, luas | `day` / `golden` | Kamera jauh, subjek kecil di dunia besar |
| Jumat — Horor | Gelap, tegang | `golden` rendah / navy | Navy `#141235` dominan, merah hanya benturan |
| Sabtu — Fakta Dunia | Punchy, mengejutkan | `day` | Angka besar, potong cepat |
| Minggu — Teori | Spekulatif, samar | `golden` | Kabut lebih tebal, cahaya tidak pasti |

## 8. Penerapan antislop (mode: during)

Filter ini aktif selama pengerjaan (bukan audit sesudahnya). Yang dijaga:

- **Purpose test (R-31):** setiap teknik di dokumen ini punya alasan satu baris
  di tabelnya. Teknik tanpa alasan = tidak dipakai.
- **Identitas (C-1, R-20):** bila logo dan nama diganti, video tetap terasa
  seperti Imagine — karena palet bumi + kuning angka + diorama + karaoke.
- **Angka nyata (R-17, R-36):** tidak ada statistik/angka tanpa sumber. Angka
  di overlay adalah fakta terverifikasi dari naskah.
- **Tidak ada yang dikloning (R-30):** bukan tampilan Linear/Vercel/Stripe —
  ini diorama prosedural + pop-cinematic, bukan landing page.
- **Delivery Gate (adaptasi untuk video):** sebelum render penuh — contact sheet
  dulu (satu frame per beat), LIHAT, perbaiki 3 masalah terburuk, ulangi.
  Render yang belum pernah dilihat still-nya = belum selesai.

## 9. Yang dicantumkan v3 (menunggu keputusan)

Sistem ini ditulis supaya v3 menancap tanpa mengubah token:

- **Opsi A — air + langit:** `Water.js` + `Sky.js` + HDRI Poly Haven (CC0),
  elevasi golden 7° → ~10–12°, ACES exposure ~1,0–1,2. Perbaiki shot golden
  yang gelap/moody + marks putih di laut.
- **Opsi B — karakter:** KayKit Adventurers (CC0) — rig `Rig_Medium`, ~75 klip
  animasi + paket 161 klip. Tema fantasi → recolor, pilih yang netral.
  Quaternius lebih sipil tapi lisensi QAL melarang commit GLB — unduh saat build.
- **Framing s13c:** crane penutup dinaikkan/dijauhkan (aturan §6 di atas).
- **Aksen segmen:** 6 aksen segmen lain masih TBD — diputuskan saat episode
  segmen itu diproduksi, bukan dikarang sekarang.

## 10. File token (mesin)

`design-system/tokens.json` di root repo — versi mesin dari §2, untuk diimpor
kode bila diperlukan. Dokumen ini (.md) adalah sumber kebenarannya; bila
keduanya bertentangan, .md yang menang.
