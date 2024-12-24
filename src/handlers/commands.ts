import { clearUserContext } from '@/contexts/chat-context';
import { TELEGRAM_BOT_KV } from '@/config';
import { sendMessage } from '@/utils/telegram';
import { getUserState, setUserState } from '@/contexts/user-states';
import { handleStart } from '@/handlers/start';
import { handleTextMessage } from '@/handlers/message';
import { showPromptSelection } from '@/handlers/prompt-selection';

export async function handleCommands(message: any) {
    console.log('handleCommands');
    const chatId = message.chat.id;
    const text = message.text;

    switch (text) {
        case '/start':
        case '/cancel':
            console.log('start');
            console.log('cancel');
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'IDLE');
            await handleStart(chatId);
            return;
        case '/clear':
            console.log('clear');
            await clearUserContext(TELEGRAM_BOT_KV(), chatId);
            await sendMessage(chatId, "✨ 已清除对话历史");
            return;
        case '/model':
            console.log('model');
            await clearUserContext(TELEGRAM_BOT_KV(), chatId);
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'IDLE');
            await handleTextMessage(message, 'IDLE');
            return;
        case '/ai':
            console.log('ai');
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'AI');
            await handleTextMessage(message, 'AI');
            return;
        case '/calc':
            console.log('calc');
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'CALC');
            await handleTextMessage(message, 'CALC');
            return;
        case '/prompt':
            console.log('prompt');
            await clearUserContext(TELEGRAM_BOT_KV(), chatId);
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'IDLE');
            await showPromptSelection(chatId);
            return;
    }

    const currentState = await getUserState(TELEGRAM_BOT_KV(), chatId);
    switch (currentState) {
        case 'CALC':
            console.log('CALC');
            await handleTextMessage(message, 'CALC');
            return;
        case 'AI':
            console.log('AI');
            await handleTextMessage(message, 'AI');
            return;
        default:
            await handleStart(chatId);
            return;
    }
}