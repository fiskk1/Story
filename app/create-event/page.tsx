'use client';

import { FormEvent, useState } from 'react';
import { apiFetch } from '@/lib/client-auth';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get('title'),
      description: form.get('description'),
      latitude: Number(form.get('latitude')),
      longitude: Number(form.get('longitude')),
      datetime: form.get('datetime'),
      type: form.get('type'),
      isPrivate: form.get('isPrivate') === 'on',
      isPaid: form.get('isPaid') === 'on',
      priceSats: form.get('priceSats') ? Number(form.get('priceSats')) : null,
      maxAttendees: form.get('maxAttendees') ? Number(form.get('maxAttendees')) : null,
      lightningAddress: form.get('lightningAddress') || null
    };

    const res = await apiFetch('/api/events', { method: 'POST', body: JSON.stringify(payload) });
    const json = await res.json();
    if (!res.ok) return setError(json.error ? JSON.stringify(json.error) : 'Failed to create event');
    router.push(`/event/${json.event.id}`);
  }

  return (
    <main className="mx-auto max-w-2xl p-4">
      <form className="card grid gap-3" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">Create Event</h1>
        <input className="input" name="title" placeholder="Title" required />
        <textarea className="input" name="description" placeholder="Description" required rows={4} />
        <div className="grid grid-cols-2 gap-2">
          <input className="input" name="latitude" type="number" step="any" placeholder="Latitude" required />
          <input className="input" name="longitude" type="number" step="any" placeholder="Longitude" required />
        </div>
        <input className="input" name="datetime" type="datetime-local" required />
        <input className="input" name="type" placeholder="Event type" required />
        <label className="flex items-center gap-2"><input type="checkbox" name="isPrivate" /> Private event</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isPaid" /> Paid event</label>
        <input className="input" name="priceSats" type="number" placeholder="Price in sats" />
        <input className="input" name="lightningAddress" placeholder="Lightning address / LNURL" />
        <input className="input" name="maxAttendees" type="number" placeholder="Max attendees" />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="btn-primary">Publish Event</button>
      </form>
    </main>
  );
}
