import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth/getUser';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { requestId, action } = await req.json();
  if (!requestId || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event || event.hostId !== auth.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const request = await prisma.eventRequest.update({
    where: { id: requestId },
    data: { status: action === 'approve' ? 'APPROVED' : 'REJECTED' }
  });

  if (action === 'approve') {
    await prisma.eventAttendee.upsert({
      where: { eventId_userId: { eventId: event.id, userId: request.userId } },
      update: {},
      create: { eventId: event.id, userId: request.userId }
    });
  }

  return NextResponse.json({ request });
}
