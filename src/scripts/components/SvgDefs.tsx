import * as React from 'react';

export const SvgDefs: React.FC<{}> = () => (
  <defs>
    {/* <filter id="drop-shadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0.15"></feGaussianBlur>
    </filter> */}
    <linearGradient id="text-color">
      <stop offset="0.2" stopColor="#f0f">
        <animate attributeName="stop-color" values="#f0f; #fff; #0ff; #000" dur="4s" repeatCount="indefinite" />
      </stop>
      <stop offset="0.8" stopColor="#ff0">
        <animate attributeName="stop-color" values="#fff; #0ff; #f00; #ff0" dur="4s" repeatCount="indefinite" />
      </stop>
    </linearGradient>
    <clipPath id="text-helmet">
      <rect x="0" y="3%" width="100%" height="42%" />
      <rect x="0" y="49%" width="100%" height="42%" />
    </clipPath>
    <filter id="s42" x="0" y="0" width="100%" height="100%">
      <feImage id="grunge" xlinkHref="/grunge.jpg" x="0" y="0" width="397" height="87" result="mask" />
      <feBlend mode="multiply" in="SourceGraphic" in2="mask" result="blend" />
      <feComposite operator="in" in="brend" in2="SourceGraphic" />
    </filter>
  </defs>
);
