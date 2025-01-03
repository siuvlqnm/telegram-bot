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
    
    // registry.register({
    //   name: 'ask',
    //   description: '向 OpenAI 提问',
    //   handler: AskCommand.askCommand,
    // });
    // 可以添加更多命令的注册
  }