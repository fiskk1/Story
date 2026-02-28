import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  latitude: z.number(),
  longitude: z.number(),
  datetime: z.string(),
  type: z.string().min(2),
  isPrivate: z.boolean(),
  isPaid: z.boolean(),
  priceSats: z.number().int().nonnegative().optional().nullable(),
  maxAttendees: z.number().int().positive().optional().nullable(),
  lightningAddress: z.string().optional().nullable()
});
