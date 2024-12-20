import { fetchApi } from "@/utils/api";
import { TELEGRAM_BOT_TOKEN } from '@/config';

export async function sendMessage(chatId: number, text: string, reply_markup?: any) {
  const botToken = TELEGRAM_BOT_TOKEN();
  if (!botToken) {
      console.error('Telegram Bot token not found in environment variables.');
      return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = {
    chatId,
    text,
    reply_markup,
  };
  try{
    await fetchApi(url, {
      method: 'POST',
      headers: {
            'Content-Type': 'application/json',
          },
      body: JSON.stringify(payload)
      });
  } catch(error){
    console.error(`Error sending message to chat ${chatId}:`, error);
  }
}