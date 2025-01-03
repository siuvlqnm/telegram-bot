// src/core/commands/tmdb.ts
import { Context } from 'hono';
import { InlineKeyboardButton, InlineKeyboardMarkup } from '@/types/telegram';

export const startTmdbCommand = async (c: Context) => {
  const chatId = c.req.param('chatId');
  const userStateService = c.env.USER_STATE_SERVICE;

  await userStateService.updateState(chatId, { currentIntent: 'tmdb_search' });
  return c.text('好的，请输入电影或剧集名称。');
};

export const handleTmdbSearch = async (c: Context) => {
  const update = c.get('telegramUpdate');
  const text = update.message?.text;
  const chatId = update.message?.chat.id;
  const userStateService = c.env.USER_STATE_SERVICE;

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
                callback_data: `/tmdb:${item.id}:${item.media_type}`
            }]);
    
        });
    
        const inlineKeyboard: InlineKeyboardMarkup = {
            inline_keyboard: keyboard
        };
      return c.json({
        method: 'sendMessage',
        chat_id: chatId,
        text: '找到以下匹配项，请选择：',
        reply_markup: inlineKeyboard,
      });
  } catch (error) {
    console.error('TMDB 查询失败:', error);
    return c.text('查询 TMDB 时出错。', 500);
  } finally {
    await userStateService.updateState(chatId, { currentIntent: undefined }); // 清除状态
  }
};

const handleTmdbItemDetails = async (c: Context, itemId: number, mediaType: 'movie' | 'tv') => {
  const tmdbService = c.get('tmdbService');
  if (mediaType === 'movie') {
    const movieDetails = await tmdbService.getMovieDetails(itemId);
    let responseText = `🎬 ${movieDetails.title} (${movieDetails.release_date})`;
    responseText += `\n⭐️ 评分: ${movieDetails.vote_average.toFixed(1)}`;
    responseText += `\n📝 简介: ${movieDetails.overview || '暂无简介'}`;
    const telegramService = c.get('telegramService');
    const update = c.get('telegramUpdate');
    const chatId = update.message?.chat.id;
    telegramService.sendMessage(chatId, responseText);
    return c.text(responseText);
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