// src/services/telegram.ts
import axios from 'axios';
import { TelegramUpdate } from '@/types/telegram';
export class TelegramService {
  private botToken: string;
  private apiUrl: string;

  constructor(botToken: string) {
    this.botToken = botToken;
    this.apiUrl = `https://api.telegram.org/bot${botToken}`;
  }

  async sendMessage(chatId: number, text: string, options?: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: chatId,
        text: text,
        ...options,
      });
      return response.data;
    } catch (error: any) {
      console.error('发送消息失败:', error.response?.data || error.message);
      throw error;
    }
  }

  async editMessageText(chatId: number, messageId: number, text: string, options?: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/editMessageText`, {
        chat_id: chatId,
        message_id: messageId,
        text: text,
        ...options,
      });
      return response.data;
    } catch (error: any) {
      console.error('编辑消息失败:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendPhoto(chatId: number, photo: string, options?: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/sendPhoto`, {
        chat_id: chatId,
        photo: photo,
        ...options,
      });
      return response.data;
    } catch (error: any) {
      console.error('发送照片失败:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendKeyboardMarkup(chatId: number, text: string, keyboard: any, options?: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: chatId,
        text: text,
        reply_markup: keyboard,
        ...options,
      });
      return response.data;
    } catch (error: any) {
      console.error('发送键盘消息失败:', error.response?.data || error.message);
      throw error;
    }
  }

  // 其他发送不同类型消息的方法 (例如 sendAudio, sendDocument 等)

  // 处理接收到的更新
  processUpdate(update: TelegramUpdate) {
    if (update.message) {
      this.handleMessage(update.message);
    } else if (update.callback_query) {
      this.handleCallbackQuery(update.callback_query);
    }
    // ... 处理其他类型的更新
  }

  private handleMessage(message: any) {
    console.log('收到消息:', message.text);
    // 在这里处理文本消息，可以根据命令分发到不同的处理器
  }

  private handleCallbackQuery(callbackQuery: any) {
    console.log('收到回调查询:', callbackQuery.data);
    // 在这里处理回调查询，可以根据 callback_data 分发到不同的处理器
  }
}

// 注意：不再在此处直接初始化，而是在全局赋值中间件中初始化
// const telegramService = new TelegramService(config.telegramBotToken);
// export default telegramService;