import * as React from 'react';

export interface Props {
  dispatch: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Menu: React.FC<Props> = ({ dispatch }) => (
  <aside className="Menu">
    <ul className="Menu__list">
      <li className="Menu__cell">
        <button type="button" className="Menu__copy" onClick={dispatch} value="copy">
          <figure className="Menu__copy-inner">
            <img src="/copy.svg" alt="Copy" className="Menu__copy-image" />
          </figure>
        </button>
      </li>
      <li className="Menu__cell">
        <button type="button" className="Menu__copy" onClick={dispatch} value="png">
          <figure className="Menu__copy-inner">
            <img src="/png.svg" alt="Download png" className="Menu__copy-image" />
          </figure>
        </button>
      </li>
    </ul>
  </aside>
);
