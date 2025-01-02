import { Context } from 'hono';

export const tmdbCommand = async (c: Context) => {
  const update = await c.req.json();
  const userId = update.message.from.id;

  // 设置用户状态为 '/tmdb'
//   setUserState(userId, { command: '/tmdb' });

  return c.text('请输入电影名称:');
};

export const handleMovieQuery = async (c: Context) => {
  const update = c.get('telegramUpdate');
  const userId = update.message?.from.id;
  const movieName = update.message?.text;

  // 获取用户状态
//   const state = getUserState(userId);
//   if (state?.command === '/tmdb') {
//     try {
//       const movies = await TMDBService.searchMovie(movieName);
//       clearUserState(userId); // 清除状态
//       return c.text(`找到的电影: ${movies.map(m => m.title).join(', ')}`);
//     } catch (error) {
//       return c.text('查询电影失败，请重试。');
//     }
//   }

  return c.text('未知命令。');
};