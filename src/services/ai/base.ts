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
        try {
            this.client = new OpenAI({
                apiKey: config.apiKey,
                baseURL: config.baseURL,
                defaultHeaders: config.defaultHeaders
            });
            this.modelId = config.modelId;
        } catch (error) {
            console.error('Failed to initialize OpenAI client:', error);
            throw error;
        }
    }

    async getCompletion(messages: any[]): Promise<string> {
        try {
                let response;
                try {
                    console.log('Sending request to OpenAI API...', {
                        modelId: this.modelId,
                        messagesCount: messages.length,
                        baseURL: this.client.baseURL,
                        requestParams: {
                            temperature: 0.7,
                            max_tokens: 1000,
                            totalInputTokens: messages.reduce((acc, msg) => acc + msg.content.length, 0)
                        }
                    });

                    const startTime = Date.now();
                    try {
                        response = await this.client.chat.completions.create({
                            model: this.modelId,
                            messages: messages,
                            temperature: 0.7,
                            max_tokens: 1000
                        });
                        
                        const duration = Date.now() - startTime;
                        console.log('API request completed:', {
                            duration: `${duration}ms`,
                            responseSize: response?.choices?.[0]?.message?.content?.length || 0,
                            status: 'success'
                        });
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        console.error('API request failed:', {
                            duration: `${duration}ms`,
                            error: error,
                            status: 'failed'
                        });
                        throw error;
                    }
                    
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
                return content;
            } catch (error) {
                console.error('API request failed:', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    modelId: this.modelId,
                    baseURL: this.client.baseURL
                });
                throw error;
            }
        } catch (error: any) {
            console.error('AI API Error:', {
                error: error instanceof Error ? error.message : error,
                stack: error instanceof Error ? error.stack : undefined
            });
            throw new Error(`AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }