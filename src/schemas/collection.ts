import { z } from "zod";

export const collectionCreationSchema = z.object({
  userId: z.number(),
  bookId: z.number(),
});
