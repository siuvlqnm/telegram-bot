// src/modules/actions/get-weather.ts
import { Context } from 'hono';
import { getAirQuality, formatAirQualityMessage } from '@/services/air-matters';

export const getAirQualityAction = async (c: Context, params: Record<string, any>) => {
    const chatId = c.get('telegramUpdate').message?.chat.id;
    const telegramService = c.get('telegramService');
    const airQualityData = await getAirQuality();
    const message = formatAirQualityMessage(airQualityData);
    await telegramService.sendMessage(chatId, message);
};

// const getAirQuality: TaskHandler = async (c: Context, params: Record<string, any>) => {
    // const airQualityService = c.get('airQualityService');
    // const telegramService = c.get('telegramService');
    // const userStateService = c.get('userStateService');
    // const update = c.get('telegramUpdate');
    // const chatId = update.message?.chat.id;
    // const location = params.location || (await userStateService.getState(chatId)).defaultLocation;

    // if (!location) {
    //     await telegramService.sendMessage(chatId, '请告诉我您想查询哪个地方的天气。');
    //     return;
    // }

    // try {
    //     const forecast = await weatherService.getWeather(location);
    //     await telegramService.sendMessage(chatId, `${location} 的天气是：${forecast.conditionText}, 温度 ${forecast.temperatureC}°C`);
    // } catch (error: any) {
    //     await telegramService.sendMessage(chatId, `获取天气失败：${error.message}`);
    // }
// };

// export default getAirQuality;