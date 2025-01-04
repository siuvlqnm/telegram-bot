// src/callbacks/tmdb.ts
import { Context } from 'hono';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const handleTmdbMovieDetailsCallback = async (c: Context) => {
  const callbackQuery = c.get('telegramUpdate').callback_query;
  const data = callbackQuery?.data; // 假设 callback_data 包含类似 "movie_details:123" 的信息
  const chatId = callbackQuery?.message?.chat.id;
  const [_, itemId] = data?.split(':') || [];
  try {
    const tmdbService = c.get('tmdbService');
    const movieDetails = await tmdbService.getMovieDetails(itemId);
      let responseText = `🎬 ${movieDetails.title}\n`;
      responseText += `📅 上映日期: ${movieDetails.release_date ? new Date(movieDetails.release_date).toLocaleDateString('zh-CN') : '未知'}\n`;
      responseText += `⭐️ 评分: ${movieDetails.vote_average.toFixed(1)}\n`;
      responseText += `🏷️ 类型: ${movieDetails.genres.map((g: any) => g.name).join('、')}\n`;
      responseText += `🖼️ 海报: ${POSTER_BASE_URL}${movieDetails.poster_path}\n`;
      responseText += `📝 简介: ${movieDetails.overview || '暂无简介'}`;
      const telegramService = c.get('telegramService');
      await telegramService.sendMessage(chatId, responseText);
      return c.text(`🎬 ${movieDetails.title} 已发送`);
    } catch (error) {
      console.error('获取电影详情失败:', error);
    return c.text('🎬 获取电影详情失败。', 500);
  }
};

export const handleTmdbTvDetailsCallback = async (c: Context) => {
  const callbackQuery = c.get('telegramUpdate').callback_query;
  const data = callbackQuery?.data;
  const [_, itemId] = data?.split(':') || [];
  const tmdbService = c.get('tmdbService');
  const showDetails = await tmdbService.getShowDetails(itemId);

  return c.text('🎬 获取 TMDB 详情失败。', 500);
};
