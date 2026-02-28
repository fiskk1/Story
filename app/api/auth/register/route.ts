import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validation/schemas';
import { signToken } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  const parsed = registerSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

  const hashed = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: { ...parsed.data, password: hashed }
  });

  const token = signToken({ userId: user.id, email: user.email, name: user.name });
  return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}
