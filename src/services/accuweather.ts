import { AccuWeatherCurrentConditions, AccuWeatherForecast, AccuWeatherLocation } from '@/types/accuweather';
import { fetchApi } from '@/utils/api';

export class AccuWeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'http://dataservice.accuweather.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // locations/v1/cities/geoposition/search 通过经纬度搜索
  async searchLocationByGeo(text: string): Promise<AccuWeatherLocation> {
    const url = `${this.baseUrl}/locations/v1/cities/geoposition/search?apikey=${this.apiKey}&q=${text}&language=zh-cn`;
    const response = await fetchApi<AccuWeatherLocation>(url);
    return response;
  }

  async searchLocation(query: string): Promise<AccuWeatherLocation[]> {
    const url = `${this.baseUrl}/locations/v1/cities/search?apikey=${this.apiKey}&q=${encodeURIComponent(query)}&language=zh-cn`;
    const response = await fetchApi<AccuWeatherLocation[]>(url);
    return response;
  }

  async getCurrentConditions(locationKey: string): Promise<AccuWeatherCurrentConditions> {
    const url = `${this.baseUrl}/currentconditions/v1/${locationKey}?apikey=${this.apiKey}&language=zh-cn&details=true`;
    const response = await fetchApi<AccuWeatherCurrentConditions[]>(url);
    return response[0];
  }

  async getForecast(locationKey: string): Promise<AccuWeatherForecast> {
    const url = `${this.baseUrl}/forecasts/v1/daily/5day/${locationKey}?apikey=${this.apiKey}&language=zh-cn&metric=true`;
    const response = await fetchApi<AccuWeatherForecast>(url);
    return response;
  }

  formatCurrentWeather(location: AccuWeatherLocation, current: AccuWeatherCurrentConditions): string {
    return `📍 ${location.LocalizedName}, ${location.AdministrativeArea.LocalizedName}, ${location.Country.LocalizedName}\n` +
      `🌡 温度: ${current.Temperature.Metric.Value}°C\n` +
      `💧 相对湿度: ${current.RelativeHumidity}%\n` +
      `🌤 天气: ${current.WeatherText}\n` +
      `🌪 风速: ${current.Wind.Speed.Metric.Value} ${current.Wind.Speed.Metric.Unit}\n` +
      `🧭 风向: ${current.Wind.Direction.Localized}\n` +
      `☀️ 紫外线指数: ${current.UVIndexText}`;
  }

  formatForecast(location: AccuWeatherLocation, forecast: AccuWeatherForecast): string {
    let message = `📍 ${location.LocalizedName} 未来5天天气预报:\n\n`;
    message += forecast.Headline.Text + '\n\n';
    
    for (const daily of forecast.DailyForecasts) {
      const date = new Date(daily.Date).toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' });
      message += `${date}:\n`;
      message += `🌡 温度: ${daily.Temperature.Minimum.Value}°C - ${daily.Temperature.Maximum.Value}°C\n`;
      message += `☀️ 白天: ${daily.Day.IconPhrase}\n`;
      message += `🌙 夜间: ${daily.Night.IconPhrase}\n\n`;
    }
    
    return message.trim();
  }
}