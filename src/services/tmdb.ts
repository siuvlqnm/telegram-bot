// src/services/tmdb.ts
import axios from 'axios';

export interface multiSearchResult {
    results: Array<{
        // 基础信息
        id: number;                    // 条目ID
        title?: string;               // 电影标题（电影类型时存在）
        name?: string;                // 节目名称（电视节目类型时存在）
        media_type: string;           // 媒体类型（movie/tv/person）
        
        // 发布信息
        release_date?: string;        // 电影发布日期
        first_air_date?: string;      // 电视节目首播日期
        
        // 内容描述
        overview: string;             // 剧情简介
        adult: boolean;               // 是否成人内容，默认 true
        video: boolean;               // 是否有视频预告片，默认 true
        
        // 图片路径
        poster_path?: string;         // 海报图片路径
        backdrop_path?: string;       // 背景图片路径
        
        // 语言相关
        original_language: string;     // 原始语言
        original_title?: string;      // 原始标题
        
        // 分类与评分
        genre_ids: number[];          // 类型ID数组
        popularity: number;           // 热度值，默认 0
        vote_average: number;         // 平均评分，默认 0
        vote_count: number;           // 评分数量，默认 0
    }>;
}

export interface TmdbGenre {
    id: number;           // 类型ID
    name: string;         // 类型名称
}

export interface TmdbProductionCompany {
    id: number;           // 公司ID
    logo_path?: string;   // 公司logo路径
    name: string;         // 公司名称
    origin_country: string; // 公司所属国家
}

export interface TmdbProductionCountry {
    iso_3166_1: string;  // 国家代码
    name: string;        // 国家名称
}

export interface TmdbSpokenLanguage {
    english_name: string; // 英文名称
    iso_639_1: string;   // 语言代码
    name: string;        // 本地语言名称
}

export interface TmdbMovieDetail {
    // 基础信息
    id: number;                     // 电影ID
    title: string;                  // 电影标题
    original_title: string;         // 原始标题
    tagline: string;               // 标语
    overview: string;              // 剧情简介
    status: string;                // 状态

    // 分类与评分
    adult: boolean;                // 是否成人内容
    genres: TmdbGenre[];          // 电影类型
    popularity: number;            // 热度值，默认 0
    vote_average: number;          // 平均评分，默认 0
    vote_count: number;            // 评分数量，默认 0

    // 发布信息
    release_date: string;          // 发布日期
    runtime: number;               // 片长（分钟），默认 0
    video: boolean;                // 是否有视频预告片，默认 true

    // 图片与外部链接
    poster_path?: string;          // 海报图片路径
    backdrop_path?: string;        // 背景图片路径
    belongs_to_collection?: string; // 所属系列
    homepage?: string;             // 官网链接
    imdb_id?: string;              // IMDB ID

    // 制作相关
    budget: number;                // 预算，默认 0
    revenue: number;               // 票房收入，默认 0
    original_language: string;     // 原始语言
    production_companies: TmdbProductionCompany[];    // 制作公司
    production_countries: TmdbProductionCountry[];    // 制作国家
    spoken_languages: TmdbSpokenLanguage[];          // 对白语言
}

export interface TmdbCreator {
    id: number;           // 创作者ID
    credit_id: string;    // 演职人员ID
    name: string;         // 创作者名称
    gender: number;       // 性别，默认 0
    profile_path?: string; // 个人头像路径
}

export interface TmdbEpisodeBase {
    id: number;                // 剧集ID
    name: string;              // 剧集名称
    overview: string;          // 剧情简介
    vote_average: number;      // 平均评分，默认 0
    vote_count: number;        // 评分数量，默认 0
    air_date: string;          // 播出日期
    episode_number: number;    // 集数，默认 0
    production_code?: string;  // 制作代码
    runtime: number;           // 片长，默认 0
    season_number: number;     // 季数，默认 0
    show_id: number;          // 剧集ID，默认 0
    still_path?: string;      // 剧集截图路径
}

export interface TmdbNetwork {
    id: number;           // 网络ID
    logo_path?: string;   // 网络logo路径
    name: string;         // 网络名称
    origin_country: string; // 所属国家
}

export interface TmdbSeason {
    air_date?: string;        // 播出日期
    episode_count: number;    // 集数，默认 0
    id: number;              // 季ID
    name: string;            // 季名称
    overview: string;        // 剧情简介
    poster_path?: string;    // 海报路径
    season_number: number;   // 季数，默认 0
    vote_average: number;    // 平均评分，默认 0
}

