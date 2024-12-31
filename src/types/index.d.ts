import { Context } from 'hono';
import { telegramUpdateSchema } from '@/middlewares/validation';
import { z } from 'zod';

declare module 'hono' {
  interface ContextVariableMap {
    telegramUpdate: z.infer<typeof telegramUpdateSchema>;
  }
}