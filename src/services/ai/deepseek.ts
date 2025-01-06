import { OpenAI } from 'openai';
import { AIProvider } from './ai-provider';
import { Context } from 'hono';

// baseURL: https://api.deepseek.com

export class DeepSeekProvider implements AIProvider {
    id = 'deepseek';
    name = 'DeepSeek';
    private deepseek?: OpenAI;

    initialize(c: Context): void {
        this.deepseek = new OpenAI({
            apiKey: c.env.DEEPSEEK_API_KEY,
            baseURL: 'https://api.deepseek.com',
        });
    }

    async listModels(): Promise<string[]> {
        if (!this.deepseek) {
            throw new Error('OpenAI client not initialized');
        }

        const models = await this.deepseek.models.list();
        return models.data.map(model => model.id);
    }

    async generateText(prompt: string, model: string, options?: OpenAI.Chat.ChatCompletionCreateParams): Promise<string> {
        if (!this.deepseek) {
            throw new Error('DeepSeek client not initialized');
        }

        try {
            const completion = await this.deepseek.chat.completions.create({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                stream: false, // 确保不使用流式传输，获取完整的 ChatCompletion
                ...options,
            });

            if ('choices' in completion && completion.choices && completion.choices.length > 0) {
                return completion.choices[0].message?.content || '';
            } else {
                console.error('OpenAI 返回的 completion 中没有 choices 属性:', completion);
                return '';
            }
        } catch (error) {
            console.error('调用 OpenAI API 失败:', error);
            throw error;
        }
    }
}