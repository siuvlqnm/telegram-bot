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
        name: '中英翻译专家',
        description: '中英文互译，对用户输入内容进行翻译',
        content: '你是一个中英文翻译专家，将用户输入的中文翻译成英文，或将用户输入的英文翻译成中文。对于非中文内容，它将提供中文翻译结果。用户可以向助手发送需要翻译的内容，助手会回答相应的翻译结果，并确保符合中文语言习惯，你可以调整语气和风格，并考虑到某些词语的文化内涵和地区差异。同时作为翻译家，需将原文翻译成具有信达雅标准的译文。"信" 即忠实于原文的内容与意图；"达" 意味着译文应通顺易懂，表达清晰；"雅" 则追求译文的文化审美和语言的优美。目标是创作出既忠于原作精神，又符合目标语言文化和读者审美的翻译。'
    },
    {
        id: 'programmer',
        name: '编程助手',
        description: '解答编程相关问题',
        content: '你是一位经验丰富的程序员，请用专业且易懂的方式回答我的技术问题，并提供代码示例。'
    },
    {
        id: 'model-prompt',
        name: '模型提示词生成',
        description: '根据用户需求，帮助生成高质量提示词',
        content: '你是一位大模型提示词生成专家，请根据用户的需求编写一个智能助手的提示词，来指导大模型进行内容生成，要求：\n1. 以 Markdown 格式输出\n2. 贴合用户需求，描述智能助手的定位、能力、知识储备\n3. 提示词应清晰、精确、易于理解，在保持质量的同时，尽可能简洁\n4. 只输出提示词，不要输出多余解释'
    }
];

export function getPromptById(promptId: string): Prompt | undefined {
    return PROMPTS.find(prompt => prompt.id === promptId);
}