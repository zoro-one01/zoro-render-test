import React from "react";
import { Composition } from "remotion";
import { AneyoshiShort, ANEYOSHI_FRAMES } from "./videos/aneyoshi/Aneyoshi";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AneyoshiShort"
      component={AneyoshiShort}
      durationInFrames={ANEYOSHI_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
