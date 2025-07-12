import { z } from "zod"

export const createReportValidator = z.object({
  report: z.string(),
  askId: z.number(),
  userId: z.number(),
})