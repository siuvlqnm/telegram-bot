import { Context } from 'hono';

export const startModelCommand = async (c: Context) => {
    const userState = await c.get('userStateService')
    const providerId = userState.preferredModelProvider;
    const telegramService = c.get('telegramService');
    const chatId = c.get('telegramUpdate').message?.chat.id;
    if (!providerId) {
        await telegramService.sendMessage(chatId, '🤖 请先选择AI提供商，使用 /setprovider');
        return c.text('🤖 请先选择AI提供商');
    }
      const aiModule = c.get('aiModule');
      const models = await aiModule.listModels(providerId);
      const keyboard = models.map((model: string) => [
          { text: model, callback_data: `set_model:${model}` },
      ]);
      await telegramService.sendMessage(chatId, '🤖 请选择模型:', {
          reply_markup: { inline_keyboard: keyboard },
      });
      return c.text('🤖 选择模型');
};
