// // src/modules/actions/set-reminder.ts
// import { Context } from 'hono';
// import { Task } from '@/core/task-registry';
// import { DateTime } from 'luxon';

// const setReminder: TaskHandler = async (c: Context, params: Record<string, any>) => {
//     const reminderService = c.get('reminderService');
//     const telegramService = c.get('telegramService');
//     const update = c.get('telegramUpdate');
//     const userId = update.message?.from.id;

//     const dateTimeStr = params.dateTime; // 假设 AI 返回的是日期时间字符串
//     const message = params.message;

//     if (!dateTimeStr || !message) {
//         await telegramService.sendMessage(userId, '请提供提醒的时间和内容。');
//         return;
//     }

//     try {
//         const parsedDateTime = DateTime.fromISO(dateTimeStr); // 需要根据 AI 返回的格式进行解析
//         if (!parsedDateTime.isValid) {
//             await telegramService.sendMessage(userId, '请提供有效的日期和时间。');
//             return;
//         }
//         await reminderService.setReminder(userId, parsedDateTime.toISO(), message);
//         await telegramService.sendMessage(userId, `好的，已设置提醒：${parsedDateTime.toLocaleString(DateTime.DATETIME_SHORT)} - ${message}`);
//     } catch (error: any) {
//         await telegramService.sendMessage(userId, `设置提醒失败：${error.message}`);
//     }
// };

// export default setReminder;