'use client';

import { apiFetch } from '@/lib/client-auth';
import { useState } from 'react';

export default function JoinButton({ eventId, isPrivate }: { eventId: string; isPrivate: boolean }) {
  const [msg, setMsg] = useState('');

  const handle = async () => {
    const endpoint = isPrivate ? `/api/events/${eventId}/request` : `/api/events/${eventId}/join`;
    const res = await apiFetch(endpoint, { method: 'POST' });
    const json = await res.json();
    setMsg(res.ok ? (isPrivate ? 'Request sent' : 'Joined event') : json.error || 'Action failed');
  };

  return (
    <div className="space-y-2">
      <button className="btn-primary w-full" onClick={handle}>
        {isPrivate ? 'Request Access' : 'Join Event'}
      </button>
      {msg && <p className="text-sm text-slate-600">{msg}</p>}
    </div>
  );
}
