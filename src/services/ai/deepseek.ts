import { OpenAI } from 'openai';
import { AIProvider, AIResponse } from './ai-provider';
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

    async generateText(messages: any[], model: string, options?: OpenAI.Chat.ChatCompletionCreateParams): Promise<AIResponse> {
        if (!this.deepseek) {
            throw new Error('DeepSeek client not initialized');
        }

        try {
            const completion = await this.deepseek.chat.completions.create({
                model: model,
                messages: messages,
                stream: false,
                max_tokens: 1024,
                temperature: 0.7,
                ...options,
            });

            if ('choices' in completion && completion.choices && completion.choices.length > 0) {
                const choice = completion.choices[0];
                
                // 如果存在 function_call，返回函数调用结果
                if (choice.message?.tool_calls) {
                    return {
                        type: 'tool_calls',
                        content: {
                            name: choice.message.tool_calls[0].function.name,
                            arguments: JSON.parse(choice.message.tool_calls[0].function.arguments || '{}')
                        },
                        tool_call_id: choice.message.tool_calls[0].id
                    };
                }
                
                // 否则返回普通文本
                return {
                    type: 'text',
                    content: choice.message?.content || ''
                };
            } else {
                console.error('DeepSeek 返回的 completion 中没有 choices 属性:', completion);
                return {
                    type: 'text',
                    content: ''
                };
            }
        } catch (error) {
            console.error('调用 DeepSeek API 失败:', error);
            throw error;
        }
    }
}