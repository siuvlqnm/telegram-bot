import { sendMessage } from '@/utils/telegram';
import { getAirQuality, formatAirQualityMessage } from '@/services/air-matters';

export async function handleAirQualityCommand(chatId: number) {
    try {
        const airQualityData = await getAirQuality();
        const message = formatAirQualityMessage(airQualityData);
        await sendMessage(chatId, message);
    } catch (error) {
        console.error('Error fetching air quality data:', error);
        await sendMessage(chatId, '❌ 获取空气质量数据失败，请稍后重试。');
    }
} 