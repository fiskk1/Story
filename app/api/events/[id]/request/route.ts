import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth/getUser';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  if (!event.isPrivate) return NextResponse.json({ error: 'Event is public, use join' }, { status: 400 });

  const request = await prisma.eventRequest.upsert({
    where: { eventId_userId: { eventId: event.id, userId: auth.userId } },
    update: { status: 'PENDING' },
    create: { eventId: event.id, userId: auth.userId }
  });

  return NextResponse.json({ request });
}
