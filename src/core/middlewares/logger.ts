import { Context, Next, MiddlewareHandler } from 'hono';

export const logger: MiddlewareHandler = async (c: Context, next: Next) => {
    const start = Date.now();
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url} - ${duration}ms`);
    await next();
};