import * as React from 'react';

export interface Props {
  texts: string[];
  fontSize: number;
  width: number;
  lengthAdjust: string;
  textColor: string;
}

const fontOptions: React.SVGProps<SVGTextElement> = {
  x: 0,
  y: '1em',
  // fontFamily: 'Roboto Condensed',
  // fontFamily: 'Playfair Display',
  fontFamily: 'Crimson Text, YuMincho',
  fontWeight: 700,
  width: '100%',
};
const styles: React.CSSProperties = {};

const noise = [['1,12', 1], ['0.8,8', 1], ['0.6,20', 1.5], ['1.6,52', 1.8], ['2.6,72', 1.8]];

export const SvgBody: React.FC<Props> = ({ texts, fontSize, width, lengthAdjust, textColor }) => (
  <g filter="url(#drop-shadow)">
    <rect x="0" y="0" width="2000" height="2000" fill="#fff" />
    {noise.map(([strokeDasharray, strokeWidth]) => (
      <text
        fontSize={fontSize}
        {...{ ...fontOptions, strokeDasharray, strokeWidth, styles, lengthAdjust, fill: textColor, stroke: textColor }}
        textLength={width}
      >
        {texts}
      </text>
    ))}
  </g>
);
