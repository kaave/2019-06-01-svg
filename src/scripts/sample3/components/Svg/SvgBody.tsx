import * as React from 'react';

export interface Props {
  width: number;
  height: number;
  blockCount: number;
}

const background = '#fff';
const elementCount = 32;
export const SvgBody: React.FC<Props> = ({ width, height, blockCount }) => {
  const cellWidth = width / elementCount;

  return (
    <g {...{ width, height, fill: background }}>
      <g className="bar">
        {[...Array(blockCount).keys()].map((_, i) => (
          <rect
            {...{
              key: i,
              x: i * cellWidth,
              y: 0,
              fill: 'url(#text-color)',
              width: cellWidth,
              height,
            }}
          />
        ))}
      </g>
      <g className="mask">
        {[...Array(blockCount).keys()].map((_, i) => (
          <rect
            {...{
              key: i,
              x: i * cellWidth,
              y: 0,
              fill: background,
              width: cellWidth,
              height,
              // transform: `scale(1, ${1 - gain / 256})`,
            }}
          />
        ))}
      </g>
    </g>
  );
};
