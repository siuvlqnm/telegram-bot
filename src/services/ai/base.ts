import { OpenAI } from 'openai';

export interface AIServiceConfig {
    apiKey: string;
    baseURL: string;
    defaultHeaders?: Record<string, string>;
    modelId: string;
}

// 基础服务类，使用 OpenAI 兼容接口
export class BaseAIService {
    protected client: OpenAI;
    protected modelId: string;

    constructor(config: AIServiceConfig) {
        console.log('=== Initializing BaseAIService ===');
        console.log('Configuration received:', {
            baseURL: config.baseURL,
            modelId: config.modelId,
            hasApiKey: !!config.apiKey,
            hasHeaders: !!config.defaultHeaders
        });

        try {
            this.client = new OpenAI({
                apiKey: config.apiKey,
                baseURL: config.baseURL,
                defaultHeaders: config.defaultHeaders
            });
            this.modelId = config.modelId;
            console.log('OpenAI client initialized successfully');
        } catch (error) {
            console.error('Failed to initialize OpenAI client:', error);
            throw error;
        }
        console.log('=== BaseAIService initialization complete ===');
    }

    async getCompletion(messages: any[]): Promise<string> {
        console.log('=== Start getCompletion ===');
        console.log('Input messages count:', messages.length);
        console.log('Using model:', this.modelId);
        
        try {
            console.log('Sending request to OpenAI API...');
            const completion = await this.client.chat.completions.create({
                model: this.modelId,
                messages: messages
            });
            console.log('Response received from API');

            if (!completion.choices || !completion.choices[0]) {
                console.error('No choices in completion response');
                return '❌ AI completion error: No choices available';
            }

            if (!completion.choices[0].message || !completion.choices[0].message.content) {
                console.error('No message content in completion response');
                return '❌ AI completion error: No message content';
            }
            
            const content = completion.choices[0].message.content;
            console.log('Successfully extracted content, length:', content.length);
            console.log('=== End getCompletion ===');
            return content;
        } catch (error) {
            console.error('AI API Error:', {
                error: error instanceof Error ? error.message : error,
                stack: error instanceof Error ? error.stack : undefined
            });
            throw new Error(`AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
} 