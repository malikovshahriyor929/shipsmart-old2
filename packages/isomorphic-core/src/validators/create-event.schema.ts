// validators/create-event.schema.ts
import { z } from 'zod';
import { messages } from '@core/config/messages';

// helper: conditional location
export const eventFormSchema = z
  .object({
    name: z.string().min(1, { message: messages.nameIsRequired }),
    description: z.string().optional(),
    is_online: z.boolean(),
    location: z.string().optional(), // required if offline
    startDate: z.date({ required_error: messages.startDateIsRequired }),
    endDate: z.date({ required_error: messages.endDateIsRequired }),

    // participants
    participantsMode: z.enum(['all', 'selected']),
    // temporary UI: comma-separated IDs (you'll replace with your component)
    studentsCsv: z.string().optional(),
  })
  .refine(
    (v) => v.is_online || (!!v.location && v.location.trim().length > 0),
    { message: 'Location is required for offline meetings', path: ['location'] }
  )
  .refine(
    (v) => {
      if (v.participantsMode === 'all') return true;
      return !!v.studentsCsv && v.studentsCsv.trim().length > 0;
    },
    { message: 'Please select at least one student', path: ['studentsCsv'] }
  )
  .refine((v) => v.endDate > v.startDate, {
    message: 'End time must be after the start time',
    path: ['endDate'],
  });

// generate types
export type EventFormInput = z.infer<typeof eventFormSchema>;
