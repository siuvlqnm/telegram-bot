import { clearUserContext } from '@/contexts/chat-context';
import { TELEGRAM_BOT_KV } from '@/config';
import { sendMessage } from '@/utils/telegram';
import { getUserState, setUserState } from '@/contexts/user-states';
import { handleStart } from '@/handlers/start';
import { handleTextMessage } from '@/handlers/message';

export async function handleCommands(message: any) {
    const chatId = message.chat.id;
    const text = message.text;

    switch (text) {
        case '/start':
        case '/cancel':
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'IDLE');
            await handleStart(chatId);
            break;
        case '/clear':
            await clearUserContext(TELEGRAM_BOT_KV(), chatId);
            await sendMessage(chatId, "✨ 已清除对话历史");
            break;
        case '/model':
            // 切换模型时清除上下文
            await clearUserContext(TELEGRAM_BOT_KV(), chatId);
            // ... 原有的模型选择逻辑 ...
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'IDLE');
            await handleTextMessage(message, 'IDLE');
            break;
        case '/ai':
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'AI');
            await handleTextMessage(message, 'AI');
            break;
        case '/calc':
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'CALC');
            await handleTextMessage(message, 'CALC');
            break;
    }

    // 获取用户当前状态
    const currentState = await getUserState(TELEGRAM_BOT_KV(), chatId);
    // 根据当前状态处理用户消息
    switch (currentState) {
        case 'CALC':
            await handleTextMessage(message, 'CALC');
            break;
        case 'AI':
            await handleTextMessage(message, 'AI');
            break;
        default:
            await handleStart(chatId);
            break;
    }
}