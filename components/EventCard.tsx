import { EventItem } from '@/types';

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="card space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{event.type}</span>
      </div>
      <p className="text-sm text-slate-600">{event.description}</p>
      <p className="text-sm">{new Date(event.datetime).toLocaleString()}</p>
      <div className="flex gap-2 text-xs">
        <span className="rounded bg-emerald-100 px-2 py-1">{event.isPrivate ? 'Private' : 'Public'}</span>
        <span className="rounded bg-orange-100 px-2 py-1">{event.isPaid ? `${event.priceSats} sats` : 'Free'}</span>
      </div>
    </div>
  );
}
