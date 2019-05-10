import * as React from 'react';
import { render } from 'react-dom';

import { App } from '../sample1/containers/App';

export function renderer() {
  const mountpoint = document.getElementById('mount-point');
  render(<App />, mountpoint);
}
