import * as React from 'react';

interface Props {
  code: string;
}

export const Code: React.FC<Props> = ({ code }) => (
  <pre>
    <code>{code}</code>
  </pre>
);
