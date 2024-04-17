import { z } from "zod";

export const bookCreationSchema = z.object({
  title: z.string(),
  author: z.string(),
  publisher: z.string(),
  publication_year: z.string(),
  description: z.string(),
  pdf: z.string(),
  cover: z.string(),
});

export const bookUpdateSchema = z.object({
  title: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  role: z.enum(["user", "admin", "operator"]).optional(),
});
