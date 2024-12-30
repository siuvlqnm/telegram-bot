// import { Context, Next } from 'hono';

// const localMiddleware = (ctx: Context, next: Next) => {
//     // 局部验证：检查是否是命令消息
//     if (ctx.req.body.message && ctx.req.body.message.text?.startsWith('/')) {
//       // 局部赋值：将命令挂载到上下文
//       ctx.state.command = ctx.req.body.message.text;
//     } else {
//       return ctx.text('Not a command', 200);
//     }
  
//     return next();
//   };
  
//   export default localMiddleware;