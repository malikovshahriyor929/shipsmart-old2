import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
