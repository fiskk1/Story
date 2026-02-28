export type EventItem = {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  datetime: string;
  type: string;
  isPrivate: boolean;
  isPaid: boolean;
  priceSats?: number | null;
  host: { id: string; name: string };
  _count?: { attendees: number };
};
