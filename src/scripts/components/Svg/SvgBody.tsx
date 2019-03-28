import * as React from 'react';

export interface Props {
  texts: string[];
  fontSize: number;
  width: number;
}

const fontOptions: React.SVGProps<SVGTextElement> = {
  x: 0,
  y: '1em',
  fontFamily: 'Roboto Condensed',
  // fontFamily: 'sans-serif',
  fontWeight: 700,
  // fill: '#fff',
  fill: 'url(#text-color)',
  width: '100%',
};
const styles: React.CSSProperties = {};

export const SvgBody: React.FC<Props> = ({ texts, fontSize, width }) => (
  <g filter="url(#drop-shadow)">
    <g clipPath="url(#text-helmet)">
      <text fontSize={fontSize} {...fontOptions} style={styles} textLength={width} lengthAdjust="spacingAndGlyphs">
        {texts}
      </text>
    </g>
  </g>
);
