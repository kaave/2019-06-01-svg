import * as React from 'react';

export interface Props {
  texts: string[];
  fontSize: number;
}

const fontOptions: React.SVGProps<SVGTextElement> = {
  x: 0,
  y: '1em',
  fontFamily: 'Roboto Condensed',
  fontWeight: 700,
  letterSpacing: -1,
  fill: '#330',
};
const lineHeight = 0.8;
const styles: React.CSSProperties = {};

export const SvgBody: React.FC<Props> = ({ texts, fontSize }) => (
  <text fontSize={fontSize} {...fontOptions} style={styles}>
    {texts.map((t, i) => (
      <tspan key={t} x={0} dy={`${lineHeight * (i === 0 ? 0 : 1)}em`}>
        {t}
      </tspan>
    ))}
  </text>
);
