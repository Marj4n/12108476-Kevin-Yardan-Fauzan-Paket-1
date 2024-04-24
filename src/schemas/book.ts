import { z } from "zod";

export const bookCreationSchema = z.object({
  title: z.string(),
  author: z.string(),
  publisher: z.string(),
  publication_year: z.string(),
  description: z.string(),
  pdf: z.string(),
  cover: z.string(),
  categoryId: z.number(),
});

export const bookUpdateSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  publication_year: z.string().optional(),
  description: z.string().optional(),
  pdf: z.string().optional(),
  cover: z.string().optional(),
});
