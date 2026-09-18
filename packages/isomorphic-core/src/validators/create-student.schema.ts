import { z } from 'zod';
import { messages } from '@core/config/messages';
import { latinNamePattern } from '@core/utils/forms/only-latin';

/* ---------- helpers ---------- */
const todayYMD = (): Date => {
  const d = new Date();
  // compare by date only (strip time)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};
const isYMD = (s?: string) =>
  !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(s).getTime());

/* ---------- Shared: uploaded attachment from /v1/attachments ---------- */
export const uploadedAttachmentSchema = z.object(
  {
    public_id: z.string().min(1, { message: 'File is required.' }),
    file_name: z.string(),
    extension: z.string(),
    file_size: z.number().optional(),
  },
  { required_error: 'certificate file is required.' }
);
export type UploadedAttachment = z.infer<typeof uploadedAttachmentSchema>;

/* ---------- Names: letters only (Unicode letters) ---------- */

const lettersOnly = z
  .string()
  .min(1, { message: 'Required' })
  .refine((v) => latinNamePattern.test(v), {
    message: 'Only Latin letters, spaces are allowed',
  });

const lettersOnlyOptional = z
  .string()
  .optional()
  .refine((v) => v === undefined || v === '' || latinNamePattern.test(v), {
    message: 'Only Latin letters, spaces are allowed',
  });

/* ---------- Phone: Uzbek, 12 digits (no spaces/parens in payload) ---------- */
/** Accepts +998 and 9 more digits. UI shows mask; payload stored like +998XXXXXXXXX */
const uzPhone = z
  .string({ required_error: messages.phoneNumberIsRequired })
  .refine(
    (v) =>
      /^\+?998\d{9}$/.test(v) || /^\+998\(\d{2}\)\s?\d{3}\s?\d{2}\s?\d{2}$/.test(v),
    {
      message: messages.phoneIsInvalid,
    }
  );

/* ---------- Test scores ---------- */
const testScoreBase = z.object({
  name: z.enum(['IELTS', 'SAT']),
  // IELTS TRF is optional; if present, alphanumeric (Latin letters & digits)
  trf_number: z
    .string()
    .optional()
    .refine((v) => v == null || v === '' || /^[A-Za-z0-9]+$/.test(v), {
      message: 'TRF can contain only Latin letters and digits',
    }),
  registration_no: z.string().optional(), // SAT
  test_date: z.string().refine(isYMD, { message: 'Test date is required' }),
  expiry_date: z.string().optional(), // IELTS only
  // keep score as string in the form; validate numeric in refinements
  score: z
    .string({ required_error: 'Overall score is required' })
    .min(1, { message: 'Overall score is required' }),
  certificate_attachment_id: z.union([
    z.string().min(1, { message: 'Certificate file is required.' }),
    uploadedAttachmentSchema,
    z
      .array(uploadedAttachmentSchema)
      .min(1, { message: 'Certificate file is required.' }),
  ]),
  breakdown: z.record(z.string(), z.string().trim().min(1)).default({}),
});

