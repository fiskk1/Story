import { NextRequest } from 'next/server';
import { verifyToken } from './jwt';

export function getAuthUser(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.replace('Bearer ', '').trim();
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
