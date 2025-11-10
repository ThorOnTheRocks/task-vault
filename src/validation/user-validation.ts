import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  username: z.string().min(3).max(20),
  email: z.email(),
  password: z.string().min(8),
});

export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
  .object({
    name: z.string().optional(),
    username: z.string().min(3).max(20).optional(),
    email: z.email().optional(),
  })
  .partial();

export type UpdateUser = z.infer<typeof updateUserSchema>;
