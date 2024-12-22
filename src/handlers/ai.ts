import { getAiResponse } from '@/services/openrouter';
import { sendMessage } from '@/utils/telegram'
import { TELEGRAM_BOT_KV } from '@/config';
import { getUserModel } from '@/contexts/model-states';

// 简化版上下文
const userContexts = new Map<number, { role: 'user' | 'assistant', content: string }[]>();

export async function handleAiMessage(chatId: number, text: string){
    const userModel = await getUserModel(TELEGRAM_BOT_KV(), chatId);
    if (!userModel) {
        await sendMessage(chatId, "模型未设置，请先设置模型。");
        return;
    }

     // 获取用户的上下文
    let userMessages = userContexts.get(chatId) || [];
    userMessages.push({ role: 'user', content: text });

     // 限制上下文消息数量
    if (userMessages.length > 5) {
        userMessages = userMessages.slice(-5);
    }
    try {
       const aiResponse = await getAiResponse(userMessages, userModel);
       if (!aiResponse) {
            await sendMessage(chatId, "AI 助手出现了一些问题，请稍后再试。");
            return;
       }
       userMessages.push({ role: 'assistant', content: aiResponse});
       userContexts.set(chatId, userMessages);

       // 回复用户，增加markdown支持
      await sendMessage(chatId, aiResponse, { parse_mode: 'MarkdownV2' });
   } catch (error) {
      console.error("AI API Error:", error);
      await sendMessage(chatId, "AI API Error:" + error);
    }
}