import { languageValues } from '@shared/languageEnum';
import { z } from 'zod';

export const askValidator = z.object({
  context: z.string({ required_error: 'context is required' }).min(1),
  searchTerm: z
    .string({
      required_error: 'search term is required',
    })
    .min(1),
  language: z.enum(languageValues, { required_error: 'language is required' }),
});

export const RespondDtoValidator = z.object({
  askId: z.number(),
  type: z.string(),
  content: z.string().min(1),
});
