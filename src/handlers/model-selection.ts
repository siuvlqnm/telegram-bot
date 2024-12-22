import { sendMessage, deleteMessage } from '@/utils/telegram';
import { AI_MODELS, AI_PROVIDERS, AIModel, getProviderById } from '@/types/ai';
import { setUserModel } from '@/contexts/model-states';
import { setUserState } from '@/contexts/user-states';
import { TELEGRAM_BOT_KV } from '@/config';
// 显示提供商选择界面
export async function showProviderSelection(chatId: number) {
    const keyboard = {
        inline_keyboard: Object.values(AI_PROVIDERS).map(provider => [{
            text: provider.name,
            callback_data: `/provider_${provider.id}`
        }])
    };

    const message = "🤖 请选择 AI 模型提供商：\n\n" +
        Object.values(AI_PROVIDERS)
            .map(provider => `${provider.name}: ${provider.description}`)
            .join('\n');

    await sendMessage(chatId, message, keyboard);
}

// 显示特定提供商的模型选择界面
export async function showProviderModels(chatId: number, providerId: string) {
    const provider = getProviderById(providerId);
    if (!provider) {
        await sendMessage(chatId, '❌ 无效的提供商选择');
        return;
    }

    const providerModels = AI_MODELS.filter(model => model.providerId === providerId);
    if (providerModels.length === 0) {
        await sendMessage(chatId, '❌ 该提供商暂无可用模型');
        return;
    }

    const keyboard = {
        inline_keyboard: providerModels.map(model => [{
            text: model.name,
            callback_data: `/select_${model.uniqueId}`
        }])
    };

    const message = `🤖 ${provider.name} 可用模型：\n\n` +
        providerModels.map(model => `${model.name}: ${model.description}`).join('\n');

    await sendMessage(chatId, message, keyboard);
}

// 处理模型选择
export async function handleModelSelection(chatId: number, userId: number, messageId: number, uniqueId: string, kv: KVNamespace) {
    const selectedModel = AI_MODELS.find(model => model.uniqueId === uniqueId);
    
    if (!selectedModel) {
        await sendMessage(chatId, '❌ 无效的模型选择');
        return;
    }

    try {
        await setUserModel(kv, userId, uniqueId);
        await handleModelSelectionDirect(chatId, messageId, selectedModel);
    } catch (error) {
        console.error('Error in model selection:', error);
        await sendMessage(chatId, '❌ 设置模型时出现错误，请稍后重试。');
    }
}

// 直接选择确认
async function handleModelSelectionDirect(chatId: number, messageId: number, model: AIModel) {
    const provider = getProviderById(model.providerId);
    await sendMessage(
        chatId,
        `✅ 已选择 ${provider?.name} 的 ${model.name}\n${model.description} \n\n 请开始对话`
    );
    await setUserState(TELEGRAM_BOT_KV(), chatId, 'AI');
    await deleteMessage(chatId, messageId);
} 