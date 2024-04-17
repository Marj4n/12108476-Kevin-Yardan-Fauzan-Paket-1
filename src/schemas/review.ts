import { z } from "zod";

export const reviewCreationSchema = z.object({
  userId: z.number(),
  bookId: z.number(),
  rating: z.number().min(1).max(5),
  review: z.string(),
});
