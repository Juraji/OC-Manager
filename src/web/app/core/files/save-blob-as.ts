const bom = (blob: Blob, autoBom: boolean): Blob => {
  if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
    return new Blob(
      [String.fromCharCode(0xFEFF), blob],
      {type: blob.type}
    );
  }
  return blob;
};

const click = (node: HTMLAnchorElement) => {
  try {
    node.dispatchEvent(new MouseEvent('click'));
  } catch (_) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const event = document.createEvent('MouseEvents');
    // noinspection JSDeprecatedSymbols
    event.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
      20, false, false, false, false, 0, null);
    node.dispatchEvent(event);
  }
}

const saveWithHtmlAnchorDownload = (blob: Blob, name: string) => {
  const hrefElement = document.createElement('a');
  hrefElement.download = name;
  hrefElement.rel = 'noopener';
  hrefElement.href = URL.createObjectURL(blob);

  setTimeout(() => URL.revokeObjectURL(hrefElement.href), 4e4);
  setTimeout(() => click(hrefElement), 0);
}

const saveWithMsSaveOrOpenBlob = (blob: Blob, name: string, autobom: boolean) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (navigator as any).msSaveOrOpenBlob(bom(blob, autobom), name)

const downloadWithFileReaderAndPopUp = (blob: Blob, name: string, autobom: boolean, popup?: Window) => {
  const currentPopup = popup || open('', '_blank');

  if (!!currentPopup) {
    currentPopup.document.title =
      currentPopup.document.body.innerText = 'Downloading...'
  }

  const force = blob.type === 'application/octet-stream';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isSafari = /constructor/i.test(HTMLElement as any) || (window as any).safari;
  const isChromeIOS = /CriOS\/\d+/.test(navigator.userAgent);

  if ((isChromeIOS || (force && isSafari)) && !!FileReader) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;

      const url = isChromeIOS
        ? result
        : result.replace(/^data:[^;]*;/, 'data:attachment/file;');

      if (!!currentPopup) {
        currentPopup.location.href = url;
      } else {
        window.location.href = url;
      }
    }
  } else {
    const url = URL.createObjectURL(blob)
    if (!!currentPopup) {
      currentPopup.location.href = url;
    } else {
      window.location.href = url;
    }

    setTimeout(() => URL.revokeObjectURL(url), 4e4);
  }
}

export const saveBlobAs = (
  blob: Blob,
  name?: string,
  autobom = false
): void => {
  const fileName = name || 'download'

  if ('download' in HTMLAnchorElement.prototype) {
    saveWithHtmlAnchorDownload(blob, fileName);
  } else if ('msSaveOrOpenBlob' in navigator) {
    saveWithMsSaveOrOpenBlob(blob, fileName, autobom);
  } else {
    downloadWithFileReaderAndPopUp(blob, fileName, autobom);
  }
};
