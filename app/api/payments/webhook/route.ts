import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { simulateWebhookStatus } from '@/lib/services/lightning';

export async function POST(req: Request) {
  const { invoiceId, eventId, userId, qrToken } = await req.json();
  if (!invoiceId || !eventId || !userId || !qrToken) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const simulated = simulateWebhookStatus(invoiceId);
  const payment = await prisma.payment.findUnique({ where: { invoiceId: simulated.invoiceId } });
  if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'PAID', txHash: simulated.txHash, paidAt: new Date() }
  });

  const attendance = await prisma.attendance.upsert({
    where: { eventId_userId: { eventId, userId } },
    update: { paid: true, paymentId: payment.id, qrToken },
    create: { eventId, userId, paid: true, paymentId: payment.id, qrToken }
  });

  return NextResponse.json({ status: 'ok', attendance });
}
