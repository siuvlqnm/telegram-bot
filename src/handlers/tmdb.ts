import { TMDB_API_KEY } from '@/config';
import { sendMessage } from '@/utils/telegram';
import { InlineKeyboardButton, InlineKeyboardMarkup } from '@/types/telegram';
const TMDB_API_BASE = 'https://api.themoviedb.org/3';

interface TMDBSearchResult {
    results: Array<{
        id: number;
        title?: string;
        name?: string;
        release_date?: string;
        first_air_date?: string;
        vote_average: number;
        overview: string;
        media_type?: string;
        poster_path?: string;
        genre_ids: number[];
    }>;
}

interface TMDBGenres {
    genres: Array<{
        id: number;
        name: string;
    }>;
}

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function fetchGenres(type: 'movie' | 'tv'): Promise<Map<number, string>> {
    const response = await fetch(
        `${TMDB_API_BASE}/genre/${type}/list?api_key=${TMDB_API_KEY()}&language=zh-CN`
    );
    const data: TMDBGenres = await response.json();
    return new Map(data.genres.map(genre => [genre.id, genre.name]));
}

interface TMDBDetailResult {
    id: number;
    title?: string;          // 电影标题
    name?: string;           // 剧集名称
    release_date?: string;   // 电影上映日期
    first_air_date?: string; // 剧集首播日期
    vote_average: number;    // 评分
    overview: string;        // 简介
    poster_path?: string;    // 海报路径
    genres: Array<{         // 类型
        id: number;
        name: string;
    }>;
}

export async function handleTMDBCommand(chatId: number, query: string) {
    if (!query) {
        await sendMessage(chatId, '请输入要搜索的影视名称');
        return;
    }

    try {
        // 使用多媒体搜索 API
        const response = await fetch(
            `${TMDB_API_BASE}/search/multi?api_key=${TMDB_API_KEY()}&query=${encodeURIComponent(query)}&language=zh-CN&page=1`
        );

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data: TMDBSearchResult = await response.json();

        if (data.results.length === 0) {
            await sendMessage(chatId, '未找到相关内容');
            return;
        }

        // 获取电影和剧集的类型映射
        const [movieGenres, tvGenres] = await Promise.all([
            fetchGenres('movie'),
            fetchGenres('tv')
        ]);

        if (data.results.length === 1) {
            const item = data.results[0];
            const isMovie = item.media_type === 'movie';
            const title = isMovie ? item.title : item.name;
            const releaseDate = isMovie ? item.release_date : item.first_air_date;
            const type = isMovie ? '电影' : '剧集';
            
            // 获取类型名称
            const genres = isMovie ? movieGenres : tvGenres;
            const genreNames = item.genre_ids
                .map(id => genres.get(id))
                .filter(name => name)
                .join('、');

            // 格式化日期
            const formattedDate = releaseDate ? new Date(releaseDate).toLocaleDateString('zh-CN') : '未知';
            
            // 构建消息
            let message = `🎬 ${title} (${type})\n`;
            message += `📅 上映日期: ${formattedDate}\n`;
            message += `⭐️ 评分: ${item.vote_average.toFixed(1)}\n`;
            if (genreNames) {
                message += `🏷️ 类型: ${genreNames}\n`;
            }
            if (item.poster_path) {
                message += `🖼️ 海报: ${POSTER_BASE_URL}${item.poster_path}\n`;
            }
            message += `\n📝 简介: ${item.overview || '暂无简介'}`;

            await sendMessage(chatId, message);
            return;
        }

        let summaryMessage = '🔍 搜索结果：\n\n';
        const keyboard: InlineKeyboardButton[][] = [];
        data.results.forEach((item, index) => {
            const isMovie = item.media_type === 'movie';
            const title = isMovie ? item.title : item.name;
            const releaseDate = isMovie ? item.release_date : item.first_air_date;
            const year = releaseDate ? new Date(releaseDate).getFullYear() : '未知';
            const type = isMovie ? '电影' : '剧集';

            summaryMessage += `${index + 1}. ${title} (${year} ${type}) ⭐️ ${item.vote_average.toFixed(1)}\n`;

            // 为每个结果创建一个按钮
            keyboard.push([{
                text: `${index + 1}. ${title} (${year})`,
                callback_data: `tmdb:${item.id}:${item.media_type}`
            }]);

        });

        const inlineKeyboard: InlineKeyboardMarkup = {
            inline_keyboard: keyboard
        };
    
        // 发送带有内联键盘的消息
        await sendMessage(chatId, summaryMessage, { reply_markup: inlineKeyboard });
    } catch (error) {
        console.error('TMDB search error:', error);
        await sendMessage(chatId, '搜索时出错，请稍后重试');
    }
} 

export async function handleTMDBCallback(callbackQuery: any) {
    const [_, tmdbId, mediaType] = callbackQuery.data.split(':');
    const chatId = callbackQuery.message.chat.id;

    try {
        // 获取详细信息
        const response = await fetch(
            `${TMDB_API_BASE}/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY()}&language=zh-CN`
        );

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const item: TMDBDetailResult = await response.json();
        const genres = item.genres.map(g => g.name).join('、');
        const releaseDate = mediaType === 'movie' ? item.release_date : item.first_air_date;
        const title = mediaType === 'movie' ? item.title : item.name;
        const type = mediaType === 'movie' ? '电影' : '剧集';

        // 构建详细信息消息
        let message = `🎬 ${title} (${type})\n`;
        message += `📅 上映日期: ${releaseDate ? new Date(releaseDate).toLocaleDateString('zh-CN') : '未知'}\n`;
        message += `⭐️ 评分: ${item.vote_average.toFixed(1)}\n`;
        if (genres) {
            message += `🏷️ 类型: ${genres}\n`;
        }
        if (item.poster_path) {
            message += `🖼️ 海报: ${POSTER_BASE_URL}${item.poster_path}\n`;
        }
        message += `\n📝 简介: ${item.overview || '暂无简介'}`;

        await sendMessage(chatId, message);
    } catch (error) {
        console.error('TMDB detail fetch error:', error);
        await sendMessage(chatId, '获取详情时出错，请稍后重试');
    }
}