# Folder public sengaja kosong

`loadKit()` di `src/videos/bridge/world.ts` memuat 26 file Kenney GLB dari
`public/bridge/kenney/*.glb`. File GLB itu TIDAK ikut di-vendor bersama skill
(claude-animated-shorts hanya membawa source `.ts/.tsx`).

Setiap gagal load di-catch dan diganti `null`, jadi render tetap jalan:
pohon/semak/hedge/banner digambar prosedural (build.ts `VEG`), hanya
properti Kenney (lentera, stall, gerobak, kincir, kano, lily) yang absen
di test ini. Untuk render penuh, tambahkan GLB Kenney CC0 ke folder
`public/bridge/kenney/` (nama file sesuai daftar `KENNEY` di world.ts).
