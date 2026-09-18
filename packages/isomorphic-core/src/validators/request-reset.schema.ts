import { z } from 'zod';

export const requestResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type RequestResetSchema = z.infer<typeof requestResetSchema>;
