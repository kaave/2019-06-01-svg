import * as React from 'react';

export interface Props {
  text: string;
}

const dasharrays = [[0.5, 4, 0.3], [0.8, 10, 0.3], [0.2, 13, 0.3], [0.3, 70, 0.7], [8, 5, 0.1]];

const fontOptions: React.SVGProps<SVGTextElement> = {
  x: '0',
  y: '58',
  fontFamily: 'Roboto Condensed',
  letterSpacing: '-1',
  fontSize: '75',
  textAnchor: 'start',
};

export const SvgBody: React.FC<Props> = ({ text }) => (
  <g id="text-path" filter="url(#s42)">
    <g clipPath="url(#text-helmet)">
      <text {...fontOptions} fill="url(#text-color)">
        <tspan>{text}</tspan>
      </text>
      <g className="strokes" strokeWidth="0.3">
        {dasharrays.map(([da1, da2, os], i) => (
          <text
            key={i}
            {...fontOptions}
            fill="none"
            stroke="url(#text-color)"
            strokeWidth="0.5px"
            strokeDasharray={`${da1} ${da2}`}
            strokeDashoffset={os}
          >
            <tspan>{text}</tspan>
          </text>
        ))}
      </g>
    </g>
  </g>
);
