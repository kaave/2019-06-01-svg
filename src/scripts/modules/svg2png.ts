function getBlobFromBase64(base64: string) {
  const [head, source] = base64.split(',');
  const data = atob(source);
  const mimetype = head.split(':')[1].split(';')[0];
  const buf = new Uint8Array(data.length);
  // eslint-disable-next-line no-return-assign
  [...Array(data.length).keys()].forEach(i => (buf[i] = data.charCodeAt(i)));
  const blob = new Blob([buf], { type: mimetype });
  return blob;
}

// 画像のダウンロード
function savePng(blob: Blob) {
  const url = window.URL;
  const dataUrl = url.createObjectURL(blob);
  // イベント作成
  const event = document.createEvent('MouseEvents');
  event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  // a要素を作成
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'untitle.png';
  a.dispatchEvent(event);
}

export function svg2png(svgElement: SVGSVGElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = svgElement.width.baseVal.value;
    canvas.height = svgElement.height.baseVal.value;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const image = new Image();

    image.onload = () => {
      // SVGデータをPNG形式に変換する
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const base64 = canvas.toDataURL();
      const blob = getBlobFromBase64(base64);
      savePng(blob);
      resolve();
    };

    image.onerror = e => reject(e);

    // SVGデータを取り出す
    const svgData = new XMLSerializer().serializeToString(svgElement);
    image.src = `data:image/svg+xml;charset=utf-8;base64,${btoa(svgData)}`;
  });
}
