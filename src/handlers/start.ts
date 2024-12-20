import { sendMessage } from '../utils/telegram';

export async function handleStart(chatId: number) {
     await sendMessage(chatId, "你好，我是你的 Telegram Bot!\n我支持AI对话和翻译功能。");
}