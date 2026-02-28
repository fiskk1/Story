import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MeetSpace',
  description: 'Social map-based event platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-xl font-bold">
              MeetSpace
            </Link>
            <div className="flex gap-2 text-sm">
              <Link href="/create-event" className="btn-secondary">
                Create Event
              </Link>
              <Link href="/profile" className="btn-secondary">
                Profile
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
