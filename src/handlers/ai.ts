import { getAiResponse } from '@/services/openrouter';
import { sendMessage } from '@/utils/telegram';

// 简化版上下文
const userContexts = new Map<number, { role: 'user' | 'assistant', content: string }[]>();

export async function handleAiMessage(chatId: number, text: string){
     // 获取用户的上下文
    let userMessages = userContexts.get(chatId) || [];
    userMessages.push({ role: 'user', content: text });

     // 限制上下文消息数量
    if (userMessages.length > 5) {
        userMessages = userMessages.slice(-5);
    }
    try {
       const aiResponse = await getAiResponse(userMessages);
       if (!aiResponse) {
            await sendMessage(chatId, "AI 助手出现了一些问题，请稍后再试。");
            return;
       }
       userMessages.push({ role: 'assistant', content: aiResponse});
       userContexts.set(chatId, userMessages);

       // 回复用户
      await sendMessage(chatId, aiResponse);
   } catch (error) {
      console.error("AI API Error:", error);
      await sendMessage(chatId, "AI API Error:" + error);
    }
}