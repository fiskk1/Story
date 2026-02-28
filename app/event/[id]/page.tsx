'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import JoinButton from '@/components/JoinButton';
import QRScanner from '@/components/QRScanner';
import { apiFetch } from '@/lib/client-auth';

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [scanResult, setScanResult] = useState('');

  useEffect(() => {
    fetch(`/api/events/${params.id}`).then((r) => r.json()).then((d) => setEvent(d.event));
  }, [params.id]);

  async function handleScan(text: string) {
    try {
      const parsed = JSON.parse(text);
      const res = await apiFetch(`/api/events/${params.id}/scan`, {
        method: 'POST',
        body: JSON.stringify({ token: parsed.token })
      });
      const json = await res.json();

      if (json.requiresPayment) {
        await apiFetch('/api/payments/webhook', {
          method: 'POST',
          body: JSON.stringify({
            invoiceId: json.invoice.invoiceId,
            eventId: params.id,
            userId: JSON.parse(atob(localStorage.getItem('meetspace_token')!.split('.')[1])).userId,
            qrToken: parsed.token
          })
        });
        setScanResult('Payment simulated and attendance confirmed.');
      } else {
        setScanResult('Attendance confirmed.');
      }
    } catch {
      setScanResult('Invalid QR payload.');
    }
  }

  if (!event) return <main className="p-4">Loading...</main>;

  return (
    <main className="mx-auto grid max-w-4xl gap-4 p-4 md:grid-cols-2">
      <section className="card space-y-2">
        <h1 className="text-2xl font-semibold">{event.title}</h1>
        <p>{event.description}</p>
        <p>{new Date(event.datetime).toLocaleString()}</p>
        <p>{event.type}</p>
        <p>{event.isPrivate ? 'Private' : 'Public'} · {event.isPaid ? `${event.priceSats} sats` : 'Free'}</p>
        <JoinButton eventId={event.id} isPrivate={event.isPrivate} />
      </section>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">Scan host QR to attend</h2>
        <QRScanner onScan={handleScan} />
        {scanResult && <p className="text-sm text-slate-700">{scanResult}</p>}
      </section>
    </main>
  );
}
