import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth/getUser';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: {
      hostedEvents: true,
      joinMemberships: { include: { event: true } },
      attendanceRecords: { include: { event: true } },
      eventRequests: { include: { event: true } },
      payments: true
    }
  });

  return NextResponse.json({ user });
}
