// src/core/commands/tmdb.ts
import { Context } from 'hono';
import { InlineKeyboardButton, InlineKeyboardMarkup } from '@/types/telegram';

export const startTmdbCommand = async (c: Context) => {
  const update = c.get('telegramUpdate');
  const text = update.message?.text;
  const isCommand = text?.startsWith('/tmdb');
  if (isCommand) {
    const telegramService = c.get('telegramService');
    const chatId = update.message?.chat.id;
    
    await telegramService.sendMessage(chatId, '😁 请输入电影或剧集名称。');
    return c.text('😁 请输入电影或剧集名称。');
  }
  await handleTmdbSearch(c);
  return c.text('😁 已发送');
};

export const handleTmdbSearch = async (c: Context) => {
  const update = c.get('telegramUpdate');
  const text = update.message?.text;
  const chatId = update.message?.chat.id;

  try {
    const tmdbService = c.get('tmdbService');
    const combinedResults = await tmdbService.searchMulti(text);
    const telegramService = c.get('telegramService');

    if (combinedResults.length === 0) {
      telegramService.sendMessage(chatId, '未找到相关电影或剧集。');
      return;
    } 
    
    if (combinedResults.length === 1) {
      const item = combinedResults[0];
      return handleTmdbItemDetails(c, item.id, item.hasOwnProperty('title') ? 'movie' : 'tv');
    } 

    const keyboard: InlineKeyboardButton[][] = [];
    combinedResults.map((item: any, index: number) => {
        const isMovie = item.media_type === 'movie';
            const title = isMovie ? item.title : item.name;
            const releaseDate = isMovie ? item.release_date : item.first_air_date;
            const year = releaseDate ? new Date(releaseDate).getFullYear() : '未知';
            const type = isMovie ? '电影' : '剧集';
    
            // 为每个结果创建一个按钮
            keyboard.push([{
                text: `${index + 1}. ${title} (${year} ${type}) ⭐️ ${item.vote_average.toFixed(1)}`,
                callback_data: `tmdb_details:${item.id}:${item.media_type}`
            }]);
    
        });
    
    const inlineKeyboard: InlineKeyboardMarkup = {
        inline_keyboard: keyboard
    };
    await telegramService.sendMessage(chatId, '🎬 找到以下匹配项，请选择：', { reply_markup: inlineKeyboard });
    return c.text('🎬 找到以下匹配项，请选择：');
  } catch (error) {
    console.error('TMDB 查询失败:', error);
    return c.text('查询 TMDB 时出错。', 500);
  }
};

const handleTmdbItemDetails = async (c: Context, itemId: number, mediaType: 'movie' | 'tv') => {
  const tmdbService = c.get('tmdbService');
  const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  if (mediaType === 'movie') {
    const movieDetails = await tmdbService.getMovieDetails(itemId);
    let responseText = `🎬 ${movieDetails.title} (电影)\n`;
    responseText += `📅 上映日期: ${movieDetails.release_date ? new Date(movieDetails.release_date).toLocaleDateString('zh-CN') : '未知'}\n`;
    responseText += `⭐️ 评分: ${movieDetails.vote_average.toFixed(1)}\n`;
    responseText += `🏷️ 类型: ${movieDetails.genres.map((g: any) => g.name).join('、')}\n`;
    responseText += `🖼️ 海报: ${POSTER_BASE_URL}${movieDetails.poster_path}\n`;
    responseText += `📝 简介: ${movieDetails.overview || '暂无简介'}`;
    const telegramService = c.get('telegramService');
    const update = c.get('telegramUpdate');
    const chatId = update.message?.chat.id;
    telegramService.sendMessage(chatId, responseText);
    return c.text(`🎬 ${movieDetails.title} 已发送`);
  }
  if (mediaType === 'tv') {
    const showDetails = await tmdbService.getShowDetails(itemId);
    const seasons = await tmdbService.getShowSeasons(itemId);
    const inlineKeyboard: InlineKeyboardMarkup = {
      inline_keyboard: seasons.map((season: any) => [
        {
          text: `第 ${season.season_number} 季 (${season.episode_count} 集)`,
          callback_data: `tmdb_seasons:${itemId}:${season.season_number}`,
        },
      ]),
    };
    return c.json({
      method: 'sendMessage',
      chat_id: c.req.param('chatId'),
      text: `**📺 ${showDetails.name}**\n请选择季：`,
      reply_markup: inlineKeyboard,
    });
  }
};