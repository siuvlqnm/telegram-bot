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
                callback_data: `${item.media_type}_details:${item.id}`
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
  const telegramService = c.get('telegramService');
  const update = c.get('telegramUpdate');
  const chatId = update.message?.chat.id;
  if (mediaType === 'movie') {
    const movieDetails = await tmdbService.getMovieDetails(itemId);
    let responseText = `🎬 ${movieDetails.title}\n`;
    responseText += `📅 上映日期: ${movieDetails.release_date ? new Date(movieDetails.release_date).toLocaleDateString('zh-CN') : '未知'}\n`;
    responseText += `⭐️ 评分: ${movieDetails.vote_average.toFixed(1)}\n`;
    responseText += `🏷️ 类型: ${movieDetails.genres.map((g: any) => g.name).join('、')}\n`;
    responseText += `🖼️ 海报: ${POSTER_BASE_URL}${movieDetails.poster_path}\n`;
    responseText += `📝 简介: ${movieDetails.overview || '暂无简介'}`;
    await telegramService.sendMessage(chatId, responseText);
    return c.text(`🎬 ${movieDetails.title} 已发送`);
  }
  if (mediaType === 'tv') {
    const showDetails = await tmdbService.getShowDetails(itemId);
    let responseText = `*📺 ${showDetails.name}*\n`;
    responseText += `📅 首播日期: ${showDetails.first_air_date ? new Date(showDetails.first_air_date).toLocaleDateString('zh-CN') : '未知'}\n`;
    responseText += `⭐️ 评分: ${showDetails.vote_average.toFixed(1)}\n`;
    responseText += `🏷️ 类型: ${showDetails.genres.map((g: any) => g.name).join('、')}\n`;
    responseText += `🖼️ 海报: ${POSTER_BASE_URL}${showDetails.poster_path}\n`;
    responseText += `📝 简介: ${showDetails.overview || '暂无简介'}\n\n`;
    responseText += `🎬 请选择季：`;

    // 上面部分展示剧集详情，下面部分展示剧集季数，并提供选择季数的功能
    const keyboard: InlineKeyboardButton[][] = [];
    showDetails.seasons.map((season: any) => {
        keyboard.push([{
            text: `${season.name} (${season.air_date ? new Date(season.air_date).toLocaleDateString('zh-CN') : '未知'})`,
            callback_data: `tmdb_seasons:${itemId}:${season.season_number}`
        }]);
    });
    const inlineKeyboard: InlineKeyboardMarkup = {
        inline_keyboard: keyboard
    };
    await telegramService.sendMessage(chatId, responseText, { reply_markup: inlineKeyboard, parse_mode: 'MarkdownV2' });
    return c.text(`📺 ${showDetails.name} 已发送`);
  }
};