// AI 模型的基本类型定义
export type AIModel = {
    id: string;
    name: string;
    description: string;
};

// 可用的 AI 模型列表
export const AI_MODELS: AIModel[] = [
    {
        id: 'google/gemini-2.0-flash-exp:free',
        name: 'Gemini 2.0 Flash',
        description: '谷歌最新的 AI 模型'
    },
    {
        id: 'google/gemini-2.0-flash-thinking-exp:free',
        name: 'Gemini 2.0 Thinking',
        description: '谷歌最新的 AI 模型'
    },
    {
        id: 'meta-llama/llama-3.2-3b-instruct:free',
        name: 'Llama 3.2',
        description: 'Meta 的开源大模型'
    },
    {
        id: 'qwen/qwen-2-7b-instruct:free',
        name: 'Qwen 2.7B',
        description: '阿里开发的 AI 模型'
    },
    {
        id: 'mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B',
        description: 'Mistral AI 的开源大模型'
    }
];

// AI 消息类型
export type AIMessage = {
    role: 'user' | 'assistant';
    content: string;
};

// AI 聊天上下文类型
export type AIChatContext = AIMessage[];

// 默认模型
export const DEFAULT_MODEL = AI_MODELS[0].id; 