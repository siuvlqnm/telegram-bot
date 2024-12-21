import { sendMessage } from '@/utils/telegram';
import { AI_MODELS } from '@/types/ai';
import { setUserModel } from '@/contexts/model-states';

export async function showModelSelection(chatId: number) {
    const keyboard = {
        inline_keyboard: AI_MODELS.map(model => [{
            text: model.name,
            callback_data: `/select_${model.id}`
        }])
    };

    const message = "请选择要使用的 AI 模型：\n\n" +
        AI_MODELS.map(model => `${model.name}: ${model.description}`).join('\n');

    await sendMessage(chatId, message, keyboard);
}

// export async function selectModel(chatId: number, modelId: string) {
//     const model = AI_MODELS.find(m => m.id === modelId);
//     if (!model) {
//         await sendMessage(chatId, "无效的模型选择");
//         return;
//     }

//     await setUserModel(kv, userId, modelId);
//     await sendMessage(chatId, `已选择模型: ${model.name}\n现在可以开始对话了！`);
// }