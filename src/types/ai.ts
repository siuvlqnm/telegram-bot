// 模型提供商类型
export type AIProvider = {
    id: string;
    name: string;
    description: string;
    baseURL: string;
    defaultHeaders?: Record<string, string>;
};

// AI 模型的基本类型定义
export type AIModel = {
    providerId: string;
    modelId: string;
    uniqueId: string;
    name: string;
    description: string;
};

// 可用的 AI 提供商列表
export const AI_PROVIDERS: Record<string, AIProvider> = {
    'openrouter': {
        id: 'openrouter',
        name: 'OpenRouter',
        description: '多模型聚合服务',
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
            'X-Title': 'Telegram Bot'
        }
    },
    'deepseek': {
        id: 'deepseek',
        name: 'DeepSeek',
        description: '深度求索（DeepSeek）公司开发的 AI 模型',
        baseURL: 'https://api.deepseek.com',
    },
    'google': {
        id: 'google',
        name: 'Gemini',
        description: '谷歌的 AI 模型',
        baseURL: 'https://generativelanguage.googleapis.com',
    }
};

// 可用的 AI 模型列表
export const AI_MODELS: AIModel[] = [
    {
        providerId: 'openrouter',
        modelId: 'google/gemini-2.0-flash-exp:free',
        uniqueId: 'openrouter:google/gemini-2.0-flash-exp:free',
        name: 'Gemini 2.0 Flash',
        description: '谷歌最新的 AI 模型'
    },
    {
        providerId: 'openrouter',
        modelId: 'google/gemini-2.0-flash-thinking-exp:free',
        uniqueId: 'openrouter:google/gemini-2.0-flash-thinking-exp:free',
        name: 'Gemini 2.0 Thinking',
        description: '谷歌最新的 AI 模型'
    },
    {
        providerId: 'openrouter',
        modelId: 'meta-llama/llama-3.2-3b-instruct:free',
        uniqueId: 'openrouter:meta-llama/llama-3.2-3b-instruct:free',
        name: 'Llama 3.2',
        description: 'Meta 的开源大模型'
    },
    {
        providerId: 'openrouter',
        modelId: 'qwen/qwen-2-7b-instruct:free',
        uniqueId: 'openrouter:qwen/qwen-2-7b-instruct:free',
        name: 'Qwen 2.7B',
        description: '阿里开发的 AI 模型'
    },
    {
        providerId: 'openrouter',
        modelId: 'mistralai/mistral-7b-instruct:free',
        uniqueId: 'openrouter:mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B',
        description: 'Mistral AI 的开源大模型'
    },
    {
        providerId: 'deepseek',
        modelId: 'deepseek-chat',
        uniqueId: 'deepseek:deepseek-chat',
        name: 'DeepSeek Chat',
        description: '深度求索（DeepSeek）公司开发的 AI 模型'
    },
    {
        providerId: 'google',
        modelId: 'gemini-2.0-flash-exp',
        uniqueId: 'google:gemini-2.0-flash-exp',
        name: 'Gemini 2.0 Flash',
        description: '谷歌的 AI 模型'
    },
];

// AI 消息类型
export type AIMessage = {
    role: 'user' | 'assistant';
    content: string;
};

// AI 聊天上下文类型
export type AIChatContext = AIMessage[];

// 默认模型
export const DEFAULT_MODEL = AI_MODELS[0].uniqueId; 

// 默认提供商
export const DEFAULT_PROVIDER = AI_PROVIDERS['openrouter'].id;

// 获取模型信息的辅助函数
export function getModelByUniqueId(uniqueId: string): AIModel | undefined {
    return AI_MODELS.find(model => model.uniqueId === uniqueId);
}

export function getProviderById(providerId: string): AIProvider | undefined {
    return AI_PROVIDERS[providerId];
}

// 提示词类型定义
export type Prompt = {
    id: string;
    name: string;
    description: string;
    content: string;
};

// 预定义的提示词列表
export const PROMPTS: Prompt[] = [
    {
        id: 'default',
        name: '默认对话',
        description: '普通的对话模式',
        content: ''
    },
    {
        id: 'translator',
        name: '翻译助手',
        description: '帮助翻译各种语言',
        content: '你现在是一位专业的翻译官，请帮我翻译接下来的内容，并解释其中的难点和文化差异。'
    },
    {
        id: 'programmer',
        name: '编程助手',
        description: '解答编程相关问题',
        content: '你是一位经验丰富的程序员，请用专业且易懂的方式回答我的技术问题，并提供代码示例。'
    }
];

export function getPromptById(promptId: string): Prompt | undefined {
    return PROMPTS.find(prompt => prompt.id === promptId);
}