# Folder public sengaja kosong

`loadKit()` di `src/videos/aneyoshi/world.ts` hanya mendaftarkan nama vegetasi
Kenney (`tree_*`, `plant_*`, `hedge`) — semuanya digambar prosedural di
build.ts (`VEG`), jadi tidak ada file GLB yang dibutuhkan.

Bila nanti ada properti Kenney yang ingin dipakai (lentera, stall, gerobak),
tambahkan GLB CC0 ke `public/aneyoshi/kenney/` dan daftarkan namanya di
`KENNEY` (world.ts) — `loadKit()` sudah menangani gagal load dengan aman
(catch → `null`).
