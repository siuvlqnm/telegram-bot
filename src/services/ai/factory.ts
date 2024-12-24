import { BaseAIService } from '@/services/ai/base';
import { GoogleAIService } from '@/services/ai/google';
import { getModelByUniqueId, getProviderById } from '@/types/ai';
import { OPENROUTER_API_KEY, DEEPSEEK_API_KEY, GOOGLE_API_KEY } from '@/config';

// API 密钥配置
function getApiKey(providerId: string): string {
    console.log('Getting API key for provider:', providerId);
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
    
    console.log('API key found:', apiKey ? '✅ Yes' : '❌ No');
    return apiKey;
}

export class AIServiceFactory {
    static getService(uniqueId: string): BaseAIService {
        console.log('=== Start AIServiceFactory.getService ===');
        console.log('Requested model uniqueId:', uniqueId);

        // 获取模型信息
        console.log('Fetching model details...');
        const model = getModelByUniqueId(uniqueId);
        console.log('Model found:', model ? '✅' : '❌');
        if (!model) {
            console.error('Model not found for uniqueId:', uniqueId);
            throw new Error(`Unknown model: ${uniqueId}`);
        }
        console.log('Model details:', {
            providerId: model.providerId,
            modelId: model.modelId,
            name: model.name
        });

        // 获取提供商信息
        console.log('Fetching provider details...');
        const provider = getProviderById(model.providerId);
        console.log('Provider found:', provider ? '✅' : '❌');
        if (!provider) {
            console.error('Provider not found:', model.providerId);
            throw new Error(`Unknown provider: ${model.providerId}`);
        }
        console.log('Provider details:', {
            id: provider.id,
            name: provider.name,
            baseURL: provider.baseURL
        });

        // 获取 API 密钥
        console.log('Getting API key...');
        const apiKey = getApiKey(model.providerId);
        if (!apiKey) {
            console.error('API key not found for provider:', model.providerId);
            throw new Error(`API key not configured for provider: ${model.providerId}`);
        }
        console.log('API key validation:', apiKey ? '✅ Valid' : '❌ Invalid');

        let service: BaseAIService;

        // 为 Google AI 创建专门的服务实例
        if (model.providerId === 'google') {
            console.log('Creating Google AI service instance...');
            service = new GoogleAIService({
                apiKey,
                baseURL: provider.baseURL,
                defaultHeaders: provider.defaultHeaders,
                modelId: model.modelId
            });
        } else {
            // 其他服务使用基础实现
            console.log('Creating base AI service instance...');
            service = new BaseAIService({
                apiKey,
                baseURL: provider.baseURL,
                defaultHeaders: provider.defaultHeaders,
                modelId: model.modelId
            });
        }

        console.log('Service instance created successfully');
        console.log('=== End AIServiceFactory.getService ===');
        return service;
    }
}