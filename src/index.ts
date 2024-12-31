import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from '@/bindings';
import { handleCallbackQuery } from '@/handlers/callback';
import { handleCommands } from '@/handlers/commands';
import { validateTelegramUpdate } from '@/middlewares/validation';
import { globalMiddleware } from '@/middlewares/global.middleware';

const bot = new Hono<{ Bindings: Bindings }>();
bot.use('/*', cors());

bot.use(validateTelegramUpdate);
bot.use(globalMiddleware);

bot.post('/', async (c) => {
   try {
      const update = c.get('telegramUpdate');
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

export default bot;