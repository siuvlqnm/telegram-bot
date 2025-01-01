import { Context } from 'hono';

export const startCommand = async (c: Context) => {
  const chatId = c.get('telegramUpdate').message?.chat.id;
  return c.json({ message: 'Welcome! Chat ID: ' + chatId }, 200);
};
