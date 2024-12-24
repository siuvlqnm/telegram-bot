import { TMDB_API_KEY } from '@/config';
import { sendMessage } from '@/utils/telegram';

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

export async function handleTMDBCommand(chatId: number, query: string) {
    if (!query) {
        await sendMessage(chatId, '请输入要搜索的电影或剧集名称');
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

        // 只处理前 5 个结果
        const results = data.results.slice(0, 5);
        
        for (const item of results) {
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
        }

        if (data.results.length > 5) {
            await sendMessage(chatId, `还有 ${data.results.length - 5} 个结果未显示，请尝试更精确的搜索词。`);
        }

    } catch (error) {
        console.error('TMDB search error:', error);
        await sendMessage(chatId, '搜索时出错，请稍后重试');
    }
} 