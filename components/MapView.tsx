'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { EventItem } from '@/types';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function MapView({ events, onSelect }: { events: EventItem[]; onSelect: (e: EventItem) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !mapboxgl.accessToken) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-73.97, 40.78],
      zoom: 10
    });

    events.forEach((event) => {
      const el = document.createElement('div');
      el.className = 'h-4 w-4 rounded-full border-2 border-white';
      el.style.background = event.isPaid ? '#f97316' : event.isPrivate ? '#a855f7' : '#22c55e';
      el.onclick = () => onSelect(event);

      new mapboxgl.Marker(el).setLngLat([event.longitude, event.latitude]).addTo(map);
    });

    return () => map.remove();
  }, [events, onSelect]);

  return <div ref={mapRef} className="h-[70vh] w-full rounded-2xl shadow-float" />;
}
