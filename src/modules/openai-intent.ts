// // src/modules/openai-intent.ts
// import { AIModule } from '@/modules/ai';
// import { Context } from 'hono';

// export class OpenAIIntent {
//     private aiModule: AIModule;

//     constructor(aiModule: AIModule) {
//         this.aiModule = aiModule;
//     }

//     async getIntent(c: Context): Promise<{ intent: string; params: Record<string, any> }> {
//         const update = c.get('telegramUpdate');
//         const chatId = update.message?.chat.id;
//         const text = update.message?.text;

//         if (!text || !chatId) {
//             return { intent: 'error', params: { message: 'Invalid request' } };
//         }

//         const userStateService = c.get('userStateService');
//         const userState = await userStateService.getState(chatId);
//         const providerId = userState.preferredModelProvider;
//         const model = userState.preferredModel;

//         if (!providerId || !model) {
//             // 提示用户选择提供商和模型
//             return { intent: 'config_required', params: {} };
//         }

//         try {
//             // 使用用户选择的 AI 提供商和模型生成意图或直接处理
//             const response = await this.aiModule.generateText(providerId, model, text, { temperature: 0.7 });
//             // 这里需要根据你的具体需求解析 response 并提取意图和参数
//             console.log('AI Response:', response);
//             return this.parseIntentResponse(response);
//         } catch (error) {
//             console.error('AI 调用失败:', error);
//             return { intent: 'error', params: { message: 'AI 服务调用失败' } };
//         }
//     }

//     private parseIntentResponse(responseText: string): { intent: string; params: Record<string, any> } {
//         //  根据 AI 模型的返回结果解析意图和参数
//         //  这部分逻辑会根据你使用的 Prompt 和模型输出格式而变化
//         //  例如，如果模型返回 JSON 格式的意图和参数：
//         try {
//             const parsed = JSON.parse(responseText);
//             return { intent: parsed.intent, params: parsed.params };
//         } catch (e) {
//             console.warn('无法解析 AI 响应:', responseText);
//             return { intent: 'unknown', params: {} };
//         }
//     }
// }