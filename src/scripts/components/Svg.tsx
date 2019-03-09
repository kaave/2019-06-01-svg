import * as React from 'react';

import { SvgDefs } from './SvgDefs';
import { SvgBody } from './SvgBody';

export interface Props {
  text: string;
  svgRef: React.RefObject<SVGSVGElement>;
}

export const Svg: React.FC<Props> = ({ text, svgRef }) => {
  const width = 397;
  const height = 59;

  return (
    <svg
      className="Output"
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      enableBackground="new"
    >
      <SvgDefs />
      <SvgBody text={text} />
    </svg>
  );
};
