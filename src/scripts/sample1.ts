import './common/initializer';

import FontFaceObserver from 'fontfaceobserver';
import { renderer } from './modules/renderer1';

const onDOMContentLoaded = () => new Promise(resolve => window.addEventListener('DOMContentLoaded', () => resolve()));
const onFontLoaded = new FontFaceObserver('Crimson Text', { weight: 700 }).load();

Promise.all([onDOMContentLoaded, onFontLoaded]).then(() => renderer());
