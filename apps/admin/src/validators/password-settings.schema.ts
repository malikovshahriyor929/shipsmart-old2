import { z } from 'zod';
import { messages } from '@core/config/messages';
import {
  validateNewPassword,
  validateConfirmPassword,
} from '@core/validators/common-rules';

// form zod validation schema
export const passwordFormSchema = z
  .object({
    newPassword: validateNewPassword,
    confirmedPassword: validateConfirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmedPassword, {
    message: messages.passwordsDidNotMatch,
    path: ['confirmedPassword'], // Correct path for the confirmedPassword field
  });

// generate form types from zod validation schema
export type PasswordFormTypes = z.infer<typeof passwordFormSchema>;
