import * as React from 'react';

export const SvgDefs: React.FC<{}> = () => (
  <defs>
    <filter id="drop-shadow">
      <feTurbulence
        type="turbulence"
        baseFrequency="0.995"
        numOctaves="1"
        stitchTiles="noStitch"
        result="glitch-texture"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="glitch-texture"
        xChannelSelector="R"
        yChannelSelector="G"
        scale="2"
        result="glitch"
      />
      <feComposite operator="out" in2="SourceGraphic" in="glitch" result="outline" />

      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" stitchTiles="noStitch" result="noise" />
      <feColorMatrix
        in="noise"
        type="matrix"
        values="0.2126 0.7152 0.0722 0 0
                0.2126 0.7152 0.0722 0 0
                0.2126 0.7152 0.0722 0 0
                0      0      0      1 0"
        result="grayscale-noise"
      />

      <feFlood floodColor="#000" floodOpacity="0.7" result="gray-film" />
      <feBlend in="gray-film" in2="grayscale-noise" mode="multiply" result="blend-noise" />
      <feColorMatrix
        in="blend-noise"
        type="matrix"
        values=".1   0   0   0   0
                 0  .1   0   0   0
                 0   0  .1   0   0
                 0   0   0   1   0 "
        result="darken-noise"
      />

      <feComposite operator="in" in="darken-noise" in2="glitch" result="text" />

      <feMerge>
        <feMergeNode in="text" />
      </feMerge>
    </filter>
  </defs>
);
