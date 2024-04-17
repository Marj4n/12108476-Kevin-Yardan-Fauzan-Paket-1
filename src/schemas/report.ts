import { z } from "zod";

export const reportSchema = z.object({
  userId: z.number(),
});
