import { AIServiceFactory } from '@/services/ai/factory';
import { sendMessage } from '@/utils/telegram';
import { getUserModel } from '@/contexts/model-states';
import { DEFAULT_MODEL, getModelByUniqueId } from '@/types/ai';
import { TELEGRAM_BOT_KV } from '@/config';
import { getUserContext, setUserContext } from '@/contexts/chat-context';
import { getUserPrompt } from '@/contexts/prompt-states';
import { getPromptById } from '@/types/ai';

export async function handleAiMessage(chatId: number, text: string) {    
    try {
        // 获取用户选择的模型和 prompt
        const modelUniqueId = await getUserModel(TELEGRAM_BOT_KV(), chatId) || DEFAULT_MODEL;
        const userPrompt = await getUserPrompt(TELEGRAM_BOT_KV(), chatId);
        
        const model = getModelByUniqueId(modelUniqueId);
        if (!model) {
            await sendMessage(chatId, "❌ 模型配置错误，请重新选择模型 (/model)");
            return;
        }

        // 从 KV 获取用户上下文
        let userMessages = await getUserContext(TELEGRAM_BOT_KV(), chatId);
        
        // 如果是新对话，添加系统 prompt
        if (userMessages.length === 0 && userPrompt !== 'default') {
            const prompt = getPromptById(userPrompt);
            if (prompt) {
                userMessages.push({ role: 'system', content: prompt.content });
            }
        }
        
        userMessages.push({ role: 'user', content: text });

        // 限制上下文消息数量
        if (userMessages.length > 5) {
            const firstMessage = userMessages[0];
            userMessages = userMessages.slice(-4);
            userMessages.unshift(firstMessage);
        }

        try {
            // 获取 AI 服务并发送请求
            const service = AIServiceFactory.getService(modelUniqueId);
            const aiResponse = await service.getCompletion(userMessages);

            // 保存助手的回复到上下文
            userMessages.push({ role: 'assistant', content: aiResponse });
            
            // 保存更新后的上下文到 KV
            await setUserContext(TELEGRAM_BOT_KV(), chatId, userMessages);
            
            // 发送响应给用户
            await sendMessage(chatId, aiResponse, { 
                parse_mode: 'MarkdownV2'
                // 如果消息发送失败，尝试不使用 Markdown
                // fallback: async (text: string) => {
                //     await sendMessage(chatId, text);
                // }
            });

        } catch (error: any) {
            console.error("AI Service Error:", {
                error: error.message,
                stack: error.stack,
                details: error
            });
            
            let errorMessage = "❌ AI 助手出现了一些问题";
            
            if (error.message?.includes('API 配额已用完')) {
                errorMessage = "❌ 该模型的配额已用完，请尝试其他模型 (/model)";
            } else if (error.message?.includes('请求太频繁')) {
                errorMessage = "❌ 请求太频繁，请稍后再试";
            }
            await sendMessage(chatId, errorMessage);
        }

    } catch (error) {
        console.error("General Error:", {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });
        await sendMessage(chatId, "❌ 系统出现错误，请稍后重试");
    }
}