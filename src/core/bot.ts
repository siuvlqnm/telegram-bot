import { Hono } from 'hono';
import { logger } from 'hono/logger';
import * as CommandLoader from '@/core/commands';
import { Bindings } from '@/bindings';
import { globalAssigner } from '@/core/middlewares/assigner';
import { validateTelegramUpdate } from '@/core/middlewares/validator';
import { CommandRegistry } from '@/core/command-registry';

const bot = new Hono<{ Bindings: Bindings }>();
const commandRegistry = new CommandRegistry();
bot.use(logger());
// 全局中间件
bot.use(validateTelegramUpdate);
bot.use(globalAssigner);
// 注册所有命令
CommandLoader.registerCommands(commandRegistry);

// 处理 Telegram Webhook
bot.post('/t-w', async (c) => {
  const update = c.get('telegramUpdate');
  const text = update.message?.text;
  if (text) {
    const commandName = text.split(' ')[0].substring(1); // 提取命令名，去除斜杠
    const command = commandRegistry.getCommand(commandName);

    if (command) {
      return command.handler(c);
    } else {
      return c.text('Unknown command', 400);
    }
  }
  return c.text('Invalid request', 400);
});

export default bot;