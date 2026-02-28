import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'meetspace_dev_secret';

export type AuthPayload = {
  userId: string;
  email: string;
  name: string;
};

export const signToken = (payload: AuthPayload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET) as AuthPayload;