const testScoreSchema = testScoreBase.superRefine((val, ctx) => {
  const t0 = todayYMD();

  // test_date must not be later than today
  if (val.test_date && isYMD(val.test_date)) {
    const d = new Date(val.test_date);
    const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (dd > t0) {
      ctx.addIssue({
        code: 'custom',
        path: ['test_date'],
        message: 'Test date cannot be later than today',
      });
    }
  }

  // IELTS rules
  if (val.name === 'IELTS') {
    // expiry_date required & ≥ today (unchanged)
    if (!val.expiry_date || !isYMD(val.expiry_date)) {
      ctx.addIssue({
        code: 'custom',
        path: ['expiry_date'],
        message: 'Expiry date is required',
      });
    } else {
      const ed = new Date(val.expiry_date);
      const e0 = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate());
      if (e0 < t0) {
        ctx.addIssue({
          code: 'custom',
          path: ['expiry_date'],
          message: 'Expiry date cannot be before today',
        });
      }
    }

    // overall 4.0–9.0 (accept whole or .5/.0)
    const overallStr = String(val.score ?? '').trim();
    const bandPattern = /^(?:[4-8](?:\.0|\.5)?|9(?:\.0)?)$/;
    if (!bandPattern.test(overallStr)) {
      ctx.addIssue({
        code: 'custom',
        path: ['score'],
        message: 'Overall must be between 4.0 and 9.0',
      });
    }
    const ov = parseFloat(overallStr);

    // Each band must be 4.0–9.0
    const bands = ['Reading', 'Listening', 'Writing', 'Speaking'] as const;
    const nums: number[] = [];
    bands.forEach((k) => {
      const raw = String(val.breakdown?.[k] ?? '').trim();
      if (!bandPattern.test(raw)) {
        ctx.addIssue({
          code: 'custom',
          path: ['breakdown', k],
          message: `${k} must be between 4.0 and 9.0`,
        });
      } else {
        nums.push(parseFloat(raw));
      }
    });

    // If all bands valid and overall looks valid, enforce IELTS rounding rule
    if (nums.length === 4 && !Number.isNaN(ov)) {
      const avg = (nums[0] + nums[1] + nums[2] + nums[3]) / 4;
      // round to nearest 0.5
      const rounded = Math.round(avg * 2) / 2;
      if (Math.abs(rounded - ov) > 1e-6) {
        ctx.addIssue({
          code: 'custom',
          path: ['score'],
          message: `Overall must equal the average of bands (expected ${rounded.toFixed(
            1
          )})`,
        });
      }
    }
  }

  // SAT rules
  if (val.name === 'SAT') {
    // all fields required when SAT is added
    if (!val.registration_no) {
      ctx.addIssue({
        code: 'custom',
        path: ['registration_no'],
        message: 'Registration number is required',
      });
    }

    // overall: number 400–1600 (sum of sections enforces this, but keep explicit guard)
    const ov = Number(val.score);
    if (Number.isNaN(ov) || ov < 400 || ov > 1600) {
      ctx.addIssue({
        code: 'custom',
        path: ['score'],
        message: 'Overall must be between 400 and 1600',
      });
    }

    // breakdown: Math/English each 200–800; both required
    (['Math', 'English'] as const).forEach((k) => {
      const raw = val.breakdown?.[k];
      const n = Number(raw);
      if (raw == null || raw === '' || Number.isNaN(n) || n < 200 || n > 800) {
        ctx.addIssue({
          code: 'custom',
          path: ['breakdown', k],
          message: `${k} must be between 200 and 800`,
        });
      }
    });

    // section sum equals overall
    const math = Number(val.breakdown?.['Math']);
    const eng = Number(val.breakdown?.['English']);
    const isEquels = math + eng == ov;
    if (
      // !Number.isNaN(math) &&
      // !Number.isNaN(eng) &&
      // !Number.isNaN(ov) &&
      !isEquels
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['score'],
        message: 'Overall must equal Math + English',
      });
    }
  }
});

/* ---------- Certificates (achievements) ---------- */
const certificateSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, { message: 'Certificate name is required' }),
    date: z.string().refine(isYMD, { message: 'Date awarded is required' }),
    subject: z.string().min(1, { message: 'Subject is required' }),
    description: z.string().optional(),
    level_id: z.number().min(1, { message: 'Award / position is required' }),
    award: z.string().optional(),
    expiry: z.string().optional(),
    file: z.union([
      uploadedAttachmentSchema,
      z
        .array(uploadedAttachmentSchema)
        .min(1, { message: 'Certificate file is required' }),
      z.string().min(1, { message: 'Certificate file is required' }),
    ]),
  })
  .superRefine((v, ctx) => {
    // date not later than today
    const t0 = todayYMD();
    const d = new Date(v.date);
    const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (dd > t0) {
      ctx.addIssue({
        code: 'custom',
        path: ['date'],
        message: 'Awarded date cannot be later than today',
      });
    }
  });

