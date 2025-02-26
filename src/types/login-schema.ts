import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address'}),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  code: z.optional(z.string()),
});
export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address'}),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  name: z.string().min(4, { message: 'Name must be at least 4 characters' }),
});
