import { BaseAIService } from '@/services/ai/base';
import { GoogleAIService } from '@/services/ai/google';
import { getModelByUniqueId, getProviderById } from '@/types/ai';
import { OPENROUTER_API_KEY, DEEPSEEK_API_KEY, GOOGLE_API_KEY } from '@/config';

// API 密钥配置
function getApiKey(providerId: string): string {
    let apiKey = '';
    switch (providerId) {
        case 'openrouter':
            apiKey = OPENROUTER_API_KEY();
            break;
        case 'deepseek':
            apiKey = DEEPSEEK_API_KEY();
            break;
        case 'google':
            apiKey = GOOGLE_API_KEY();
            break;
    }
    return apiKey;
}

export class AIServiceFactory {
    static getService(uniqueId: string): BaseAIService {
        const model = getModelByUniqueId(uniqueId);
        if (!model) {
            console.error('Model not found for uniqueId:', uniqueId);
            throw new Error(`Unknown model: ${uniqueId}`);
        }

        const provider = getProviderById(model.providerId);
        if (!provider) {
            console.error('Provider not found:', model.providerId);
            throw new Error(`Unknown provider: ${model.providerId}`);
        }

        // 获取 API 密钥
        const apiKey = getApiKey(model.providerId);
        if (!apiKey) {
            console.error('API key not found for provider:', model.providerId);
            throw new Error(`API key not configured for provider: ${model.providerId}`);
        }

        let service: BaseAIService;

        // 为 Google AI 创建专门的服务实例
        if (model.providerId === 'google') {
            service = new GoogleAIService({
                apiKey,
                baseURL: provider.baseURL,
                defaultHeaders: provider.defaultHeaders,
                modelId: model.modelId
            });
        } else {
            // 其他服务使用基础实现
            service = new BaseAIService({
                apiKey,
                baseURL: provider.baseURL,
                defaultHeaders: provider.defaultHeaders,
                modelId: model.modelId
            });
        }
        return service;
    }
}