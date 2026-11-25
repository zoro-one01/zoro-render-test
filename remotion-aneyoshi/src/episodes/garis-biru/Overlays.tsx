// Overlays.tsx — Aneyoshi #2 "Garis Biru" (informational overlays, DESIGN_SYSTEM.md §4).
// Maksimal 1 per beat/shot, tiap rentang di dalam SATU shot, tidak tumpang tindih. Posisi atas-tengah (paddingTop 26%),
// angka besar kuning #FFD23F 132px, sub putih 46px, backing rgba(8,12,18,0.62), radius 20. Pop-in 8f, tahan, fade-out 8f.
// Deterministik: hanya frame (useCurrentFrame + interpolate), tanpa random/clock. Timeline 1860 frame (62 dtk).
// Shot 1, 4, 5, 6, 10, 11 sengaja tanpa overlay: hook, aksi, konsekuensi, dan callback dibiarkan visual.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export type Overlay = {
  a: number; // first frame
  b: number; // last frame (exclusive)
  big: string; // main figure / quote line 1
  sub?: string; // supporting line
  quote?: boolean; // quote styling (white text, two lines, no yellow figure)
};

export const OVERLAYS: Overlay[] = [
  { a: 150, b: 226, big: "ANEYOSHI", sub: "Iwate, Jepang" }, // shot 2 (136-394) — "Ini desa Aneyoshi, di pesisir Iwate"
  { a: 400, b: 476, big: "2011", sub: "Gempa 9,0" }, // shot 3 (394-530) — "Tanggal 11 Maret 2011, gempa 9,0"
  { a: 916, b: 992, big: "BATAS", sub: "AIR TSUNAMI 2011" }, // shot 7 (912-998) — snap: "Tepat di garis biru itu"
  { a: 1010, b: 1086, big: "11 RUMAH", sub: "Selamat utuh" }, // shot 8 (998-1195) — "Untungnya, sebelas rumah..."
  { a: 1360, b: 1436, big: "Jangan membangun rumah", sub: "di bawah titik ini", quote: true }, // shot 9 (1195-1454) — isi batu
];

const POP = 8, FADE = 8;

const OverlayView: React.FC<{ o: Overlay; f: number }> = ({ o, f }) => {
  if (f < o.a || f >= o.b) return null;
  const opacity = Math.min(
    interpolate(f, [o.a, o.a + POP], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [o.b - FADE, o.b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

  const scale = interpolate(f, [o.a, o.a + POP], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: "26%", pointerEvents: "none" }}>
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          background: "rgba(8, 12, 18, 0.62)",
          borderRadius: 20,
          padding: o.quote ? "30px 44px" : "26px 52px",
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          lineHeight: 1.08,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: o.quote ? 58 : 132, color: o.quote ? "#ffffff" : "#ffd23f", letterSpacing: o.quote ? 0 : 2 }}>
          {o.quote ? "\u201C" + o.big : o.big}
        </div>
        {o.sub && (
          <div style={{ fontWeight: 700, fontSize: o.quote ? 58 : 46, color: "#ffffff", marginTop: o.quote ? 6 : 10 }}>
            {o.quote ? o.sub + "\u201D" : o.sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const Overlays: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>

      {OVERLAYS.map((o) => (
        <OverlayView key={o.a} o={o} f={f} />
      ))}
    </>
  );
};
