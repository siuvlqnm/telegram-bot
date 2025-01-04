import { Context, Next, MiddlewareHandler } from 'hono';

export const logger: MiddlewareHandler = async (c: Context, next: Next) => {
  // 时区为东八区
  const timezoneOffset = 8 * 60 * 60 * 1000;
  const startTime = Date.now() + timezoneOffset;
  
  // 记录请求开始
  console.log(`[${new Date(startTime).toISOString()}] 👉 ${c.req.method} ${c.req.url}`);
  
  try {
    // 克隆请求以读取 body（因为 body 只能读取一次）
    const clonedReq = c.req.raw.clone();
    const body = await clonedReq.json().catch(() => ({}));
    console.log('📥 Request Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('⚠️ Could not parse request body');
  }

  // 拦截响应方法
  const originalMethods = {
    text: c.text.bind(c),
    json: c.json.bind(c)
  };

  // 重写响应方法
  c.text = function(text: string, ...args: any[]) {
    console.log('📤 Response:', { text, args });
    return originalMethods.text(text, ...args);
  };

  c.json = function(json: any, ...args: any[]) {
    console.log('📤 Response:', { json, args });
    return originalMethods.json(json, ...args);
  };

  // 执行后续中间件
  await next();

  // 记录响应时间
  const endTime = Date.now() + timezoneOffset;
  const duration = endTime - startTime;
  console.log(`[${new Date(startTime).toISOString()}] ✅ Completed in ${duration}ms`);
};