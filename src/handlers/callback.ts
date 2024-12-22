import { TelegramCallbackQuery } from '@/types/telegram';
import { setUserModel } from '@/contexts/model-states';
import { sendMessage } from '@/utils/telegram';
import { AI_MODELS } from '@/types/ai';
import { setUserState } from '@/contexts/user-states';

export async function handleCallbackQuery(callback_query: TelegramCallbackQuery, kv: KVNamespace) {
    const chatId = callback_query.message.chat.id;
    const userId = callback_query.from.id;
    const data = callback_query.data;

    try {
        if (data.startsWith('/select_')) {
            await handleModelSelection(chatId, userId, data, kv);
        }
        // 未来可以在这里添加其他类型的回调处理
    } catch (error) {
        console.error('Error handling callback query:', error);
        await sendMessage(chatId, '处理请求时出现错误，请稍后重试。');
    }
}

async function handleModelSelection(chatId: number, userId: number, data: string, kv: KVNamespace) {
    const modelId = data.split('_')[1];
    
    // 验证模型是否有效
    const selectedModel = AI_MODELS.find(model => model.id === modelId);
    if (!selectedModel) {
        await sendMessage(chatId, '无效的模型选择');
        return;
    }

    try {
        await setUserModel(kv, userId, modelId);
        await sendMessage(
            chatId, 
            `模型已切换为: ${selectedModel.name}\n${selectedModel.description}, 请开始对话。`
        );
        await setUserState(kv, userId, 'AI');
    } catch (error) {
        console.error('Error setting user model:', error);
        await sendMessage(chatId, '保存模型选择时出现错误，请稍后重试。');
    }
} 