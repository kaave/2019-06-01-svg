import * as React from 'react';

import { SvgDefs } from './SvgDefs';
import { SvgBody } from './SvgBody';

export interface Props {
  svgRef: React.RefObject<SVGSVGElement>;
  blockCount: number;
}

export const Svg: React.FC<Props> = React.memo(({ svgRef, blockCount }) => {
  const svgWidth = 300;
  const svgHeight = svgWidth / 2.35;

  return (
    <svg
      className="Output"
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      enableBackground="new"
    >
      <SvgDefs />
      <SvgBody {...{ width: svgWidth, height: svgHeight, blockCount }} />
    </svg>
  );
});
