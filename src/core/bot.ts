import { Hono, Context } from 'hono';
import { logger } from 'hono/logger';
import * as CommandLoader from '@/core/commands';
import { Bindings } from '@/bindings';
import { globalAssigner } from '@/core/middlewares/assigner';
import { validateTelegramUpdate } from '@/core/middlewares/validator';
import { CommandRegistry } from '@/core/command-registry';
import { handleCallbackQuery } from '@/core/callback-router';
const bot = new Hono<{ Bindings: Bindings }>();
const commandRegistry = new CommandRegistry();
bot.use(logger());
// 全局中间件
bot.use(validateTelegramUpdate);
bot.use(globalAssigner);
// 注册所有命令
CommandLoader.registerCommands(commandRegistry);

// 处理 Telegram Webhook
bot.post('/', async (c: Context) => {
  const update = c.get('telegramUpdate');
  const text = update.message?.text;
  const chatId = update.message?.chat.id;
  const callbackQuery = update.callback_query;
  const userStateService = c.get('userStateService');

  if (!text || !chatId) {
    return c.text('Invalid request', 400);
  }

  if (text.startsWith('/clear')) {
    await userStateService.clearState(chatId);
    return c.text('会话状态已清除。');
  }

  if (callbackQuery) {
    return handleCallbackQuery(c);
  }

  if (text.startsWith('/')) {
    const commandName = text.substring(1).split(' ')[0];
    const command = commandRegistry.getCommand(commandName);
    if (command) {
      await userStateService.updateState(chatId, { currentIntent: commandName }); // 记录当前意图
      return command.handler(c);
    } else {
      return c.text('Unknown command', 400);
    }
  } else {
    // 处理非命令消息，尝试使用之前的意图
    const userState = await userStateService.getState(chatId);
    if (userState?.currentIntent) {
      const command = commandRegistry.getCommand(userState.currentIntent);
      if (command) {
        return command.handler(c);
      }
    }
    return c.text('请发送一个命令。', 400);
  }
});


export default bot;