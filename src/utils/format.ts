/**
 * 转义 Telegram MarkdownV2 格式的特殊字符
 * @param text 需要转义的文本
 * @returns 转义后的文本
 */
export function escapeMarkdown(text: string): string {
  if (!text) return '';
  // 转义所有 Telegram MarkdownV2 特殊字符
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

/**
 * 格式化 Telegram 消息文本
 * @param text 需要发送的文本
 * @returns 格式化后的文本
 */
export function formatMessage(text: string): string {
  return escapeMarkdown(text);
}

/**
 * 格式化带有 Markdown 语法的文本
 * @param text 原始文本
 * @param format 是否启用 Markdown 格式化
 * @returns 格式化后的文本
 */
export function formatMarkdown(text: string, format = true): string {
  if (!format) return escapeMarkdown(text);
  
  // 如果需要保留 Markdown 格式，先用占位符替换
  const placeholder = '§§§';
  let count = 0;
  const tokens: string[] = [];

  // 保存 Markdown 标记
  const preserved = text.replace(/\*(.*?)\*/g, (match) => {
    tokens.push(match);
    return `${placeholder}${count++}`;
  });

  // 转义其他所有特殊字符
  const escaped = escapeMarkdown(preserved);

  // 恢复 Markdown 标记
  return escaped.replace(new RegExp(`${placeholder}(\\d+)`, 'g'), (_, index) => tokens[+index]);
} 