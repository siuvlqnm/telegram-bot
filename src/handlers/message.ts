import { TelegramMessage } from "@/types/telegram";
import { handleCalcCommand } from "@/handlers/calc";
import { sendMessage } from '@/utils/telegram';
import { handleAiMessage } from "@/handlers/ai";
import { showModelSelection } from "@/handlers/model";

export async function handleTextMessage(message: TelegramMessage, currentState: string) {
   const chatId = message.chat.id;
   const text = message.text;
   if (!text) {
      return;
   }

   if (text.startsWith("/calc")) {
      await sendMessage(chatId, "🧮 请提供一个要计算的算式");
      return;
   }
   if (text.startsWith("/ai")) {
      await sendMessage(chatId, "🤖 请输入要问的问题");
      return;
   }
   if (text.startsWith("/model")) {
      await showModelSelection(chatId);
      return;
   }

   if (currentState === 'CALC') {
      await handleCalcCommand(chatId, text);
   }
   if (currentState === 'AI') {
      await handleAiMessage(chatId, text);
   }
}