import * as React from 'react';

export interface Props {
  svgRef: React.RefObject<SVGSVGElement>;
}

export const Svg: React.FC<Props> = ({ svgRef }) => {
  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <defs>
        <filter id="blurlayer" width="110%" height="100%">
          <feImage id="feimage" xlinkHref="/grunge.jpg" x="0" y="0" height="300px" result="mask" />
          <feBlend in="SourceGraphic" in2="mask" mode="multiply" />
        </filter>
      </defs>
      <g filter="url(#blurlayer)" fill="transparent">
        <rect x="0" y="0" width="100%" height="100%" fill="#000" />
        <text x="30%" y="100" fontFamily="Roboto Condensed" letterSpacing="-1" fontSize="80" fill="#fff">
          MKMKK
        </text>
      </g>
    </svg>
  );
};