/* ---------- Passport ---------- */
export const PassportSectionSchema = z
  .object({
    doc_type: z.number({ required_error: 'Document type is required' }), // 1=Passport, 2=Birth Certificate
    // no doc_subtype
    passportNumber: z
      .string({ required_error: messages.passportNumberIsRequired })
      .min(1, { message: messages.passportNumberIsRequired }),
    pinfl: z
      .string({ required_error: 'PINFL must contain 14 digits.' })
      .length(14, { message: 'PINFL must contain 14 digits.' })
      .refine((v) => /^\d{14}$/.test(v), {
        message: 'PINFL must contain 14 digits.',
      }),
    given_place: z
      .string({ required_error: messages.passportIssuePlaceRequired })
      .min(1, { message: messages.passportIssuePlaceRequired }),
    act_number: z.string().optional(),
    given_date: z
      .string({ required_error: messages.passportIssueDateRequired })
      .refine(isYMD, { message: messages.passportIssueDateRequired }),

    citizenship_id: z
      .number({ required_error: messages.citizenshipIsRequired })
      .min(1, { message: messages.citizenshipIsRequired }),
    nationality_id: z
      .number({ required_error: messages.nationalityIsRequired })
      .min(1, { message: messages.nationalityIsRequired }),
    expiryDate: z
      .string({ required_error: messages.passportExpiryDateRequired })
      .refine(isYMD, { message: messages.passportExpiryDateRequired })
      .optional(),
    passport_file_id: z
      .array(uploadedAttachmentSchema)
      .min(1, { message: 'File must be a PDF. / File exceeds size limit.' })
      .optional(),
    // certificate_file_id: z
    //   .array(uploadedAttachmentSchema)
    //   .min(1, { message: 'File must be a PDF. / File exceeds size limit.' })
    //   .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.doc_type === 1) {
      // Passport path
      if (!data.passportNumber || data.passportNumber.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['passportNumber'],
          message: messages.passportNumberIsRequired,
        });
      }
      if (!data.expiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['expiryDate'],
          message: messages.passportExpiryDateRequired,
        });
      }
      if (!data.passport_file_id || data.passport_file_id.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['passport_file_id'],
          message: 'Passport file (PDF) is required.',
        });
      }
      return;
    }

    if (data.doc_type === 2) {
      if (!data.passportNumber || data.passportNumber.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['passportNumber'],
          message: messages.passportNumberIsRequired,
        });
      }
      // Birth Certificate path
      // if (
      //   !data.certificate_number ||
      //   data.certificate_number.trim().length === 0
      // ) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     path: ['certificate_number'],
      //     message: 'Certificate number is required',
      //   });
      // }
      // if (data.expiryDate) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     path: ['expiryDate'],
      //     message: 'Expiry date is not applicable for Birth Certificate',
      //   });
      // }
      // if (!data.certificate_file_id || data.certificate_file_id.length === 0) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     path: ['certificate_file_id'],
      //     message: 'Certificate file (PDF) is required.',
      //   });
      // }
      if (!data.passport_file_id || data.passport_file_id.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['passport_file_id'],
          message: 'Passport file (PDF) is required.',
        });
      }
      if (!data.act_number) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['act_number'],
          message: 'Act Number is required',
        });
      }
    }
  });

