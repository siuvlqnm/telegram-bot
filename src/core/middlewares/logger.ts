import { Context, Next, MiddlewareHandler } from 'hono';

export const logger: MiddlewareHandler = async (c: Context, next: Next) => {
    // 设置东八区时间
  const startTime = Date.now() + 8 * 60 * 60 * 1000;
  // 记录请求开始
  console.log(`[${new Date().toISOString()}] 👉 ${c.req.method} ${c.req.url}`);
  try {
    // 克隆请求以读取 body（因为 body 只能读取一次）
    const clonedReq = c.req.raw.clone();
    const body = await clonedReq.json().catch(() => ({}));
    console.log('📥 Request Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('⚠️ Could not parse request body');
  }
  // 记录响应
  const duration = Date.now() - startTime;
  console.log(`[${new Date().toISOString()}] ✅ Completed in ${duration}ms`);
  await next();
};