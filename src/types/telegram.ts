export interface TelegramUser {
    id: number; // 用户ID
    is_bot: boolean; // 是否是机器人
    first_name: string; // 用户名
    last_name?: string; // 用户姓
    username?: string; // 用户昵称
    language_code?: string; // 语言代码
 }
 
 export interface TelegramChat {
    id: number; // 聊天ID  
    first_name: string; // 聊天名
    last_name?: string; // 聊天姓
    username?: string; // 聊天昵称
    type: string; // 聊天类型
 }
 
 export interface TelegramEntity {
    offset: number; // 实体偏移量
    length: number; // 实体长度
    type: string; // 实体类型
 }
 
 export interface TelegramMessage {
    message_id: number; // 消息ID
    from: TelegramUser; // 发送者
    chat: TelegramChat; // 聊天
    date: number; // 发送时间
    text?: string; // 消息内容
    entities?: TelegramEntity[]; // 消息实体
 }
 
 export interface TelegramUpdate {
    update_id: number; // 更新ID
    message?: TelegramMessage; // 消息
 }