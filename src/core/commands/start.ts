import { Context } from 'hono';

export const startCommand = async (c: Context) => {
  const chatId = c.get('telegramUpdate').message?.chat.id;
  const telegramService = c.get('telegramService');
  await telegramService.sendMessage(chatId, 'Welcome! Chat ID: ' + chatId);
  return c.json({ message: 'Welcome! Chat ID: ' + chatId }, 200);
};
