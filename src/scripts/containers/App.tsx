import * as React from 'react';
import { html_beautify as htmlBeautify } from 'js-beautify';

import { execCopy } from '../modules/execCopy';
import { svg2png } from '../modules/svg2png';
import { Svg } from '../components/Svg';
import { Code } from '../components/Code';
import { Menu } from '../components/Menu';

export type MenuDispatch = 'copy' | 'png';

export const App: React.FC<{}> = () => {
  const [svgCode, setSvgCode] = React.useState('');
  const svgRef = React.useRef<SVGSVGElement>(null);

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
      <Svg svgRef={svgRef} />
      <Code code={svgCode} />
      <Menu dispatch={onClickDispatch} />
    </main>
  );
};
