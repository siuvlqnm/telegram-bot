import { Bindings } from '@/bindings';

let config: Bindings;

export function initializeConfig(env: Bindings) {
  config = env;
}

export function getConfig() {
  if (!config) {
    throw new Error("Config not initialized. Ensure initializeConfig is called.");
  }
  return config;
}

export const TELEGRAM_BOT_TOKEN = () => getConfig().TELEGRAM_BOT_TOKEN;
export const OPENROUTER_API_KEY = () => getConfig().OPENROUTER_API_KEY;
export const DEEPSEEK_API_KEY = () => getConfig().DEEPSEEK_API_KEY;
export const GOOGLE_API_KEY = () => getConfig().GOOGLE_API_KEY;
export const TELEGRAM_BOT_KV = () => getConfig().TELEGRAM_BOT_KV;
export const TMDB_API_KEY = () => getConfig().TMDB_API_KEY;
export const MOONSHOT_API_KEY = () => getConfig().MOONSHOT_API_KEY;
export const AIR_MATTERS_API_KEY = () => getConfig().AIR_MATTERS_API_KEY;
export const ACCUWEATHER_API_KEY = () => getConfig().ACCUWEATHER_API_KEY;
// 可以根据需要添加其他配置项的访问函数