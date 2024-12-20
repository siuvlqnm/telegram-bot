import { TelegramMessage } from "@/types/telegram";
import { handleCalcCommand } from "@/handlers/calc";

export async function handleTextMessage(message: TelegramMessage, currentState: string) {
   const chatId = message.chat.id;
   const text = message.text;
   if (!text) {
      return;
   }
   // console.log('startsWith:', text.startsWith("/calc"));
   // if (text.startsWith("/calc")) {
   //    await handleCalcCommand(chatId, text);
   // }

   if (currentState === 'CALC') {
      await handleCalcCommand(chatId, text);
   }
}