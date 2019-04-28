import * as React from 'react';
import { html_beautify as htmlBeautify } from 'js-beautify';
import * as dg from 'dis-gui';

import { execCopy } from '../modules/execCopy';
import { svg2png } from '../modules/svg2png';
import { Svg, Props as SvgProps } from '../components/Svg';
import { Code } from '../components/Code';
import { Menu } from '../components/Menu';

export type MenuDispatch = 'copy' | 'png';

export type LocalStorage = {
  text?: string;
  width?: number;
  damage?: number;
  cut?: number;
  isGradient?: boolean;
  lengthAdjust?: string;
};

const localStorageKey = 'FRONTENDNAGOYA_SVG_STATE';

const initialState = JSON.parse(localStorage.getItem(localStorageKey) || '{}') as LocalStorage;

export const App: React.FC<{}> = () => {
  const [text, setText] = React.useState(initialState.text || 'HELLO, SVG');
  const [width, setWidth] = React.useState(initialState.width || 250);
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
    height: 88,
  };

  const onClickDispatch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const action = e.currentTarget.value as MenuDispatch;

    // eslint-disable-next-line default-case
    switch (action) {
      case 'copy':
        execCopy(svgCode);
        break;
      case 'png':
        if (svgRef.current) {
          await svg2png(svgRef.current);
        }
        break;
    }
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
      <Menu dispatch={onClickDispatch} />
      <dg.GUI>
        <dg.Text label="Text" value={text} onChange={setText} />
        <dg.Number label="Width" value={width} min={50} max={2000} step={25} onChange={setWidth} />
        <dg.Number label="Damage" value={damage} min={0} max={1} step={0.005} onChange={setDamage} />
        <dg.Number label="Cut" value={cut} min={0} max={100} step={0.5} onChange={setCut} />
        <dg.Checkbox label="Gradient" onChange={setIsGradient} />
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
              JSON.stringify({ text, width, damage, cut, isGradient, lengthAdjust }),
            )
          }
        />
      </dg.GUI>
    </main>
  );
};
