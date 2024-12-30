// const config = require('../../config');

// const telegramService = require('../services/telegram.service');
// import { Context, Next } from 'hono';

// const globalMiddleware = (ctx: Context, next: Next) => {
//   // 全局验证：检查是否来自 Telegram
//   if (ctx.req.header('content-type') !== 'application/json') {
//     return ctx.text('Bad Request', 400);
//   }

//   // 全局赋值：将 Telegram 服务挂载到上下文
//   ctx.state.telegram = telegramService;

//   return next();
// };

// export default globalMiddleware;