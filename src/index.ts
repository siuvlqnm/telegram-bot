import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { Bindings } from '@/bindings';
import { telegramUpdateSchema } from '@/middlewares/validation';
import { initializeConfig } from '@/config';
import { handleCallbackQuery } from '@/handlers/callback';
import { handleCommands } from '@/handlers/commands';

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.post('/', zValidator('json', telegramUpdateSchema), async (c) => {
   initializeConfig(c.env);
   try {

      console.log('index.ts');
      console.log('Received webhook:', await c.req.json());

      const update = c.req.valid('json');
      const message = update.message;
      const callback_query = update.callback_query;

      if (callback_query) {
         await handleCallbackQuery(callback_query, c.env.TELEGRAM_BOT_KV);
         return c.json({ message: 'OK' }, 200);
      }
      if (!message) {
         return c.json({ message: 'Invalid Telegram Update' }, 400);
      }
      if (message?.text) {
         await handleCommands(message);
      }
      return c.json({ message: 'OK' }, 200);
   } catch (error) {
      console.error('Error processing update:', error);
      return c.json({ message: 'Error processing update' }, 500);
   }
});

export default app;