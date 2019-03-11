import * as React from 'react';

export interface Props {
  text: string;
}

const fontSize = 75;
const fontOptions: React.SVGProps<SVGTextElement> = {
  fontSize,
  x: 0,
  y: 58,
  fontFamily: 'Roboto Condensed',
  letterSpacing: -1,
  textAnchor: 'start',
};

export const SvgBody: React.FC<Props> = ({ text }) => (
  <g>
    <text {...fontOptions}>
      <tspan>{text}</tspan>
    </text>
  </g>
);
