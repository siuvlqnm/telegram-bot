import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Context, Next, MiddlewareHandler } from 'hono';
// 基础用户信息 schema
const userSchema = z.object({
    id: z.number().refine((id) => id === 1927888323, { message: '未授权用户' }), // 用户ID
    is_bot: z.boolean(), // 是否是机器人
    first_name: z.string(), // 用户名
    last_name: z.string().optional(), // 用户姓
    username: z.string().optional(), // 用户名
    language_code: z.string().optional(), // 语言代码
});

// 聊天信息 schema
const chatSchema = z.object({
    id: z.number(), // 聊天ID
    first_name: z.string(), // 聊天名
    last_name: z.string().optional(), // 聊天姓
    username: z.string().optional(), // 聊天名
    type: z.string(), // 聊天类型
});

// 消息实体 schema
const messageEntitySchema = z.object({
    offset: z.number(), // 偏移量
    length: z.number(), // 长度
    type: z.string(), // 类型
});

// 消息 schema
const messageSchema = z.object({
    message_id: z.number(), // 消息ID
    from: userSchema,
    chat: chatSchema,
    date: z.number(),
    text: z.string().optional(),
    entities: z.array(messageEntitySchema).optional(),
});

// 回调查询 schema
const callbackQuerySchema = z.object({
    id: z.string(), // 回调查询ID
    from: userSchema, // 用户信息
    message: messageSchema, // 消息信息
    data: z.string(), // 数据
    chat_instance: z.string(), // 聊天实例
});

// 完整的更新 schema
export const telegramUpdateSchema = z.object({
    update_id: z.number(), // 更新ID
    message: messageSchema.optional(),
    callback_query: callbackQuerySchema.optional(),
}).strict();

// // 验证middleware
export const validateTelegramUpdate: MiddlewareHandler = async (c: Context, next: Next) => {
    try {
        const validator = zValidator('json', telegramUpdateSchema);
        return validator(c, next);
        // await next();
    } catch (err) {
        console.error('Validation error:', err);
        return c.json({ message: 'Invalid Telegram Update' }, 400);
    }
};