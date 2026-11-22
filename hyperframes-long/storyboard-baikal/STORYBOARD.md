# Storyboard — 5 Fakta Danau Baikal (30 detik)

Video vertikal 1080×1920, 30 fps, 5 beat × 6 detik. Fakta dari produksi video panjang Baikal (v3). Aturan yang dipakai: `skills/hyperframes-composition-rules/SKILL.md` — zona aman 8%, satu fokus per frame, gerakan dan palet beda tiap beat berurutan, kontras ≥ 4.5:1.

| Beat | Waktu | Visual | Teks | Gerakan | Palet |
| ---- | ----- | ------ | ---- | ------- | ----- |
| 1 — Hook | 0–6 dtk | Angka raksasa kuning di tengah | "1.642 M" + sub "DANAU TERDALAM DI DUNIA" + pil "DANAU BAIKAL • SIBERIA" | rise | Navy Malam |
| 2 — Panjang | 6–12 dtk | Angka putih + bar kuning | "636 KM" + sub "PANJANG DARI UJUNG KE UJUNG" + bar progres | slide-x + wipe | Teal Dalam |
| 3 — Usia | 12–18 dtk | Angka mint di tengah | "25 JUTA" + sub "TAHUN — DANAU TERTUA DI DUNIA" | pop | Plum Senja |
| 4 — Spesies | 18–24 dtk | Angka coral + 2 chip | "1.700+" + sub "SPESIES HIDUP DI SINI" + chip "ENDEMIK" "2 DARI 3" | fade + stagger | Ink Coral |
| 5 — Air tawar + CTA | 24–30 dtk | Angka kuning + pil CTA | "22%" + sub "AIR TAWAR DUNIA ADA DI SINI" + pil "TONTON VERSI PANJANGNYA" + bar | fade + rise | Navy Malam |

## Cek lebar judul (rumus §1 rules)

- "1.642 M" 7 karakter @140px → 759px ≤ 993px ✓
- "636 KM" 6 karakter @160px → 750px ✓
- "25 JUTA" 7 karakter @140px → 759px ✓
- "1.700+" 6 karakter @160px → 750px ✓
- "22%" 3 karakter @170px → 390px ✓
- Sub terpanjang 27 karakter @42px → 902px ≤ 993px ✓

## Frame checkpoint

Tiap beat dicek di detik tengahnya (3, 9, 15, 21, 27) via `hyperframes snapshot --at <detik>`: tidak kepotong, fokus jelas, kontras cukup.

## Render

Workflow: `.github/workflows/hyperframes-render-long.yml` (workflow_dispatch).
- `scenes_dir`: `hyperframes-long/storyboard-baikal/scenes`
- `output`: `storyboard-baikal-30s.mp4`
- `quality`: `draft`
- Hasil: `renders/storyboard-baikal-30s.mp4` (di-commit otomatis, unduh langsung tanpa ZIP).
