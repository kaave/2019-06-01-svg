import './common/initializer';

import FontFaceObserver from 'fontfaceobserver';
import { renderer } from './modules/renderer2';

const onDOMContentLoaded = () => new Promise(resolve => window.addEventListener('DOMContentLoaded', () => resolve()));
const onFontLoaded = new FontFaceObserver('Roboto Condensed', { weight: 700 }).load();

Promise.all([onDOMContentLoaded, onFontLoaded]).then(() => renderer());
