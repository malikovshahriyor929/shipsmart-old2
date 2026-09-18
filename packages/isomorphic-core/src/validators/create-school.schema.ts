import { z } from 'zod';
import { maskedToCanonicalUz } from '@core/components/inputs/uz-phone';

// Helpers
const isUzPhone = (masked: string) => {
  const canon = maskedToCanonicalUz(masked || '');
  return /^\+?998\d{9}$/.test(canon);
};

export const createSchoolSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(1, { message: 'Name is too short' }),

  type: z
    .number({ required_error: 'School type is required' })
    .int()
    .min(1, { message: 'School type is required' }),

  region_id: z
    .number({ required_error: 'Region is required' })
    .int()
    .min(1, { message: 'Region is required' }),

  district_id: z
    .number({ required_error: 'District is required' })
    .int()
    .min(1, { message: 'District is required' }),

  address: z
    .string({ required_error: 'Address is required' })
    .trim()
    .min(1, { message: 'Address is required' }),

  // Optional but, if provided, must be 6 digits
  postal_code: z
    .string()
    .trim()
    .optional()
    .transform((v) => v ?? '')
    .refine((v) => v === '' || /^\d{6}$/.test(v), {
      message: 'Postal code must be 6 digits',
    }),

  // Validate against canonical form of the masked input
  phone_number: z
    .string({ required_error: 'Phone number is required' })
    .refine(isUzPhone, { message: 'Phone number is invalid' }),

  website_url: z
    .string()
    .trim()
    .optional()
});

export type CreateSchoolInput = z.infer<typeof createSchoolSchema>;
