import { Context, Next, MiddlewareHandler } from 'hono';

// 全局中间件
export const globalMiddleware: MiddlewareHandler = async (c: Context, next: Next) => {
    try {
        const json = await c.req.json();
        c.set('telegramUpdate', json);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return c.text('Bad Request', 400);
    }
    return next();
};