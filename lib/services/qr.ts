import QRCode from 'qrcode';

export async function generateQrDataUrl(payload: object) {
  return QRCode.toDataURL(JSON.stringify(payload), { margin: 1, width: 320 });
}
