import { OpenAI } from 'openai';

export async function getAiResponse(messages: any[], model: string) {
  try {
    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: '',
      // defaultHeaders: {
      //   "X-Title": "Telegram Bot", // Optional. Shows in rankings on openrouter.ai.
      // }
    });
    const completion = await openai.chat.completions.create({
       model: 'deepseek-chat',
       messages: messages,
    });

     // 检查 API 响应是否包含有效数据
    if (!completion || !completion.choices || completion.choices.length === 0) {
      throw new Error("❌ 响应为空，请稍后再试。");
    }

    // 检查响应是否包含有效内容
    if (!completion.choices[0].message.content) {
      throw new Error("❌ 响应内容为空，请稍后再试。");
    }

    return completion.choices[0].message.content;
  } catch (error) {
     console.error("❌ OpenRouter API Error:", error);
     throw error;
  }
}