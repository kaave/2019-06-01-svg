import * as React from 'react';

export interface Props {
  onCopyClick: () => void;
}

export const Menu: React.FC<Props> = ({ onCopyClick }) => (
  <aside className="Menu">
    <ul className="Menu__list">
      <li className="Menu__cell">
        <button className="Menu__copy" onClick={onCopyClick}>
          <figure className="Menu__copy-inner">
            <img src="/copy.svg" alt="Copy" className="Menu__copy-image" />
          </figure>
        </button>
      </li>
    </ul>
  </aside>
);
