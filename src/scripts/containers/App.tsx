import * as React from 'react';

import { execCopy } from '../modules/execCopy';
import { Svg } from '../components/Svg';
import { Code } from '../components/Code';
import { Menu } from '../components/Menu';

export const App: React.FC<{}> = () => {
  const [svgCode, setSvgCode] = React.useState('');
  const svgRef = React.useRef<SVGSVGElement>(null);

  const onCopyClick = () => {
    if (!svgRef.current) {
      return;
    }

    execCopy(svgRef.current.outerHTML);
  };

  React.useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    setSvgCode(svgRef.current.outerHTML);
  });

  return (
    <main id="main" className="Main" role="main">
      <Svg svgRef={svgRef} />
      <Code code={svgCode} />
      <Menu onCopyClick={onCopyClick} />
    </main>
  );
};
