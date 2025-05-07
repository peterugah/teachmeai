import { languageValues } from '@shared/languageEnum';
import { z } from 'zod';

export const translateValidator = z.object({
  language: z.enum(languageValues),
  translations: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    }),
  ),
});
