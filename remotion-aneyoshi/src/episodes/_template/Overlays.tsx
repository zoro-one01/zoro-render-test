// Overlays.tsx — TEMPLATE episode Imagine V1 (salin bersama story.ts)
// Satu overlay per beat, maksimal. Rentang [a, b) dalam frame, tidak tumpang
// tindih, dan harus di dalam SATU shot (lihat story.ts SHOTS).
// Gaya mengikuti DESIGN_SYSTEM.md §4: posisi atas-tengah, angka besar kuning
// #FFD23F 132px, sub putih 46px, backing rgba(8,12,18,0.62), radius 20.
// Render component-nya (pop-in 8f, tahan ~60f, fade-out 8f) disalin dari
// Aneyoshi Overlays.tsx saat episode dibangun — file ini hanya datanya.
export type Overlay = {
  a: number; // first frame
  b: number; // last frame (exclusive)
  big: string;
  sub?: string;
  quote?: boolean;
};

export const OVERLAYS: Overlay[] = [
  { a: 10, b: 70, big: "CONTOH", sub: "Ganti dengan angka episode ini" },
];
