import { z } from "zod";

export const lendingCreationSchema = z.object({
  userId: z.number(),
  bookId: z.number(),
});
