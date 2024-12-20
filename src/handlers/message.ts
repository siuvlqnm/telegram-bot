import { TelegramMessage } from "@/types/telegram";
import { handleCalcCommand } from "@/handlers/calc";

export async function handleTextMessage(message: TelegramMessage) {
   const chatId = message.chat.id;
   const text = message.text;

   if (!text) {
      return;
   }
   if (text.startsWith("/calc")) {
      await handleCalcCommand(chatId, text);
   }
}