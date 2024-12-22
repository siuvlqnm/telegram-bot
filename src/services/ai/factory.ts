import { BaseAIService, AIServiceConfig } from './base';
import { getModelByUniqueId, getProviderById } from '@/types/ai';
import { OPENROUTER_API_KEY, DEEPSEEK_API_KEY } from '@/config';

// API 密钥配置
const API_KEYS: Record<string, string> = {
    'openrouter': OPENROUTER_API_KEY(),
    'deepseek': DEEPSEEK_API_KEY()
};

export class AIServiceFactory {
    static getService(uniqueId: string): BaseAIService {
        // 获取模型信息
        const model = getModelByUniqueId(uniqueId);
        if (!model) {
            throw new Error(`Unknown model: ${uniqueId}`);
        }

        // 获取提供商信息
        const provider = getProviderById(model.providerId);
        if (!provider) {
            throw new Error(`Unknown provider: ${model.providerId}`);
        }

        // 获取 API 密钥
        const apiKey = API_KEYS[model.providerId];
        if (!apiKey) {
            throw new Error(`API key not found for provider: ${model.providerId}`);
        }

        // 创建并返回服务实例
        return new BaseAIService({
            apiKey,
            baseURL: provider.baseURL,
            defaultHeaders: provider.defaultHeaders,
            modelId: model.modelId
        });
    }
} 