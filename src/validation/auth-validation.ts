import { email, z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string(),
  username: z.string().min(3).max(20),
  email: z.email(),
  password: z.string().min(8),
});

export type RegisterUser = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type LoginUser = z.infer<typeof loginUserSchema>;
