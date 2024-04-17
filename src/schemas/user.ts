import { z } from "zod";

export const userCreationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  address: z.string(),
  username: z.string(),
  password: z.string(),
  role: z.enum(["user", "admin", "operator"]).default("user"),
});

export const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  role: z.enum(["user", "admin", "operator"]).optional(),
});
