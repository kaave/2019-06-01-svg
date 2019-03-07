import * as React from 'react';
import Prism from 'prismjs';

interface Props {
  code: string;
}

export const Code: React.FC<Props> = ({ code }) => {
  // eslint-disable-next-line no-underscore-dangle
  const __html = Prism.highlight(code, Prism.languages.markup, Prism.languages.markup);

  return (
    <pre className="Code language-xml">
      <code className="language-xml" dangerouslySetInnerHTML={{ __html }} />
    </pre>
  );
};
