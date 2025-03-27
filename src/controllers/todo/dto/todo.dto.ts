import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1).max(255),
});

export type CreateTodoDto = z.infer<typeof createTodoSchema>;