import { TelegramCallbackQuery } from '@/types/telegram';
import { showProviderModels, handleModelSelection, showProviderSelection } from '@/handlers/model-selection';
import { sendMessage, deleteMessage } from '@/utils/telegram';
import { handlePromptSelection } from '@/handlers/prompt-selection';
import { handleTMDBCallback } from '@/handlers/tmdb';

export async function handleCallbackQuery(callback_query: TelegramCallbackQuery, kv: KVNamespace) {
    const chatId = callback_query.message.chat.id;
    const messageId = callback_query.message.message_id;
    const userId = callback_query.from.id;
    const data = callback_query.data;

    try {
        // 处理提供商选择
        if (data.startsWith('/provider_')) {
            const providerId = data.split('_')[1];
            await showProviderModels(chatId, providerId);
            return;
        }

        // 处理模型选择
        if (data.startsWith('/select_')) {
            const uniqueId = data.split('/select_')[1];
            await handleModelSelection(chatId, userId, messageId, uniqueId, kv);
            return;
        }

        // 处理提示词选择
        if (data.startsWith('/prompt_')) {
            const promptId = data.split('/prompt_')[1];
            await handlePromptSelection(chatId, userId, messageId, promptId, kv);
            return;
        }

        // 处理TMDB搜索结果
        if (data.startsWith('/tmdb:')) {
            await handleTMDBCallback(callback_query);
            return;
        }

    } catch (error) {
        console.error('Error handling callback query:', error);
        await sendMessage(
            chatId, 
            '❌ 处理请求时出现错误，请稍后重试。'
        );
    }
}