// Informational text overlays (v2, 2026-11-23): key facts rendered as clean HTML graphics on top of the
// 3D scene — NOT part of the 3D world, NOT the karaoke subtitles (those are added later in assembly, bottom
// zone). Sans-serif bold (system-ui, no external fonts), big figure in yellow, sub-line in white, dark
// semi-transparent backing so it reads on any shot. Position: upper-middle of the frame — never the bottom.
// Animation per overlay: pop-in (scale 0.8 -> 1 + fade, 8 f), hold ~2 s (60 f), fade-out (8 f). Fully
// deterministic: frame-based only (useCurrentFrame + interpolate), no random/clock. Each overlay appears once,
// at its beat; ranges never overlap. Frame ranges are on the 2871-frame (95.7 s) timeline.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

type Overlay = {
  a: number; // first frame
  b: number; // last frame (exclusive)
  big: string; // main figure / quote line 1
  sub?: string; // supporting line
  quote?: boolean; // quote styling (white text, two lines, no yellow figure)
};

const OVERLAYS: Overlay[] = [
  { a: 165, b: 241, big: "1896", sub: "Hanya 2 orang selamat" }, // shot 2 — "Tahun 1896..."
  { a: 300, b: 376, big: "1933", sub: "Hanya 4 orang selamat" }, // shot 3 — "Tahun 1933..."
  { a: 650, b: 726, big: "Jangan membangun rumah", sub: "di bawah titik ini", quote: true }, // shot 4 — the carving
  { a: 1045, b: 1121, big: "11 Maret 2011", sub: "Gempa 9,0" }, // shot 6 — the quake
  { a: 1320, b: 1396, big: "39 METER" }, // shot 7 — the wave height
  { a: 1505, b: 1581, big: "90 METER", sub: "SEBELUM BATU" }, // shot 8 — the water stops
  { a: 1690, b: 1766, big: "78 TAHUN" }, // shot 9 — "batu itu diukir 78 tahun..."
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
