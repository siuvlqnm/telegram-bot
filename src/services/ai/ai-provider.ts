// src/services/ai-provider.ts
import { Context } from 'hono';

export type AIResponse = {
    type: 'text';
    content: string;
} | {
    type: 'tool_calls';
    content: {
        name: string;
        arguments: Record<string, any>;
    };
};

export interface AIProvider {
    id: string; // 唯一标识符 (例如: 'openai', 'gemini')
    name: string; // 可读名称 (例如: 'OpenAI', 'Google Gemini')

    // 初始化提供商，例如加载配置或初始化 SDK
    initialize(c: Context): void;

    // 列出该提供商支持的模型
    listModels(): Promise<string[]>;

    // 生成文本
    generateText(prompt: string, model: string, options?: any): Promise<AIResponse>;

    // 其他可能需要的接口，例如：
    // generateImage(prompt: string, model: string, options?: any): Promise<string>;
    // ...
}