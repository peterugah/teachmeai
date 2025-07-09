import { z } from 'zod';

export const createUserValidator = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});
