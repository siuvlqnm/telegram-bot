import { clearUserContext } from '@/contexts/chat-context';
import { TELEGRAM_BOT_KV } from '@/config';
import { sendMessage } from '@/utils/telegram';
import { getUserState, setUserState } from '@/contexts/user-states';
import { handleStart } from '@/handlers/start';
import { handleTextMessage } from '@/handlers/message';
import { showPromptSelection } from '@/handlers/prompt-selection';
import { setUserPrompt } from '@/contexts/prompt-states';
import { handleTMDBCommand } from '@/handlers/tmdb';

export async function handleCommands(message: any) {
    const chatId = message.chat.id;
    const text = message.text;

    if (text.startsWith('/tmdb ')) {
        const query = text.substring(6).trim();
        await handleTMDBCommand(chatId, query);
        return;
    }

    switch (text) {
        case '/start':
        case '/cancel':
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'IDLE');
            await handleStart(chatId);
            return;
        case '/clear':
            await clearUserContext(TELEGRAM_BOT_KV(), chatId);
            await setUserPrompt(TELEGRAM_BOT_KV(), chatId, 'default');
            await sendMessage(chatId, "✨ 已清除对话历史");
            return;
        case '/model':
            await clearUserContext(TELEGRAM_BOT_KV(), chatId);
            await setUserPrompt(TELEGRAM_BOT_KV(), chatId, 'default');
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'IDLE');
            await handleTextMessage(message, 'IDLE');
            return;
        case '/ai':
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'AI');
            await handleTextMessage(message, 'AI');
            return;
        case '/calc':
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'CALC');
            await handleTextMessage(message, 'CALC');
            return;
        case '/prompt':
            await clearUserContext(TELEGRAM_BOT_KV(), chatId);
            await setUserState(TELEGRAM_BOT_KV(), chatId, 'IDLE');
            await showPromptSelection(chatId);
            return;
        case '/tmdb':
            await sendMessage(chatId, '请输入要搜索的电影名称，例如：/tmdb 泰坦尼克号');
            return;
    }

    const currentState = await getUserState(TELEGRAM_BOT_KV(), chatId);
    switch (currentState) {
        case 'CALC':
            await handleTextMessage(message, 'CALC');
            return;
        case 'AI':
            await handleTextMessage(message, 'AI');
            return;
        default:
            await handleStart(chatId);
            return;
    }
}