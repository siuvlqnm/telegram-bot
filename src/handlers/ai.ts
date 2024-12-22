import { AIServiceFactory } from '@/services/ai/factory';
import { sendMessage } from '@/utils/telegram';
import { getUserModel } from '@/contexts/model-states';
import { DEFAULT_MODEL, AIMessage, getModelByUniqueId } from '@/types/ai';
import { TELEGRAM_BOT_KV } from '@/config';

// 简化版上下文管理
const userContexts = new Map<number, AIMessage[]>();

export async function handleAiMessage(chatId: number, text: string) {
    try {
        // 获取用户选择的模型
        const modelUniqueId = await getUserModel(TELEGRAM_BOT_KV(), chatId) || DEFAULT_MODEL;
        const model = getModelByUniqueId(modelUniqueId);

        if (!model) {
            await sendMessage(chatId, "❌ 模型配置错误，请重新选择模型 (/model)");
            return;
        }

        // 获取用户的上下文
        let userMessages = userContexts.get(chatId) || [];
        userMessages.push({ role: 'user', content: text });

        // 限制上下文消息数量（保留最近的5条消息）
        if (userMessages.length > 10) {
            userMessages = userMessages.slice(-10);
        }

        try {
            // 获取 AI 服务并发送请求
            const service = AIServiceFactory.getService(modelUniqueId);
            const aiResponse = await service.getCompletion(userMessages);

            // 保存助手的回复到上下文
            userMessages.push({ role: 'assistant', content: aiResponse });
            userContexts.set(chatId, userMessages);

            // 发送响应给用户
            await sendMessage(chatId, aiResponse, { 
                parse_mode: 'Markdown',
                // 如果消息发送失败，尝试不使用 Markdown
                fallback: async (text: string) => {
                    await sendMessage(chatId, text);
                }
            });

        } catch (error: any) {
            console.error("AI Service Error:", error);
            let errorMessage = "❌ AI 助手出现了一些问题";
            
            if (error.message?.includes('API 配额已用完')) {
                errorMessage = "❌ 该模型的配额已用完，请尝试其他模型 (/model)";
            } else if (error.message?.includes('请求太频繁')) {
                errorMessage = "❌ 请求太频繁，请稍后再试";
            }

            await sendMessage(chatId, errorMessage);
        }

    } catch (error) {
        console.error("General Error:", error);
        await sendMessage(chatId, "❌ 系统出现错误，请稍后重试");
    }
}

// 清除用户上下文
export function clearUserContext(userId: number) {
    userContexts.delete(userId);
}

// 获取用户上下文长度
export function getUserContextLength(userId: number): number {
    return userContexts.get(userId)?.length || 0;
}