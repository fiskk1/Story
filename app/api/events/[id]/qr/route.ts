import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAuthUser } from '@/lib/auth/getUser';
import { prisma } from '@/lib/prisma';
import { generateQrDataUrl } from '@/lib/services/qr';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event || event.hostId !== auth.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const token = crypto.randomUUID();
  const payload = {
    eventId: event.id,
    token,
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 2 * 60 * 1000).toISOString()
  };

  const qr = await generateQrDataUrl(payload);
  return NextResponse.json({ qr, payload });
}
