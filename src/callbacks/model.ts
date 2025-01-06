import { Context } from 'hono';

export const handleModelCallback = async (c: Context) => {
    const callbackQuery = c.get('telegramUpdate').callback_query;
    const data = callbackQuery?.data; // 假设 callback_data 包含类似 "movie_details:123" 的信息
    const chatId = callbackQuery?.message?.chat.id;
    const messageId = callbackQuery?.message?.message_id;
    const [_, modelId] = data?.split(':') || [];
    const userStateService = c.get('userStateService');
    const telegramService = c.get('telegramService');
    await userStateService.updateState(chatId, { preferredModel: modelId });
    await telegramService.editMessageText(chatId, messageId, `🤖 已选择模型: ${modelId}。`);
    return c.text('🤖 已选择模型');
};

