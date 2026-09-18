import { z } from 'zod';
import { messages } from '@core/config/messages';
import { fileSchema, validateEmail } from '@core/validators/common-rules';

// Define education schema
const educationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  year: z.string(),
});

// Define a schema for research interest
const researchInterestSchema = z.object({
  value: z.string(),
});

// form zod validation schema
export const profileFormSchema = z.object({
  // Basic information
  username: z.string().min(1, { message: messages.usernameIsRequired }),
  name: z.string().min(1, { message: messages.nameIsRequired }),
  website: z.string().optional(),

  // Contact information
  email: validateEmail,
  phone: z.string().optional(),
  office: z.string().optional(),
  officeHours: z.string().optional(),

  // Professional information
  department: z.string().optional(),
  position: z.string().optional(),
  specialization: z.string().optional(),
  joinDate: z.string().optional(),

  // Academic information
  bio: z.string().optional(),
  education: z.array(educationSchema).optional(),
  researchInterests: z.array(researchInterestSchema).optional(),

  // Media and files
  avatar: fileSchema.optional(),
  portfolios: z.array(fileSchema).optional(),
});