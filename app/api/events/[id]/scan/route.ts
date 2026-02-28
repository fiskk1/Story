import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth/getUser';
import { enforceRateLimit } from '@/lib/services/rateLimit';
import { createMockInvoice } from '@/lib/services/lightning';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const key = `${auth.userId}:${params.id}`;
  if (!enforceRateLimit(key, 15, 60_000)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: 'Missing QR token' }, { status: 400 });

  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  const joined = await prisma.eventAttendee.findUnique({
    where: { eventId_userId: { eventId: params.id, userId: auth.userId } }
  });

  if (!joined) return NextResponse.json({ error: 'Join event first' }, { status: 403 });

  const exists = await prisma.attendance.findUnique({ where: { eventId_userId: { eventId: params.id, userId: auth.userId } } });
  if (exists) return NextResponse.json({ error: 'Attendance already recorded' }, { status: 409 });

  if (event.isPaid && event.priceSats) {
    const invoice = createMockInvoice({ amount: event.priceSats, memo: `MeetSpace ${event.title}` });
    const payment = await prisma.payment.create({
      data: {
        userId: auth.userId,
        eventId: event.id,
        invoiceId: invoice.invoiceId,
        amount: invoice.amount,
        status: 'PENDING'
      }
    });
    return NextResponse.json({ requiresPayment: true, invoice, paymentId: payment.id }, { status: 202 });
  }

  const attendance = await prisma.attendance.create({
    data: { eventId: event.id, userId: auth.userId, paid: false, qrToken: token }
  });

  return NextResponse.json({ attendance, requiresPayment: false });
}
