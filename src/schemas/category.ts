import { z } from "zod";

export const categoryCreationSchema = z.object({
  name: z.string(),
});

export const categoryUpdateSchema = z.object({
  name: z.string().optional(),
});