/* ---------- Main schema ---------- */
export const createStudentSchema = z
  .object({
    // Personal — letters only
    firstName: lettersOnly,
    lastName: lettersOnly,
    middleName: lettersOnlyOptional,

    username: z.string().optional(),
    email: z
      .string({ required_error: messages.emailIsRequired })
      .email({ message: messages.emailIsInvalid ?? messages.emailIsRequired }),

    // Uzbek phone (mask in UI; payload as +998XXXXXXXXX or 998XXXXXXXXX)
    phone: uzPhone,
    dateOfBirth: z
      .string({ required_error: messages.dateOfBirthIsRequired })
      .min(1, { message: messages.dateOfBirthIsRequired }),
    gender: z
      .number({ required_error: messages.genderIsRequired })
      .min(1, { message: messages.genderIsRequired }),
    profilePhoto: z.string().min(1, { message: 'Profile photo is required.' }),

    // Contact
    region: z
      .number({ required_error: messages.regionIsRequired })
      .min(1, { message: messages.regionIsRequired }),
    district: z
      .number({ required_error: messages.districtIsRequired })
      .min(1, { message: messages.districtIsRequired }),
    address: z
      .string({ required_error: messages.addressIsRequired })
      .min(1, { message: messages.addressIsRequired }),
    parent_full_name: lettersOnly,
    parent_phone: uzPhone,

    // Passport
    // passportNumber: z
    //   .string({ required_error: messages.passportNumberIsRequired })
    //   .min(1, { message: messages.passportNumberIsRequired }),
    // pinfl: z
    //   .string({ required_error: 'PINFL must contain 14 digits.' })
    //   .length(14, { message: 'PINFL must contain 14 digits.' })
    //   .refine((v) => /^\d{14}$/.test(v), {
    //     message: 'PINFL must contain 14 digits.',
    //   }),
    // given_place: z
    //   .string({ required_error: messages.passportIssuePlaceRequired })
    //   .min(1, { message: messages.passportIssuePlaceRequired }),
    // given_date: z
    //   .string({ required_error: messages.passportIssueDateRequired })
    //   .refine(isYMD, { message: messages.passportIssueDateRequired }),
    // expiryDate: z
    //   .string({ required_error: messages.passportExpiryDateRequired })
    //   .refine(isYMD, { message: messages.passportExpiryDateRequired }),

    // // lookups now start from 1
    // citizenship_id: z
    //   .number({ required_error: messages.citizenshipIsRequired })
    //   .min(1, { message: messages.citizenshipIsRequired }),
    // nationality_id: z
    //   .number({ required_error: messages.nationalityIsRequired })
    //   .min(1, { message: messages.nationalityIsRequired }),

    // passport_file_id: z
    //   .array(uploadedAttachmentSchema, {
    //     required_error: 'Passport file (PDF) is required.',
    //   })
    //   .min(1, {
    //     message: 'File must be a PDF. / File exceeds size limit.',
    //   }),

    // Education
    education: z
      .number({ required_error: messages.EducationIsRequired })
      .min(1, { message: messages.EducationIsRequired }),
    regionAcademic: z
      .number({ required_error: messages.regionIsRequired })
      .min(1, { message: messages.regionIsRequired }),
    districtAcademic: z
      .number({ required_error: messages.districtIsRequired })
      .min(1, { message: messages.districtIsRequired }),
    educationName: z
      .number({ required_error: messages.educationNameIsRequired })
      .min(1, { message: messages.educationNameIsRequired }),
    graduationDate: z
      .string({ required_error: messages.graduationDateIsRequired })
      .refine((v) => /^\d{4}$/.test(v), { message: 'Year is required' }),
    gpa: z
      .string({ required_error: messages.gpaIsRequired })
      .refine((v) => !Number.isNaN(Number(v)), {
        message: 'GPA must be a number',
      })
      .refine(
        (v) => {
          const n = Number(v);
          return n >= 0 && n <= 5;
        },
        { message: 'GPA must be between 0 and 5' }
      ),

    attachments: z
      .array(uploadedAttachmentSchema)
      .min(1, { message: 'Certificate (Shahodatnoma) file is required.' }),

    // Scores & achievements
    testScores: z.array(testScoreSchema).default([]),
    certificates: z.array(certificateSchema).optional().default([]),
  })
  .and(PassportSectionSchema)
  .superRefine((val, ctx) => {
    const t0 = todayYMD();

    // Passport date rules:
    // 1) given_date cannot be later than today
    // if (val.given_date && isYMD(val.given_date)) {
    //   const d = new Date(val.given_date);
    //   const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    //   if (dd > t0) {
    //     ctx.addIssue({
    //       code: 'custom',
    //       path: ['given_date'],
    //       message: 'Given date cannot be later than today',
    //     });
    //   }
    // }
    // // 2) expiryDate cannot be before today
    // if (val.expiryDate && isYMD(val.expiryDate)) {
    //   const d = new Date(val.expiryDate);
    //   const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    //   if (dd < t0) {
    //     ctx.addIssue({
    //       code: 'custom',
    //       path: ['expiryDate'],
    //       message: 'Expiry date cannot be before today',
    //     });
    //   }
    // }

    // Graduation year <= current year
    if (val.graduationDate && /^\d{4}$/.test(val.graduationDate)) {
      const gy = Number(val.graduationDate);
      const nowY = new Date().getFullYear();
      if (gy < nowY) {
        ctx.addIssue({
          code: 'custom',
          path: ['graduationDate'],
          message: 'Graduation year cannot be in the past',
        });
      }
    }
  });

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
