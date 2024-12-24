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
            console.log('Preparing OpenAI API request...', {
                modelId: this.modelId,
                messagesCount: messages.length,
                lastMessageContent: messages[messages.length - 1]?.content?.slice(0, 50) + '...'
            });

            console.log('API Configuration:', {
                baseURL: this.client.baseURL,
                hasApiKey: !!this.client.apiKey
            });

            try {
                console.log('Sending request to OpenAI API...', {
                    modelId: this.modelId,
                    messagesCount: messages.length,
                    baseURL: this.client.baseURL
                });

                let response;
                try {
                    response = await this.client.chat.completions.create({
                        model: this.modelId,
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 1000
                    }).catch(error => {
                        console.error('Request failed in catch block:', {
                            name: error.name,
                            message: error.message,
                            code: error.code,
                            type: error.type,
                            status: error?.response?.status,
                            data: error?.response?.data
                        });
                        throw error;
                    });
                    
                    console.log('Raw API response received:', {
                        hasResponse: !!response,
                        hasChoices: !!response?.choices,
                        choicesLength: response?.choices?.length,
                        firstChoice: !!response?.choices?.[0]
                    });
                } catch (error) {
                    console.error('API call error details:', {
                        errorType: typeof error,
                        errorName: (error as Error)?.name,
                        errorMessage: (error as Error)?.message,
                        stack: (error as Error)?.stack?.split('\n').slice(0, 3)
                    });
                    throw error;
                }

                if (!response || !response.choices || !response.choices[0]) {
                    console.error('No choices in completion response');
                    return '❌ AI completion error: No choices available';
                }

                if (!response.choices[0].message || !response.choices[0].message.content) {
                    console.error('No message content in completion response');
                    return '❌ AI completion error: No message content';
                }
                
                const content = response.choices[0].message.content;
                console.log('Successfully extracted content, length:', content.length);
                console.log('=== End getCompletion ===');
                return content;
            } catch (error) {
                console.error('API request failed:', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    modelId: this.modelId,
                    baseURL: this.client.baseURL
                });
                throw error;
            }
        } catch (error) {
            console.error('AI API Error:', {
                error: error instanceof Error ? error.message : error,
                stack: error instanceof Error ? error.stack : undefined
            });
            throw new Error(`AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
} 