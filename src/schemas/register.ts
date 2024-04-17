import { z } from "zod";

export const registerSchema = z.object({
  name: z.string(),
  username: z.string().min(3),
  email: z.string().email(),
  address: z.string(),
  password: z.string().min(8),
  confirmPass: z.string().min(8),
  remember_token: z.string().optional(),
});
