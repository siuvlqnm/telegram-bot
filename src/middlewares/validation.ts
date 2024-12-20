import {  MiddlewareHandler } from 'hono';
import { z } from 'zod';

export const telegramUpdateSchema = z.object({
    update_id: z.number(),
    message: z
       .object({
          message_id: z.number(),
          from: z.object({
             id: z.number(),
             is_bot: z.boolean(),
             first_name: z.string(),
             last_name: z.string().optional(),
             username: z.string().optional(),
             language_code: z.string().optional(),
          }),
          chat: z.object({
             id: z.number(),
             first_name: z.string(),
             last_name: z.string().optional(),
             username: z.string().optional(),
             type: z.string(),
          }),
          date: z.number(),
          text: z.string().optional(),
          entities: z
             .array(
                z.object({
                   offset: z.number(),
                   length: z.number(),
                   type: z.string(),
                }),
             )
             .optional(),
       })
       .optional(),
});

// export const validateTelegramUpdate: MiddlewareHandler = async (c, next) => {
//     try {
//         const json = await c.req.json();
//         const update = telegramUpdateSchema.safeParse(json);
        
//         if (!update.success) {
//             console.error('Invalid Telegram Update:', update.error);
//             return c.json({ message: 'Invalid Telegram Update' }, 400);
//         }
        
//         c.set('telegramUpdate', update.data);
//         await next();
//     } catch (error) {
//         return c.json({ message: 'Invalid JSON' }, 400);
//     }
// };