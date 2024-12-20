import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { Bindings } from '@/bindings';
import { getUserState, setUserState } from '@/contexts/user-states';
import { telegramUpdateSchema } from '@/middlewares/validation';
import { handleStart } from '@/handlers/start';
import { handleTextMessage } from '@/handlers/message';
import { initializeConfig } from '@/config';

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.post('/', zValidator('json', telegramUpdateSchema), async (c) => {
   initializeConfig(c.env);
   try {
      const update = c.req.valid('json')
      const message = update.message;

      if (!message) {
            return c.json({ message: 'Invalid Telegram Update' }, 400);
      }
      if (message?.text) {
            const chatId = message.chat.id;
            const userId = message.from.id;
            const text = message.text;
            const kv = c.env.TELEGRAM_BOT_KV;

            // **获取用户当前状态**
            const currentState = await getUserState(kv, userId);

            if (text === '/start' || text === '/cancel') {
               await setUserState(kv, userId, 'IDLE'); // 重置状态为 idle
               await handleStart(chatId);
            } else if (text === '/calc') {
               await setUserState(kv, userId, 'CALC');
               await handleTextMessage(message);
            } else {
               // **根据当前状态处理用户消息**
               if (currentState === 'CALC') {
                  // 在 AI 模式下处理用户输入
                  await handleTextMessage(message);
                  // TODO: 调用 AI 服务处理用户输入
               } else {
                  // 默认情况下处理用户输入
                  await handleTextMessage(message);
               }
            }
      }

      return c.json({ message: 'OK' }, 200);
   } catch (error) {
      console.error('Error processing update:', error);
      return c.json({ message: 'Error processing update' }, 500);
   }
});

export default app;