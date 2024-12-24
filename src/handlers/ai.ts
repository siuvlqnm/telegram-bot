import { AIServiceFactory } from '@/services/ai/factory';
import { sendMessage } from '@/utils/telegram';
import { getUserModel } from '@/contexts/model-states';
import { DEFAULT_MODEL, getModelByUniqueId } from '@/types/ai';
import { TELEGRAM_BOT_KV } from '@/config';
import { getUserContext, setUserContext } from '@/contexts/chat-context';

export async function handleAiMessage(chatId: number, text: string) {
    console.log('handleAiMessage');
    console.log('=== Start handleAiMessage ===');
    console.log('Input params:', { chatId, text });
    
    try {
        // 获取用户选择的模型
        console.log('Fetching user model...');
        const modelUniqueId = await getUserModel(TELEGRAM_BOT_KV(), chatId) || DEFAULT_MODEL;
        console.log('User model:', modelUniqueId);
        
        const model = getModelByUniqueId(modelUniqueId);
        console.log('Model details:', model);

        if (!model) {
            console.warn('Model not found, sending error message');
            await sendMessage(chatId, "❌ 模型配置错误，请重新选择模型 (/model)");
            return;
        }

        // 从 KV 获取用户上下文
        console.log('Fetching user context...');
        let userMessages = await getUserContext(TELEGRAM_BOT_KV(), chatId);
        console.log('Current context length:', userMessages.length);
        console.log('Adding new message to context');
        userMessages.push({ role: 'user', content: text });

        // 限制上下文消息数量
        console.log('Context size before trim:', userMessages.length);
        if (userMessages.length > 5) {
            console.log('Trimming context...');
            const firstMessage = userMessages[0];
            userMessages = userMessages.slice(-4);
            userMessages.unshift(firstMessage);
            console.log('Context size after trim:', userMessages.length);
        }

        try {
            // 获取 AI 服务并发送请求
            console.log('Getting AI service for model:', modelUniqueId);
            const service = AIServiceFactory.getService(modelUniqueId);
            console.log('Service initialized, sending completion request...');
            
            const aiResponse = await service.getCompletion(userMessages);
            console.log('AI response received, length:', aiResponse.length);

            // 保存助手的回复到上下文
            console.log('Saving assistant response to context');
            userMessages.push({ role: 'assistant', content: aiResponse });
            
            // 保存更新后的上下文到 KV
            console.log('Updating context in KV storage...');
            await setUserContext(TELEGRAM_BOT_KV(), chatId, userMessages);
            
            // 发送响应给用户
            console.log('Sending response to user...');
            await sendMessage(chatId, aiResponse, { 
                parse_mode: 'MarkdownV2'
                // 如果消息发送失败，尝试不使用 Markdown
                // fallback: async (text: string) => {
                //     await sendMessage(chatId, text);
                // }
            });
            console.log('Response sent successfully');

        } catch (error: any) {
            console.error("AI Service Error:", {
                error: error.message,
                stack: error.stack,
                details: error
            });
            
            let errorMessage = "❌ AI 助手出现了一些问题";
            
            if (error.message?.includes('API 配额已用完')) {
                console.log('Quota exceeded error');
                errorMessage = "❌ 该模型的配额已用完，请尝试其他模型 (/model)";
            } else if (error.message?.includes('请求太频繁')) {
                console.log('Rate limit error');
                errorMessage = "❌ 请求太频繁，请稍后再试";
            }

            console.log('Sending error message to user:', errorMessage);
            await sendMessage(chatId, errorMessage);
        }

    } catch (error) {
        console.error("General Error:", {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });
        await sendMessage(chatId, "❌ 系统出现错误，请稍后重试");
    }
    console.log('=== End handleAiMessage ===');
}