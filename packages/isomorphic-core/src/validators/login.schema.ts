import { z } from 'zod';

const loginField = z
  .string()
  .trim()
  .min(1, 'Login is required')
  .refine(
    (val) => {
      const v = val.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      const digits = v.replace(/[\s\-()]/g, '');
      const isPhone = /^\+?[1-9]\d{7,14}$/.test(digits); // E.164-ish
      const isUsername = /^[a-zA-Z0-9._-]{3,32}$/.test(v);
      return isEmail || isPhone || isUsername;
    },
    { message: 'Enter a valid email, phone number, or username' }
  );

export const loginSchema = z.object({
  login: loginField,
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
