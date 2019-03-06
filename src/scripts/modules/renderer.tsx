import * as React from 'react';
import { render } from 'react-dom';

import { App } from '../containers/App';

export function renderer() {
  const mountpoint = document.getElementById('mount-point');
  render(<App />, mountpoint);
}
