// src/modules/actions/get-weather.ts
import { Context } from 'hono';
import { AccuWeatherService } from '@/services/accuweather';

export const getWeatherAction = async (c: Context, params: Record<string, any>) => {
    const chatId = c.get('telegramUpdate').message?.chat.id;
    const telegramService = c.get('telegramService');
    try {
        const weatherService = new AccuWeatherService(c);
    
        // 搜索位置
        const location = await weatherService.searchLocationByGeo('28.16700989590093,113.0403113939968');
        if (!location) {
            await telegramService.sendMessage(chatId, '未找到该城市，请检查城市名称是否正确。');
          return;
        }
        
        // 获取当前天气
        const conditions = await weatherService.getCurrentConditions(location.Key);
        if (!conditions) {
          await telegramService.sendMessage(chatId, '获取天气信息失败，请稍后重试。');
          return;
        }
    
        const currentWeather = weatherService.formatCurrentWeather(location, conditions);
        await telegramService.sendMessage(chatId, currentWeather);
      } catch (error) {
        console.error('Weather command error:', error);
        await telegramService.sendMessage(chatId, '获取天气信息时发生错误，请稍后重试。');
      }
};

// const getWeather: TaskHandler = async (c: Context, params: Record<string, any>) => {
//     const weatherService = c.get('weatherService');
//     const telegramService = c.get('telegramService');
//     const userStateService = c.get('userStateService');
//     const update = c.get('telegramUpdate');
//     const chatId = update.message?.chat.id;
//     const location = params.location || (await userStateService.getState(chatId)).defaultLocation;

//     if (!location) {
//         await telegramService.sendMessage(chatId, '请告诉我您想查询哪个地方的天气。');
//         return;
//     }

//     try {
//         const forecast = await weatherService.getWeather(location);
//         await telegramService.sendMessage(chatId, `${location} 的天气是：${forecast.conditionText}, 温度 ${forecast.temperatureC}°C`);
//     } catch (error: any) {
//         await telegramService.sendMessage(chatId, `获取天气失败：${error.message}`);
//     }
// };

// export default getWeather;