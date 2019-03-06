import * as React from 'react';

export interface Props {
  onCopyClick: () => void;
}

export const Menu: React.FC<Props> = ({ onCopyClick }) => (
  <aside className="Menu">
    <ul className="Menu__list">
      <li className="Menu__cell">
        <button className="Menu__copy" onClick={onCopyClick}>
          Copy
        </button>
      </li>
    </ul>
  </aside>
);
