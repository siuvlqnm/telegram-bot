import { sendMessage, deleteMessage } from '@/utils/telegram';
import { PROMPTS, getPromptById } from '@/types/ai';
import { setUserPrompt } from '@/contexts/prompt-states';
import { setUserState } from '@/contexts/user-states';
import { TELEGRAM_BOT_KV } from '@/config';
import { clearUserContext } from '@/contexts/chat-context';

// 显示提示词选择界面
export async function showPromptSelection(chatId: number) {
    const keyboard = {
        inline_keyboard: PROMPTS.map(prompt => [{
            text: prompt.name,
            callback_data: `/prompt_${prompt.id}`
        }])
    };

    const message = "💡 请选择对话提示词：\n\n" +
        PROMPTS.map(prompt => `${prompt.name}: ${prompt.description}`).join('\n');

    await sendMessage(chatId, message, keyboard);
}

// 处理提示词选择
export async function handlePromptSelection(chatId: number, userId: number, messageId: number, promptId: string, kv: KVNamespace) {
    const selectedPrompt = getPromptById(promptId);
    
    if (!selectedPrompt) {
        await sendMessage(chatId, '❌ 无效的提示词选择');
        return;
    }

    try {
        await setUserPrompt(kv, userId, promptId);
        await clearUserContext(kv, chatId); // 清除之前的对话上下文
        await handlePromptSelectionDirect(chatId, messageId, selectedPrompt);
    } catch (error) {
        console.error('Error in prompt selection:', error);
        await sendMessage(chatId, '❌ 设置提示词时出现错误，请稍后重试。');
    }
}

// 直接选择确认
async function handlePromptSelectionDirect(chatId: number, messageId: number, prompt: typeof PROMPTS[0]) {
    await sendMessage(
        chatId,
        `✅ 已选择 ${prompt.name}\n${prompt.description}\n\n请开始对话`
    );
    await setUserState(TELEGRAM_BOT_KV(), chatId, 'AI');
    await deleteMessage(chatId, messageId);
} 