// src/modules/ai.ts
import { Context } from 'hono';
import { AIProvider } from '@/services/ai/ai-provider';
import { DeepSeekProvider } from '@/services/ai/deepseek';
import { getTaskHandler } from '@/core/task-registry';

export class AIModule {
    private providers: Map<string, AIProvider> = new Map();

    constructor(c: Context) {
        this.registerProvider(new DeepSeekProvider());
        // 注册其他 Provider

        for (const provider of this.providers.values()) {
            provider.initialize(c);
        }
    }

    registerProvider(provider: AIProvider) {
        this.providers.set(provider.id, provider);
    }

    getProvider(providerId: string): AIProvider | undefined {
        return this.providers.get(providerId);
    }

    async listAvailableProviders(): Promise<{ id: string; name: string }[]> {
        return Array.from(this.providers.values()).map(provider => ({ id: provider.id, name: provider.name }));
    }

    async listModels(providerId: string): Promise<string[]> {
        const provider = this.getProvider(providerId);
        if (!provider) {
            throw new Error(`Provider '${providerId}' not found.`);
        }
        return provider.listModels();
    }

    async processUserMessage(c: Context) {
        // 1. 选择合适的 AI 提供商和模型 (可以从用户状态获取)
        const update = c.get('telegramUpdate');
        const chatId = update.message?.chat.id;
        const text = update.message?.text;
        if (!text || !chatId) {
            return;
        }
        const userStateService = c.get('userStateService');
        const userState = await userStateService.getState(chatId);
        const providerId = userState.preferredModelProvider;
        const model = userState.preferredModel;
        const provider = this.getProvider(providerId);
        if (!provider) {
            console.error(`Provider '${providerId}' not found.`);
            return;
        }

        // 2. 调用 AI 模型进行意图识别和参数提取 (使用 Function Calling 或其他方法)
        const response = await provider.generateText(text, model, {
            functions: [
                {
                    name: 'get_weather',
                    description: '获取指定地点的天气信息',
                    parameters: { type: 'object', properties: { location: { type: 'string' } }, required: ['location'] },
                },
                {
                    name: 'set_reminder',
                    description: '设置提醒',
                    parameters: { type: 'object', properties: { dateTime: { type: 'string' }, message: { type: 'string' } }, required: ['dateTime', 'message'] },
                },
                // ... 其他 function 定义
            ],
            function_call: 'auto',
        });

        const message = JSON.parse(response).choices[0]?.message;


        const telegramService = c.get('telegramService');
        if (message?.function_call) {
            const intent = message.function_call.name;
            const params = JSON.parse(message.function_call.arguments || '{}');

            const taskHandler = getTaskHandler(intent);
            if (taskHandler) {
                await taskHandler(c, params);
            } else {
                console.warn(`No task handler registered for intent: ${intent}`);
                await telegramService.sendMessage(chatId, "我不确定如何处理您的请求。");
            }
        } else {
            // 如果没有 function_call，则认为是闲聊
            const chatResponse = message.choices[0]?.message?.content;
            if (chatResponse) {
                await telegramService.sendMessage(chatId, chatResponse);
            } else {
                console.warn('未收到 AI 的聊天回复:', response);
                await telegramService.sendMessage(chatId, "抱歉，我没有理解您的意思。");
            }
        }
    }
}