export interface TmdbShowDetail {
    // 基础信息
    id: number;                     // 剧集ID
    name: string;                   // 剧集名称
    original_name: string;          // 原始名称
    type: string;                   // 类型
    tagline: string;               // 标语
    overview: string;              // 剧情简介
    status: string;                // 状态

    // 分类与评分
    adult: boolean;                // 是否成人内容
    genres: TmdbGenre[];          // 剧集类型
    popularity: number;            // 热度值，默认 0
    vote_average: number;          // 平均评分，默认 0
    vote_count: number;            // 评分数量，默认 0

    // 播出信息
    first_air_date: string;        // 首播日期
    last_air_date: string;         // 最后播出日期
    in_production: boolean;        // 是否在制作中，默认 true
    episode_run_time: number[];    // 单集时长数组
    number_of_episodes: number;    // 总集数，默认 0
    number_of_seasons: number;     // 总季数，默认 0

    // 最新集信息
    last_episode_to_air?: TmdbEpisodeBase;   // 最后播出的集
    next_episode_to_air?: TmdbEpisodeBase;   // 下一集播出信息

    // 图片与外部链接
    poster_path?: string;          // 海报图片路径
    backdrop_path?: string;        // 背景图片路径
    homepage?: string;             // 官网链接

    // 制作相关
    created_by: TmdbCreator[];     // 创作者
    networks: TmdbNetwork[];       // 播出网络
    languages: string[];           // 语言列表
    origin_country: string[];      // 原产国
    original_language: string;     // 原始语言
    production_companies: TmdbProductionCompany[];    // 制作公司
    production_countries: TmdbProductionCountry[];    // 制作国家
    spoken_languages: TmdbSpokenLanguage[];          // 对白语言
    
    // 季信息
    seasons: TmdbSeason[];         // 季列表
}

export class TmdbService {
  private apiKey: string;
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchMulti(query: string): Promise<multiSearchResult[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/search/multi`, {
        params: {
          api_key: this.apiKey,
          query: query,
          language: 'zh-CN',
          include_adult: true,
        },
      });
      return response.data.results;
    } catch (error) {
      console.error('TMDB API 请求失败:', error);
      throw error;
    }
  }

//   async searchMovie(query: string): Promise<TmdbMovie[]> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/search/movie`, {
//         params: {
//           api_key: this.apiKey,
//           query: query,
//         },
//       });
//       return response.data.results;
//     } catch (error) {
//       console.error('TMDB API 请求失败:', error);
//       throw error;
//     }
//   }

  async getMovieDetails(movieId: number): Promise<TmdbMovieDetail> {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/${movieId}`, {
        params: {
          api_key: this.apiKey,
          language: 'zh-CN',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`无法获取电影 ID ${movieId} 的详情:`, error);
      throw error;
    }
  }

//   async searchShow(query: string): Promise<TmdbShow[]> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/search/tv`, {
//         params: {
//           api_key: this.apiKey,
//           query: query,
//         },
//       });
//       return response.data.results;
//     } catch (error) {
//       console.error('TMDB API 请求失败 (搜索剧集):', error);
//       throw error;
//     }
//   }

  async getShowDetails(showId: number): Promise<TmdbShowDetail> {
    try {
      const response = await axios.get(`${this.baseUrl}/tv/${showId}`, {
        params: {
          api_key: this.apiKey,
          language: 'zh-CN',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`无法获取剧集 ID ${showId} 的详情:`, error);
      throw error;
    }
  }

  async getShowSeasons(showId: number): Promise<TmdbSeason[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/tv/${showId}/seasons`, {
        params: {
          api_key: this.apiKey,
          language: 'zh-CN',
        },
      });
      return response.data.seasons;
    } catch (error) {
      console.error(`无法获取剧集 ID ${showId} 的季信息:`, error);
      throw error;
    }
  }

//   async getSeasonEpisodes(showId: number, seasonNumber: number): Promise<TmdbEpisode[]> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/tv/${showId}/season/${seasonNumber}`, {
//         params: {
//           api_key: this.apiKey,
//         },
//       });
//       return response.data.episodes;
//     } catch (error) {
//       console.error(`无法获取剧集 ID ${showId} 的第 ${seasonNumber} 季的剧集信息:`, error);
//       throw error;
//     }
//   }
}

// 初始化 TMDB 服务
// const tmdbService = new TmdbService();
// export default tmdbService;