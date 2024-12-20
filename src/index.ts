import { Hono } from 'hono';
import { z } from 'zod';
import { cors } from 'hono/cors';
import { Bindings } from './bindings';

const app = new Hono<{ Bindings: Bindings }>();

// 开启跨域资源共享（CORS）
app.use('/*', cors());

// 定义 Telegram Update 的数据结构
const telegramUpdateSchema = z.object({
   update_id: z.number(),
   message: z
      .object({
         message_id: z.number(),
         from: z.object({
            id: z.number(),
            is_bot: z.boolean(),
            first_name: z.string(),
            last_name: z.string().optional(),
            username: z.string().optional(),
            language_code: z.string().optional(),
         }),
         chat: z.object({
            id: z.number(),
            first_name: z.string(),
            last_name: z.string().optional(),
            username: z.string().optional(),
            type: z.string(),
         }),
         date: z.number(),
         text: z.string().optional(),
         entities: z
            .array(
               z.object({
                  offset: z.number(),
                  length: z.number(),
                  type: z.string(),
               }),
            )
            .optional(),
      })
      .optional(),
});

// 定义发送消息的函数
async function sendMessage(chat_id: number, text: string, botToken: string) {
   if (!botToken) {
      console.error('Telegram Bot token not found in environment variables.');
      return;
   }
   
   const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
   const payload = {
      chat_id,
      text,
   };

   try {
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(payload),
      });

      if (!response.ok) {
         console.error(`Failed to send message to chat ${chat_id}: ${response.status} - ${response.statusText}`);
      }
   } catch (error) {
      console.error(`Error sending message to chat ${chat_id}:`, error);
   }
}

// 处理 Telegram Webhook
app.post('/', async (c) => {
   try {
      const body = await c.req.json();
      const update = telegramUpdateSchema.safeParse(body);

      if (!update.success) {
         console.error('Invalid Telegram Update:', update.error);
         return c.json({ message: 'Invalid Telegram Update' }, 400);
      }
      const message = update.data.message;
      if (message?.text) {
          const chatId = message.chat.id;
          if (message.text === '/start') {
              await sendMessage(chatId, "你好，我是你的 Hono Bot！", c.env.TELEGRAM_BOT_TOKEN)
          }
          else {
              await sendMessage(chatId, `你发送了: ${message.text}`, c.env.TELEGRAM_BOT_TOKEN)
          }
      }


      return c.json({ message: 'OK' }, 200);
   } catch (error) {
      console.error('Error processing update:', error);
      return c.json({ message: 'Error processing update' }, 500);
   }
});


export default app;