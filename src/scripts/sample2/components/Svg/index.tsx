import * as React from 'react';

import { SvgDefs } from './SvgDefs';
import { SvgBody } from './SvgBody';

export interface Props {
  text: string;
  fontSize: number;
  width?: number;
  height?: number;
  texture: false | string;
  textureType: number;
  isTextureInvert: boolean;
  isGradient: boolean;
  cut: number;
  lengthAdjust: string;
  turbulenceFrequency: number;
  svgRef: React.RefObject<SVGSVGElement>;
}

export const Svg: React.FC<Props> = ({
  text,
  fontSize,
  width,
  height,
  texture,
  textureType,
  isTextureInvert,
  svgRef,
  isGradient,
  cut,
  lengthAdjust,
  turbulenceFrequency,
}) => {
  const texts = text.split('\n');
  const svgWidth =
    width ||
    42 *
      texts
        .map(t => t.length)
        .sort()
        .reverse()[0]; // 雑
  // const svgHeight = height || 59;
  const svgHeight = height || fontSize * texts.length;

  console.log(textureType);
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
      <SvgDefs
        width={svgWidth}
        height={svgHeight}
        turbulenceFrequency={turbulenceFrequency}
        cut={cut}
        texture={texture}
        textureType={textureType}
        isTextureInvert={isTextureInvert}
      />
      <SvgBody
        texts={texts}
        fontSize={fontSize}
        width={svgWidth}
        isGradient={isGradient}
        lengthAdjust={lengthAdjust}
        texture={texture}
      />
    </svg>
  );
};
