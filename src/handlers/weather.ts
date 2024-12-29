import { AccuWeatherService } from '@/services/accuweather';
import { ACCUWEATHER_API_KEY } from '@/config';
import { sendMessage } from '@/utils/telegram';

const weatherService = new AccuWeatherService(ACCUWEATHER_API_KEY());

export async function handleWeatherCommand(chatId: number,text: string) {
  try {
    // const query = ctx.message?.text?.replace('/weather', '').trim();
    // if (!query) {
    //   await ctx.reply('请输入城市名称，例如：/weather 北京');
    //   return;
    // }

    // 搜索位置
    const locations = await weatherService.searchLocationByGeo(text);
    if (!locations || locations.length === 0) {
      await sendMessage(chatId, '未找到该城市，请检查城市名称是否正确。');
      return;
    }

    const location = locations[0];
    
    // 获取当前天气
    const conditions = await weatherService.getCurrentConditions(location.Key);
    if (!conditions || conditions.length === 0) {
      await sendMessage(chatId, '获取天气信息失败，请稍后重试。');
      return;
    }

    const currentWeather = weatherService.formatCurrentWeather(location, conditions[0]);
    await sendMessage(chatId, currentWeather);
  } catch (error) {
    console.error('Weather command error:', error);
    await sendMessage(chatId, '获取天气信息时发生错误，请稍后重试。');
  }
}

// export async function handleForecastCommand(ctx: BotContext) {
//   try {
//     const query = ctx.message?.text?.replace('/forecast', '').trim();
//     if (!query) {
//       await ctx.reply('请输入城市名称，例如：/forecast 北京');
//       return;
//     }

//     // 搜索位置
//     const locations = await weatherService.searchLocation(query);
//     if (!locations || locations.length === 0) {
//       await ctx.reply('未找到该城市，请检查城市名称是否正确。');
//       return;
//     }

//     const location = locations[0];
    
//     // 获取天气预报
//     const forecast = await weatherService.getForecast(location.Key);
//     const forecastMessage = weatherService.formatForecast(location, forecast);
//     await ctx.reply(forecastMessage);
//   } catch (error) {
//     console.error('Forecast command error:', error);
//     await ctx.reply('获取天气预报时发生错误，请稍后重试。');
//   }
// }