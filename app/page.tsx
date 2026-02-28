'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import EventCard from '@/components/EventCard';
import { EventItem } from '@/types';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [q, setQ] = useState('');
  const [visibility, setVisibility] = useState('all');
  const [paid, setPaid] = useState('all');

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (visibility !== 'all') params.set('visibility', visibility);
    if (paid !== 'all') params.set('paid', paid);
    fetch(`/api/events?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []));
  }, [q, visibility, paid]);

  const count = useMemo(() => events.length, [events]);

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4">
      <section className="card flex flex-wrap items-center gap-3">
        <input className="input max-w-sm" placeholder="Search events" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input w-40" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="all">All Visibility</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <select className="input w-40" value={paid} onChange={(e) => setPaid(e.target.value)}>
          <option value="all">Free + Paid</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
        <span className="ml-auto text-sm text-slate-600">{count} events</span>
      </section>

      <MapView events={events} onSelect={setSelected} />

      {selected && (
        <section className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-2xl rounded-t-3xl bg-white p-4 shadow-float md:static md:rounded-2xl">
          <EventCard event={selected} />
          <a href={`/event/${selected.id}`} className="btn-primary mt-3 w-full">
            View Event
          </a>
        </section>
      )}
    </main>
  );
}
