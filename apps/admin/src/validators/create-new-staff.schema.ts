import { z } from 'zod';
import { messages } from '@core/config/messages';

export const StaffRoleSchema = z.enum(['advisor', 'teacher', 'counselor']);
export type StaffRoleKey = z.infer<typeof StaffRoleSchema>;

/**
 * Backend samples show mixed formats:
 * - DD.MM.YYYY in most places
 * - YYYY.MM.DD in advisor create sample (given_date/expire_date)
 * Accept both to avoid silent validation blocks.
 */
const DateSchema = z
  .string()
  .regex(/^(\d{2}\.\d{2}\.\d{4}|\d{4}\.\d{2}\.\d{2})$/, {
    message: 'Date must be in format DD.MM.YYYY (or YYYY.MM.DD).',
  });

const PassportFileItem = z.object({
  public_id: z
    .string()
    .min(1, { message: 'Public ID is required for passport file.' }),
  file_name: z.string().optional(),
  extension: z.string().optional(),
  file_size: z.number().optional(),
});

/**
 * Common base shape (mostly optional where role differs).
 * We keep "passport" required on CREATE by default,
 * but UPDATE will use a separate schema (partial).
 */
const COMMON_CREATE = z.object({
  role: StaffRoleSchema,

  email: z.string().email({ message: messages.emailIsRequired }),

  // you format phone as "+998..." but your UI stores digits too.
  // keep wide range to not block submit.
  phone_number: z
    .string()
    .min(7, { message: 'Phone number must be at least 7 characters.' })
    .max(20, { message: 'Phone number must not exceed 20 characters.' }),

  first_name: z
    .string()
    .min(1, { message: messages.firstNameRequired })
    .max(64, { message: 'First name must not exceed 64 characters.' }),

  last_name: z
    .string()
    .min(1, { message: messages.lastNameRequired })
    .max(64, { message: 'Last name must not exceed 64 characters.' }),

  middle_name: z.string().max(64).optional().default(''),

  date_of_birth: DateSchema,
  gender: z.coerce.number({ message: messages.genderIsRequired }),
  preferred_lang: z.coerce.number({
    message: 'Preferred language is required.',
  }),

  // you show "Photo is required" manually; schema can allow empty
  avatar_url: z.string().optional().default(''),

  // Passport fields (CREATE requires them for advisor/teacher; counselor differs)
  passport_number: z
    .string()
    .regex(/^[A-Z]{2}\d{7}$/, { message: messages.passportNumberInvalid }),

  pinfl: z.string().regex(/^\d{14}$/, {
    message: 'PINFL must be exactly 14 digits.',
  }),

  given_place: z.string().min(2, {
    message: 'Given place must be at least 2 characters.',
  }),

  given_date: DateSchema,
  expire_date: DateSchema,

  citizenship_id: z.coerce.number({ message: messages.citizenshipIsRequired }),
  nationality_id: z.coerce.number({ message: messages.nationalityIsRequired }),

  // Advisor/Teacher must upload passport pdf; counselor example can be empty
  passport_file_id: z.array(PassportFileItem).optional().default([]),

  // region/school differ by role
  region_id: z.coerce.number().optional(),
  school_id: z.coerce.number().optional(),

  // counselor extras (only required in counselor create schema)
  workplace: z.string().optional(),
  specialization: z.string().optional(),
  secondary_email: z.string().email().optional(),
  bio: z.string().optional(),
  social_links: z.array(z.string()).optional(),
});

// ✅ Advisor create
const ADVISOR_CREATE = COMMON_CREATE.extend({
  role: z.literal('advisor'),
  region_id: z.coerce.number({ message: messages.regionIsRequired }),
  school_id: z.coerce.number({ message: 'School is required.' }),
  passport_file_id: z.array(PassportFileItem).min(1, {
    message: 'Passport PDF is required.',
  }),
});

// ✅ Teacher create (per your postman: no school/region)
const TEACHER_CREATE = COMMON_CREATE.extend({
  role: z.literal('teacher'),
  passport_file_id: z.array(PassportFileItem).min(1, {
    message: 'Passport PDF is required.',
  }),
});

// ✅ Counselor create (region + extras required; passport_file optional)
const COUNSELOR_CREATE = COMMON_CREATE.extend({
  role: z.literal('counselor'),
  region_id: z.coerce.number({ message: messages.regionIsRequired }),
  workplace: z.string().min(1, { message: 'Workplace is required.' }),
  specialization: z.string().min(1, { message: 'Specialization is required.' }),
  passport_file_id: z.array(PassportFileItem).optional(),
});

export const createStaffSchema = z.discriminatedUnion('role', [
  ADVISOR_CREATE,
  TEACHER_CREATE,
  COUNSELOR_CREATE,
]);

/**
 * ✅ UPDATE schema:
 * your advisor/teacher GET doesn't return passport object, so you can’t prefill.
 * If we keep passport required, update submit will be blocked forever.
 * So: allow partial updates.
 */
export const updateStaffSchema = z.discriminatedUnion('role', [
  ADVISOR_CREATE.partial().extend({ role: z.literal('advisor') }),
  TEACHER_CREATE.partial().extend({ role: z.literal('teacher') }),
  COUNSELOR_CREATE.partial().extend({ role: z.literal('counselor') }),
]);

// For the form type inference
export const staffFormSchema = createStaffSchema; // default export style if you want
export type StaffFormValues = z.infer<typeof createStaffSchema>;
