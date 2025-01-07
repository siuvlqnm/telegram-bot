import { Context } from 'hono';
import { TaskRegistry } from '@/core/task-registry';
import * as GetAirQuality from '@/modules/actions/get-air-quality';

// 命令介绍中加入emojis，要根据命令的用途来决定emojis
// start - 🤖 开始命令
// setprovider - 🤖 设置AI提供商
// setmodel - 🤖 设置AI模型
// clear - 🧹 清除当前会话状态

export function registerActions(registry: TaskRegistry) {
    registry.register({
      name: 'get_air_quality',
      description: '获取空气质量状况',
      handler: GetAirQuality.getAirQualityAction,
    });
  }