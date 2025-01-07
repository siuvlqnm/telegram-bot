import { Context, Next, MiddlewareHandler } from 'hono';
import { TelegramService } from '@/services/telegram';
import { TmdbService } from '@/services/tmdb';
import { UserStateService } from '@/services/user-state';
import { AIModule } from '@/modules/ai';
import { TaskRegistry } from '@/core/task-registry';
// 全局中间件
export const globalAssigner: MiddlewareHandler = async (c: Context, next: Next) => {
    try {
        const json = await c.req.json();
        c.set('telegramUpdate', json);
        c.set('telegramService', new TelegramService(c.env.TELEGRAM_BOT_TOKEN));
        c.set('tmdbService', new TmdbService(c.env.TMDB_API_KEY));
        c.set('userStateService', new UserStateService(c.env.TELEGRAM_BOT_KV));
        c.set('aiModule', new AIModule(c));
        c.set('taskRegistry', new TaskRegistry());
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return c.text('Bad Request', 400);
    }
    return next();
};