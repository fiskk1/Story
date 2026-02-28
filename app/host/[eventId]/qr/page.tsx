'use client';

import { apiFetch } from '@/lib/client-auth';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HostQrPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [qr, setQr] = useState('');
  const [expires, setExpires] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    async function load() {
      const res = await apiFetch(`/api/events/${eventId}/qr`);
      const json = await res.json();
      if (res.ok) {
        setQr(json.qr);
        setExpires(json.payload.expiresAt);
      }
    }
    load();
    timer = setInterval(load, 120000);
    return () => clearInterval(timer);
  }, [eventId]);

  return (
    <main className="mx-auto max-w-lg p-4">
      <section className="card space-y-3 text-center">
        <h1 className="text-xl font-semibold">Event Check-in QR</h1>
        {qr ? <img src={qr} alt="Event QR" className="mx-auto w-72" /> : <p>Loading QR…</p>}
        <p className="text-sm text-slate-600">Refreshes every 2 minutes · Expires {expires ? new Date(expires).toLocaleTimeString() : '--'}</p>
      </section>
    </main>
  );
}
