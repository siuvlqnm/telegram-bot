import { OpenAI } from 'openai';
import { OPENROUTER_API_KEY } from '@/config';

export async function getAiResponse(messages: any[]) {
  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: OPENROUTER_API_KEY(),
      defaultHeaders: {
        "X-Title": "Telegram Bot", // Optional. Shows in rankings on openrouter.ai.
      }
    });
    const completion = await openai.chat.completions.create({
       model: 'google/gemini-2.0-flash-exp:free',
       messages: messages,
    });
    return completion.choices[0].message.content;
  } catch (error) {
     console.error("AI API Error:", error);
     throw error;
  }
}