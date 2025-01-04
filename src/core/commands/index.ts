import { Context } from 'hono';
import { CommandRegistry } from '@/core/command-registry';
import * as StartCommand from '@/core/commands/start';
import * as TmdbCommand from '@/core/commands/tmdb';
// export * as AskCommand from './ask';

export function registerCommands(registry: CommandRegistry) {
    registry.register({
      name: 'start',
      description: '开始命令',
      handler: StartCommand.startCommand,
    });
    registry.register({
      name: 'tmdb',
      description: 'tmdb命令',
      handler: TmdbCommand.startTmdbCommand,
    });
    registry.register({ // 注册 clear 命令
      name: 'clear',
      description: '清除当前会话状态',
      handler: async (c: Context) => {
        const chatId = c.get('telegramUpdate').message?.chat.id;
        const userStateService = c.get('userStateService');
        await userStateService.clearState(chatId);
        return c.text('会话状态已清除。');
      },
    });
    
    // registry.register({
    //   name: 'ask',
    //   description: '向 OpenAI 提问',
    //   handler: AskCommand.askCommand,
    // });
    // 可以添加更多命令的注册
  }