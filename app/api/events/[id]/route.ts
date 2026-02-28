import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      host: { select: { id: true, name: true } },
      attendees: { include: { user: { select: { id: true, name: true, email: true } } } },
      requests: { include: { user: { select: { id: true, name: true } } } }
    }
  });

  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ event });
}
