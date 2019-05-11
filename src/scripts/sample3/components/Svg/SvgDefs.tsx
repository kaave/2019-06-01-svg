import * as React from 'react';

export type Props = {
  cut?: number;
};

export const SvgDefs: React.FC<Props> = () => (
  <defs>
    <linearGradient id="text-color" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#f03" />
      <stop offset="0.2" stopColor="#0fa" />
      <stop offset="1" stopColor="#03f" />
    </linearGradient>
  </defs>
);
