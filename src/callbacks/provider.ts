import { Context } from 'hono';

export const handleProviderCallback = async (c: Context) => {
    const callbackQuery = c.get('telegramUpdate').callback_query;
    const data = callbackQuery?.data; // 假设 callback_data 包含类似 "movie_details:123" 的信息
    const chatId = callbackQuery?.message?.chat.id;
    const messageId = callbackQuery?.message?.message_id;
    const [_, providerId] = data?.split(':') || [];
    const userStateService = c.get('userStateService');
    const telegramService = c.get('telegramService');
    await userStateService.updateState(chatId, { preferredModelProvider: providerId, preferredModel: undefined });
    await telegramService.editMessageText(chatId, messageId, `🤖 已选择提供商: ${providerId}。请使用 /setmodel 选择模型。`);
    return c.text('🤖 已选择提供商');
};
