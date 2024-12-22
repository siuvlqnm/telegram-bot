import { OpenAI } from 'openai';

export interface AIServiceConfig {
    apiKey: string;
    baseURL: string;
    defaultHeaders?: Record<string, string>;
    modelId: string;
}

// 基础服务类，使用 OpenAI 兼容接口
export class BaseAIService {
    protected client: OpenAI;
    protected modelId: string;

    constructor(config: AIServiceConfig) {
        this.client = new OpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseURL,
            defaultHeaders: config.defaultHeaders
        });
        this.modelId = config.modelId;
    }

    async getCompletion(messages: any[]): Promise<string> {
        try {
            const completion = await this.client.chat.completions.create({
                model: this.modelId,
                messages: messages
            });
            return completion.choices[0].message.content || '';
        } catch (error) {
            console.error('AI API Error:', error);
            throw new Error(`AI service error: error`);
        }
    }
} 