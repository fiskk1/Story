'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-auth';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    apiFetch('/api/profile').then((r) => r.json()).then((d) => setUser(d.user));
  }, []);

  if (!user) return <main className="p-4">Login to view profile.</main>;

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-4">
      <section className="card">
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="text-slate-600">{user.bio || 'No bio yet'}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card"><h2 className="mb-2 font-semibold">Events Created</h2>{user.hostedEvents.map((e: any) => <p key={e.id}>{e.title}</p>)}</div>
        <div className="card"><h2 className="mb-2 font-semibold">Events Joined</h2>{user.joinMemberships.map((j: any) => <p key={j.id}>{j.event.title} <span className="text-xs">(Joined)</span></p>)}</div>
        <div className="card"><h2 className="mb-2 font-semibold">Events Attended</h2>{user.attendanceRecords.map((a: any) => <p key={a.id}>{a.event.title} ✅</p>)}</div>
        <div className="card"><h2 className="mb-2 font-semibold">Payment History</h2>{user.payments.map((p: any) => <p key={p.id}>{p.amount} sats - {p.status}</p>)}</div>
      </section>
    </main>
  );
}
