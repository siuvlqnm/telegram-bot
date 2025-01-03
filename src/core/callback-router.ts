// src/core/callback-router.ts
import { Context } from 'hono';
import * as TmdbCallbacks from '@/callbacks/tmdb';

const callbackHandlers: Record<string, (c: Context) => Promise<Response> | Response> = {
  'movie_details': TmdbCallbacks.handleMovieDetailsCallback,
  // ... 其他 callback 类型
};

export const handleCallbackQuery = async (c: Context) => {
  const update = await c.req.json();
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