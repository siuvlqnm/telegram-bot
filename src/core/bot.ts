import { Hono } from 'hono';
import * as Commands from './commands';
import { Bindings } from '@/bindings';
import { globalAssigner } from '@/core/middlewares/assigner';
import { logger } from '@/core/middlewares/logger';
import { validateTelegramUpdate } from '@/core/middlewares/validator';

const bot = new Hono<{ Bindings: Bindings }>();

// 全局中间件
bot.use(validateTelegramUpdate);
bot.use(logger);
bot.use(globalAssigner);

// 处理 Telegram Webhook
bot.post('/t-w', async (c) => {
  const update = c.get('telegramUpdate');
  if (update.message?.text?.startsWith('/start')) {
    const chatId = update.message.chat.id;
    return Commands.StartCommand.startCommand(c);
  }
  return c.text('Unknown command', 400);
});

// 处理 /ask 命令，带有局部验证
bot.post('/', async (c) => {
  return Commands.TmdbCommand.tmdbCommand(c);
});

export default bot;