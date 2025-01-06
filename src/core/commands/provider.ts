import { Context } from 'hono';

export const startProviderCommand = async (c: Context) => {
    const aiModule = c.get('aiModule');
    const telegramService = c.get('telegramService');
    const chatId = c.get('telegramUpdate').message?.chat.id;
    const availableProviders = await aiModule.listAvailableProviders();
    const keyboard = availableProviders.map((provider: { id: string; name: string }) => [
        { text: provider.name, callback_data: `set_provider:${provider.id}` },
    ]);
    await telegramService.sendMessage(chatId, '🤖 请选择AI提供商:', {
        reply_markup: { inline_keyboard: keyboard },
    });
    return c.text('🤖 选择AI提供商');
};
