import { BaseAIService, AIServiceConfig } from './base';

// 为特殊服务商创建专门的实现
export class SpecialProviderService extends BaseAIService {
    constructor(config: AIServiceConfig) {
        super(config);
    }

    // 重写需要特殊处理的方法
    async getCompletion(messages: Array<{ role: string; content: string }>): Promise<string> {
        // 特殊处理逻辑
        return super.getCompletion(messages);
    }
} 