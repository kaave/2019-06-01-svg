import * as React from 'react';

export interface Props {
  texts: string[];
  fontSize: number;
  width: number;
  isGradient: boolean;
  lengthAdjust: string;
}

const fontOptions: React.SVGProps<SVGTextElement> = {
  x: 0,
  y: '1em',
  fontFamily: 'Roboto Condensed',
  // fontFamily: 'sans-serif',
  fontWeight: 700,
  width: '100%',
};
const styles: React.CSSProperties = {};

export const SvgBody: React.FC<Props> = ({ texts, fontSize, width, isGradient, lengthAdjust }) => (
  <g filter="url(#drop-shadow)">
    <g clipPath="url(#text-helmet)">
      <text
        fontSize={fontSize}
        {...fontOptions}
        fill={isGradient ? 'url(#text-color)' : '#fff'}
        style={styles}
        textLength={width}
        lengthAdjust={lengthAdjust}
      >
        {texts}
      </text>
    </g>
  </g>
);
