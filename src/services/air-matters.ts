import { AirQualityResponse, AirQualityLevel } from '@/types/air-matters';
import { fetchApi } from '@/utils/api';

export async function getAirQuality(): Promise<AirQualityResponse> {
    // https://api.air-matters.app/current_air_condition?place_id=b5f0a667&lang=en&standard=aqi_us
    const url = `https://api.air-matters.app/current_air_condition?place_id=ab4c5e07&lang=zh-Hans&standard=aqi_us`;
    return await fetchApi<AirQualityResponse>(url);
}

export function formatAirQualityMessage(data: AirQualityResponse): string {
    const { readings, update_time } = data.latest;
    
    // 获取AQI信息
    const aqi = readings.find(r => r.kind === 'aqi');
    
    // 获取各项污染物数据
    const pm25 = readings.find(r => r.kind === 'pm25');
    const pm10 = readings.find(r => r.kind === 'pm10');
    const o3 = readings.find(r => r.kind === 'o3');
    const no2 = readings.find(r => r.kind === 'no2');
    const so2 = readings.find(r => r.kind === 'so2');
    const co = readings.find(r => r.kind === 'co');

    // 根据AQI等级选择主题颜色emoji
    const levelEmojis: Record<AirQualityLevel, string> = {
        '优': '💚',
        '良好': '💚',
        '中等': '💛',
        '对敏感人群不健康': '🧡',
        '不健康': '❤️',
        '非常不健康': '💔',
        '危险': '💀'
    };

    const levelEmoji = levelEmojis[aqi?.level as AirQualityLevel] || '❓';

    // 小红书风格的标题
    const title = `${levelEmoji} 雨花区实时空气质量报告 ${levelEmoji}\n`;

    // 主要空气质量指数部分
    const mainInfo = `
🌈 空气质量指数(AQI)：${aqi?.value}
📊 污染等级：${aqi?.level}
🎨 指示颜色：${aqi?.color}

`;

    // 详细污染物数据部分，使用进度条表示污染程度
    const getProgressBar = (ratio: number) => {
        const total = 10;
        const filled = Math.round(ratio * total);
        return '▓'.repeat(filled) + '░'.repeat(total - filled);
    };

    const pollutantsInfo = `📌 详细污染物指标

💨 PM2.5：${pm25?.value} ${pm25?.unit}
${getProgressBar(pm25?.ratio || 0)} ${pm25?.level}

🌫️ PM10：${pm10?.value} ${pm10?.unit}
${getProgressBar(pm10?.ratio || 0)} ${pm10?.level}

🌅 臭氧(O₃)：${o3?.value} ${o3?.unit}
${getProgressBar(o3?.ratio || 0)} ${o3?.level}

🏭 二氧化氮(NO₂)：${no2?.value} ${no2?.unit}
${getProgressBar(no2?.ratio || 0)} ${no2?.level}

🏢 二氧化硫(SO₂)：${so2?.value} ${so2?.unit}
${getProgressBar(so2?.ratio || 0)} ${so2?.level}

🚗 一氧化碳(CO)：${co?.value} ${co?.unit}
${getProgressBar(co?.ratio || 0)} ${co?.level}

`;

    // 健康建议
    const healthAdvice = `💡 健康建议
${getHealthAdvice(aqi?.level as AirQualityLevel)}

`;

    // 更新时间
    const updateInfo = `⏰ 更新时间：${update_time}

🏷️ Tips：定期关注空气质量，保护身体健康哦～
#空气质量 #环境监测 #健康生活`;

    return title + mainInfo + pollutantsInfo + healthAdvice + updateInfo;
}

function getHealthAdvice(level: AirQualityLevel): string {
    const advices: Record<AirQualityLevel, string> = {
        '优': '空气质量非常好，非常适合户外活动，尽情享受清新空气吧！',
        '良好': '空气质量不错，适合户外活动，敏感人群应适度防护。',
        '中等': '空气质量一般，建议减少户外运动时间，外出戴口罩。',
        '对敏感人群不健康': '敏感人群应避免户外活动，一般人群减少户外运动。',
        '不健康': '建议避免户外活动，外出必须戴口罩，保护呼吸道。',
        '非常不健康': '尽量待在室内，减少外出，外出时做好防护措施。',
        '危险': '严重污染！请待在室内，关闭门窗，使用空气净化器。'
    };
    
    return advices[level] || '暂无具体建议，请根据实际情况做好防护。';
} 