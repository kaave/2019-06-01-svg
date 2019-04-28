import * as React from 'react';

export type Props = {
  width: number;
  height: number;
  cut: number;
  turbulenceFrequency: number;
};

export const SvgDefs: React.FC<Props> = ({ width, height, cut, turbulenceFrequency }) => (
  <defs>
    <linearGradient id="text-color">
      <stop offset="0.2" stopColor="#f0f">
        <animate attributeName="stop-color" values="#f0f; #fff; #0ff; #e2e" dur="4s" repeatCount="indefinite" />
      </stop>
      <stop offset="0.8" stopColor="#ff0">
        <animate attributeName="stop-color" values="#fff; #0ff; #f00; #ff0" dur="4s" repeatCount="indefinite" />
      </stop>
    </linearGradient>
    <clipPath id="text-helmet">
      <rect x="0" y={`${cut}%`} width="100%" height={`${100 - cut}%`} />
    </clipPath>
    <filter id="drop-shadow">
      <feTurbulence
        type="turbulence"
        baseFrequency={turbulenceFrequency}
        numOctaves={2}
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

      {/* <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" stitchTiles="noStitch" result="noise" />
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
      /> */}

      <feComposite operator="in" in="darken-noise" in2="glitch" result="text" />

      <feImage id="grunge" xlinkHref="/grunge.jpg" x="0" y="0" width={width} height={height} result="mask" />
      <feBlend mode="multiply" in="text" in2="mask" result="blend" />
      <feComposite operator="in" in="brend" in2="glitch" result="texture-text" />

      <feMerge>
        <feMergeNode in="texture-text" />
        {/* <feMergeNode in="text" /> */}
      </feMerge>
    </filter>
  </defs>
);
