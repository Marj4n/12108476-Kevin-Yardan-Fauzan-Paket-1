import { z } from "zod";

export const bookCategoryCreationSchema = z.object({
  bookId: z.number(),
  categoryId: z.number(),
});

export const bookCategoryUpdateSchema = z.object({
  bookId: z.number().optional(),
  categoryId: z.number().optional(),
});
