import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createEventSchema } from '@/lib/validation/schemas';
import { getAuthUser } from '@/lib/auth/getUser';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || undefined;
  const type = searchParams.get('type') || undefined;
  const visibility = searchParams.get('visibility');
  const paid = searchParams.get('paid');

  const events = await prisma.event.findMany({
    where: {
      AND: [
        q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {},
        type ? { type: { equals: type, mode: 'insensitive' } } : {},
        visibility === 'public' ? { isPrivate: false } : {},
        visibility === 'private' ? { isPrivate: true } : {},
        paid === 'free' ? { isPaid: false } : {},
        paid === 'paid' ? { isPaid: true } : {}
      ]
    },
    include: {
      host: { select: { id: true, name: true } },
      _count: { select: { attendees: true } }
    },
    orderBy: { datetime: 'asc' }
  });

  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = createEventSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const body = parsed.data;
  if (body.isPaid && (!body.priceSats || body.priceSats <= 0)) {
    return NextResponse.json({ error: 'priceSats required for paid events' }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      ...body,
      datetime: new Date(body.datetime),
      hostId: auth.userId
    }
  });

  return NextResponse.json({ event }, { status: 201 });
}
