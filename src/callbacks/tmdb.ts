// src/callbacks/tmdb.ts
import { Context } from 'hono';

export const handleMovieDetailsCallback = async (c: Context) => {
  const callbackQuery = c.get('telegramUpdate').callback_query;
  const data = callbackQuery?.data; // 假设 callback_data 包含类似 "movie_details:123" 的信息
  const movieId = parseInt(data?.split(':')[1] || '0');

  try {
    const tmdbService = c.get('tmdbService');
    const movieDetails = await tmdbService.getMovieDetails(movieId);
    const responseText = `
**${movieDetails.title}**

${movieDetails.overview}
    `;
    // 使用 Telegram Bot API 发送消息，通常需要 bot 实例
    // 这里仅为演示，实际需要集成 Telegram API 发送消息
    console.log(`发送电影详情到 ${callbackQuery?.message?.chat.id}: ${responseText}`);
    return c.text('处理了电影详情回调');
  } catch (error) {
    console.error('获取电影详情失败:', error);
    return c.text('获取电影详情失败。', 500);
  }
};