import * as React from 'react';
import { html_beautify as htmlBeautify } from 'js-beautify';
import * as dg from 'dis-gui';

import { execCopy } from '../modules/execCopy';
import { svg2png } from '../modules/svg2png';
import { Svg, Props as SvgProps } from '../components/Svg';
import { Code } from '../components/Code';

export type MenuDispatch = 'copy' | 'png';

export type LocalStorage = {
  text?: string;
  width?: number;
  height?: number;
  texture?: string;
  damage?: number;
  cut?: number;
  isGradient?: boolean;
  lengthAdjust?: string;
};

const localStorageKey = 'FRONTENDNAGOYA_SVG_STATE';
const textures = [
  'abstract-paint',
  'astronomy-dot',
  'burned_paper',
  'concrete-paint',
  'dots',
  'grunge',
  'rust',
  'stones',
  'stratum',
];

const initialState = JSON.parse(localStorage.getItem(localStorageKey) || '{}') as LocalStorage;

export const App: React.FC<{}> = () => {
  const [text, setText] = React.useState(initialState.text || 'HELLO, SVG');
  const [width, setWidth] = React.useState(initialState.width || 250);
  const [height, setHeight] = React.useState(initialState.height || 88);
  const [texture, setTexture] = React.useState(initialState.texture || 'none');
  const [damage, setDamage] = React.useState(initialState.damage || 0);
  const [cut, setCut] = React.useState(initialState.cut || 0);
  const [isGradient, setIsGradient] = React.useState(initialState.isGradient || false);
  const [lengthAdjust, setLengthAdjust] = React.useState(initialState.lengthAdjust || 'spacing');
  const [svgCode, setSvgCode] = React.useState('');
  const svgRef = React.useRef<SVGSVGElement>(null);
  const svgProps: SvgProps = {
    svgRef,
    text,
    lengthAdjust,
    isGradient,
    fontSize: 75,
    turbulenceFrequency: damage,
    cut,
    width,
    height,
    texture: texture === 'none' ? false : texture,
  };

  React.useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    setSvgCode(htmlBeautify(svgRef.current.outerHTML));
  });

  return (
    <main id="main" className="Main" role="main">
      <figure className="Svg__parent">
        <Svg {...svgProps} />
      </figure>
      <Code code={svgCode} />
      <dg.GUI>
        <dg.Text label="Text" value={text} onChange={setText} />
        <dg.Number label="Width" value={width} min={50} max={2000} step={25} onChange={setWidth} />
        <dg.Number label="Height" value={height} min={10} max={200} step={2} onChange={setHeight} />
        <dg.Select label="Texture" value={texture} options={textures} onChange={setTexture} />
        <dg.Number label="Damage" value={damage} min={0} max={1} step={0.005} onChange={setDamage} />
        <dg.Number label="Cut" value={cut} min={0} max={100} step={0.5} onChange={setCut} />
        <dg.Checkbox label="Gradient" checked={isGradient} onChange={setIsGradient} />
        <dg.Select
          label="lengthAdjust"
          value={lengthAdjust}
          options={['spacing', 'spacingAndGlyphs']}
          onChange={setLengthAdjust}
        />
        <dg.Button
          label="Save current state"
          onClick={() =>
            localStorage.setItem(
              localStorageKey,
              JSON.stringify({ text, width, height, texture, damage, cut, isGradient, lengthAdjust }),
            )
          }
        />
        <dg.Button label="Copy current code" onClick={() => execCopy(svgCode)} />
        <dg.Button
          label="Download PNG"
          onClick={() => {
            if (svgRef.current) {
              svg2png(svgRef.current);
            }
          }}
        />
      </dg.GUI>
    </main>
  );
};
