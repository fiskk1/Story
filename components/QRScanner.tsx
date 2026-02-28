'use client';

import { useEffect } from 'react';

type Props = { onScan: (text: string) => void };

export default function QRScanner({ onScan }: Props) {
  useEffect(() => {
    let scanner: any;
    let active = true;

    (async () => {
      const { Html5QrcodeScanner } = await import('html5-qrcode');
      if (!active) return;
      scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 220 }, false);
      scanner.render(
        (decodedText: string) => onScan(decodedText),
        () => {
          // ignore decode errors
        }
      );
    })();

    return () => {
      active = false;
      if (scanner) scanner.clear().catch(() => null);
    };
  }, [onScan]);

  return <div id="reader" className="w-full" />;
}
