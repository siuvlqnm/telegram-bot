// src/core/callback-router.ts
import { Context } from 'hono';
import * as TmdbCallbacks from '@/callbacks/tmdb';
import * as ModelCallbacks from '@/callbacks/model';
import * as ProviderCallbacks from '@/callbacks/provider';

const callbackHandlers: Record<string, (c: Context) => Promise<Response> | Response> = {
  'set_provider': ProviderCallbacks.handleProviderCallback,
  'set_model': ModelCallbacks.handleModelCallback,
  'movie_details': TmdbCallbacks.handleTmdbMovieDetailsCallback,
  'tv_details': TmdbCallbacks.handleTmdbTvDetailsCallback,
  // ... 其他 callback 类型
};

export const handleCallbackQuery = async (c: Context) => {
  const update = c.get('telegramUpdate');
  const callbackQuery = update.callback_query;

  if (callbackQuery && callbackQuery.data) {
    const [callbackType] = callbackQuery.data.split(':');
    const handler = callbackHandlers[callbackType];
    if (handler) {
      return handler(c);
    } else {
      console.warn(`未知的 callback 类型: ${callbackType}`);
      return c.text('Unknown callback', 400);
    }
  }

  return c.text('Invalid callback query', 400);
};