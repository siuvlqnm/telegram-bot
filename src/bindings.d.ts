// 添加 Cloudflare Workers 类型
/// <reference types="@cloudflare/workers-types" />

export interface Bindings {
    TELEGRAM_BOT_TOKEN: string;
    OPENROUTER_API_KEY: string;
    DEEPSEEK_API_KEY: string;
    GOOGLE_API_KEY: string;
    TELEGRAM_BOT_KV: KVNamespace;
    TMDB_API_KEY: string;
    MOONSHOT_API_KEY: string;
    AIR_MATTERS_API_KEY: string;
    ACCUWEATHER_API_KEY: string;
}