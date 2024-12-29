import { AccuWeatherService } from '@/services/accuweather';
import { ACCUWEATHER_API_KEY } from '@/config';
import { sendMessage } from '@/utils/telegram';

export async function handleWeatherCommand(chatId: number, text: string) {
  try {
    const weatherService = new AccuWeatherService(ACCUWEATHER_API_KEY());

    // 搜索位置
    const location = await weatherService.searchLocationByGeo(text);
    if (!location) {
      await sendMessage(chatId, '未找到该城市，请检查城市名称是否正确。');
      return;
    }
    
    // 获取当前天气
    const conditions = await weatherService.getCurrentConditions(location.Key);
    if (!conditions) {
      await sendMessage(chatId, '获取天气信息失败，请稍后重试。');
      return;
    }

    const currentWeather = weatherService.formatCurrentWeather(location, conditions);
    await sendMessage(chatId, currentWeather);
  } catch (error) {
    console.error('Weather command error:', error);
    await sendMessage(chatId, '获取天气信息时发生错误，请稍后重试。');
  }
}

export async function handleForecastCommand(chatId: number, text: string) {
  try {
    const weatherService = new AccuWeatherService(ACCUWEATHER_API_KEY());

    // 搜索位置
    const location = await weatherService.searchLocationByGeo(text);
    if (!location) {
      await sendMessage(chatId, '未找到该城市，请检查城市名称是否正确。');
      return;
    }

    // 获取天气预报
    const forecast = await weatherService.getForecast(location.Key);
    if (!forecast) {
      await sendMessage(chatId, '获取天气预报失败，请稍后重试。');
      return;
    }

    const forecastMessage = weatherService.formatForecast(location, forecast);
    await sendMessage(chatId, forecastMessage);
  } catch (error) {
    console.error('Forecast command error:', error);
    await sendMessage(chatId, '获取天气预报时发生错误，请稍后重试。');
  }
}