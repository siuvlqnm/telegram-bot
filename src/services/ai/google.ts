import { BaseAIService, AIServiceConfig } from '@/services/ai/base';
import { AIMessage } from '@/types/ai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GoogleAIService extends BaseAIService {
    private genAI: GoogleGenerativeAI;

    constructor(config: AIServiceConfig) {
        super(config);
        this.genAI = new GoogleGenerativeAI(config.apiKey);
        this.modelId = config.modelId;
    }

    async getCompletion(messages: AIMessage[]): Promise<string> {
        try {
            // 创建模型实例
            const model = this.genAI.getGenerativeModel({ 
                model: this.modelId
            });

            // 转换消息格式
            const history = messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

            // 创建聊天会话
            const chat = model.startChat({
                history: history,
                generationConfig: {
                    maxOutputTokens: 2048,
                }
            });

            // 获取响应
            const result = await chat.sendMessage(messages[messages.length - 1].content);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Google AI API Error:', error);
            throw new Error(`Google AI service error: ${error.message}`);
        }
    }
} 