import * as React from 'react';
import { html_beautify as htmlBeautify } from 'js-beautify';
import * as dg from 'dis-gui';

import { execCopy } from '../modules/execCopy';
import { svg2png } from '../modules/svg2png';
import { Svg, Props as SvgProps } from '../components/Svg';
import { Code } from '../components/Code';
import { Menu } from '../components/Menu';

export type MenuDispatch = 'copy' | 'png';

export const App: React.FC<{}> = () => {
  const [text, setText] = React.useState('HELLO, SVG');
  const [width, setWidth] = React.useState(250);
  const [isGradient, setIsGradient] = React.useState(false);
  const [lengthAdjust, setLengthAdjust] = React.useState('spacing');
  const [svgCode, setSvgCode] = React.useState('');
  const svgRef = React.useRef<SVGSVGElement>(null);
  const svgProps: SvgProps = {
    svgRef,
    text,
    lengthAdjust,
    isGradient,
    fontSize: 75,
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
        <dg.Text label="Text" value={text} onChange={(s: string) => setText(s)} />
        <dg.Number label="Width" value={width} min={50} max={2000} step={25} onChange={(n: number) => setWidth(n)} />
        <dg.Checkbox label="Gradient" onChange={(b: boolean) => setIsGradient(b)} />
        <dg.Select
          label="lengthAdjust"
          value={lengthAdjust}
          options={['spacing', 'spacingAndGlyphs']}
          onChange={(s: string) => setLengthAdjust(s)}
        />
        <dg.Button label="Button" />
      </dg.GUI>
    </main>
  );
};
