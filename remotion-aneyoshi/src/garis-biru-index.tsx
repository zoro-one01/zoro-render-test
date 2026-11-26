// Garis Biru entry point — used ONLY by the Garis Biru storyboard/full workflows.
// It imports the engine copy at ./videos/garis-biru/Aneyoshi, which the workflow
// creates at runtime (cp src/videos/aneyoshi -> src/videos/garis-biru, then
// overwrite story.ts + Overlays.tsx from src/episodes/garis-biru/).
// The repo's main entry (src/index.ts) stays Aneyoshi-only, so the Aneyoshi
// workflows never touch this episode's wiring.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { AneyoshiShort as GarisBiruShort, ANEYOSHI_FRAMES as GARIS_BIRU_FRAMES } from "./videos/garis-biru/Aneyoshi";

const GarisBiruRoot: React.FC = () => {
  return (
    <Composition
      id="GarisBiruShort"
      component={GarisBiruShort}
      durationInFrames={GARIS_BIRU_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

registerRoot(GarisBiruRoot);
