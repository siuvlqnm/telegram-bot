import { sendMessage } from '@/utils/telegram';
import { AI_MODELS } from '@/types/ai';

export async function showModelSelection(chatId: number) {
    const keyboard = {
        inline_keyboard: AI_MODELS.map(model => [{
            text: model.name,
            callback_data: `/select_${model.id}`
        }])
    };

    const message = "🤖 请选择要使用的 AI 模型：\n\n" +
        AI_MODELS.map(model => `${model.name}: ${model.description}`).join('\n');

    await sendMessage(chatId, message, keyboard);
}