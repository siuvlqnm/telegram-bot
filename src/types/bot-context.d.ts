import { Context } from 'hono';
import { TelegramUpdate } from '@/types/telegram';
import { OpenAI } from 'openai';

export interface BotContextEnv {
    telegramUpdate: TelegramUpdate;
  // 其他全局上下文数据
}

export type BotContext = Context<{ Bindings: BotContextEnv }>;