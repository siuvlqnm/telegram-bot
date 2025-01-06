import { Hono, Context } from 'hono';
// import { logger } from 'hono/logger';
import * as CommandLoader from '@/core/commands';
import { Bindings } from '@/bindings';
import { globalAssigner } from '@/core/middlewares/assigner';
import { validateTelegramUpdate } from '@/core/middlewares/validator';
import { CommandRegistry } from '@/core/command-registry';
import { handleCallbackQuery } from '@/core/callback-router';
import { logger } from '@/core/middlewares/logger';
const bot = new Hono<{ Bindings: Bindings }>();
const commandRegistry = new CommandRegistry();
// bot.use(logger());
// 全局中间件
bot.use(logger);

bot.use(validateTelegramUpdate);
bot.use(globalAssigner);
// 注册所有命令
CommandLoader.registerCommands(commandRegistry);

bot.post('/', async (c: Context) => {
  const body = await c.req.json();
  const messageText = body.message?.text;
  const chatId = body.message?.chat.id;
  const userId = body.message?.from.id;

  if (messageText === '/setprovider') {
      const aiModule = c.get('aiModule');
      const availableProviders = await aiModule.listAvailableProviders();
      const keyboard = availableProviders.map((provider: { id: string; name: string }) => [
          { text: provider.name, callback_data: `set_provider:${provider.id}` },
      ]);
      console.log(keyboard);
      return c.json({ ok: true });
      await c.env.telegramService.sendMessage(chatId, '请选择 AI 提供商:', {
          reply_markup: { inline_keyboard: keyboard },
      });
  } else if (messageText === '/setmodel') {
      const userState = await c.get('userStateService')
      // const providerId = userState.preferredModelProvider;
      // if (!providerId) {
      //     await c.env.telegramService.sendMessage(chatId, '请先选择 AI 提供商，使用 /setprovider');
      //     return c.json({ ok: true });
      // }
      const aiModule = c.get('aiModule');
      const models = await aiModule.listModels('deepseek');
      const keyboard = models.map((model: string) => [
          { text: model, callback_data: `set_model:${model}` },
      ]);
      console.log(keyboard);
      return c.json({ ok: true });
      await c.env.telegramService.sendMessage(chatId, '请选择模型:', {
          reply_markup: { inline_keyboard: keyboard },
      });
  }

  if (messageText) {
      const aiModule = c.get('aiModule');
      await aiModule.processUserMessage(c);
  }

});

// 处理 Callback 查询
bot.post('/', async (c: Context) => {
  const body = await c.req.json();
  const callbackQuery = body.callback_query;

  if (callbackQuery) {
      const data = callbackQuery.data;
      const messageId = callbackQuery.message.message_id;
      const chatId = callbackQuery.message.chat.id;
      const userId = callbackQuery.from.id;
      const userStateService = c.get('userStateService');

      if (data.startsWith('set_provider:')) {
          const providerId = data.split(':')[1];
          await userStateService.updateState(userId, { preferredModelProvider: providerId, preferredModel: undefined });
          await c.env.telegramService.editMessageText(chatId, messageId, `已选择提供商: ${providerId}。请使用 /setmodel 选择模型。`);
      } else if (data.startsWith('set_model:')) {
          const model = data.split(':')[1];
          await c.env.userStateService.updateState(userId, { preferredModel: model });
          await c.env.telegramService.editMessageText(chatId, messageId, `已选择模型: ${model}。`);
      }
  }
  return c.json({ ok: true });
});

// 处理 Telegram Webhook
// bot.post('/', async (c: Context) => {
//   const update = c.get('telegramUpdate');
//   const callbackQuery = update.callback_query;

//   if (callbackQuery) {
//     return handleCallbackQuery(c);
//   }
  
//   const text = update.message?.text;
//   const chatId = update.message?.chat.id;
//   const userStateService = c.get('userStateService');
//   const telegramService = c.get('telegramService');

//   if (!text || !chatId) {
//     await telegramService.sendMessage(chatId, '🚫 无效请求');
//     return c.text('🚫 无效请求');
//   }

//   if (text.startsWith('/clear')) {
//     await userStateService.clearState(chatId);
//     await telegramService.sendMessage(chatId, '🧹 会话状态已清除。');
//     return c.text('🧹 会话状态已清除。');
//   }

//   if (text.startsWith('/')) {
//     const commandName = text.substring(1).split(' ')[0];
//     const command = commandRegistry.getCommand(commandName);
//     if (command) {
//       await userStateService.updateState(chatId, { currentIntent: commandName }); // 记录当前意图
//       return command.handler(c);
//     } else {
//       await telegramService.sendMessage(chatId, '🚫 未知命令');
//       return c.text('🚫 未知命令');
//     }
//   } else {
//     // 处理非命令消息，尝试使用之前的意图
//     const userState = await userStateService.getState(chatId);
//     if (userState?.currentIntent) {
//       const command = commandRegistry.getCommand(userState.currentIntent);
//       if (command) {
//         return command.handler(c);
//       }
//     }

//     await telegramService.sendMessage(chatId, '🚫 请发送一个命令。');
//     return c.text('🚫 请发送一个命令。');
//   }
// });

export default bot;