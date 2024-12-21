import { z } from 'zod';

// 基础用户信息 schema
const userSchema = z.object({
    id: z.number(),
    is_bot: z.boolean(),
    first_name: z.string(),
    last_name: z.string().optional(),
    username: z.string().optional(),
    language_code: z.string().optional(),
});

// 聊天信息 schema
const chatSchema = z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string().optional(),
    username: z.string().optional(),
    type: z.string(),
});

// 消息实体 schema
const messageEntitySchema = z.object({
    offset: z.number(),
    length: z.number(),
    type: z.string(),
});

// 消息 schema
const messageSchema = z.object({
    message_id: z.number(),
    from: userSchema,
    chat: chatSchema,
    date: z.number(),
    text: z.string().optional(),
    entities: z.array(messageEntitySchema).optional(),
});

// 回调查询 schema
const callbackQuerySchema = z.object({
    id: z.string(),
    from: userSchema,
    message: messageSchema,
    data: z.string(),
    chat_instance: z.string(),
});

// 完整的更新 schema
export const telegramUpdateSchema = z.object({
    update_id: z.number(),
    message: messageSchema.optional(),
    callback_query: callbackQuerySchema.optional(),
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