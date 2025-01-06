// import { clearUserContext, getUserContextLength } from '@/contexts/chat-context';
// import { TELEGRAM_BOT_KV } from '@/config';
// import { sendMessage } from '@/utils/telegram';
// import { getUserState, setUserState } from '@/contexts/user-states';
// import { handleStart } from '@/handlers/start';
// // import { handleTextMessage } from '@/handlers/message';
// import { showPromptSelection } from '@/handlers/prompt-selection';
// import { setUserPrompt, getUserPrompt } from '@/contexts/prompt-states';
// import { handleTMDBCommand } from '@/handlers/tmdb';
// import { getUserModel } from '@/contexts/model-states';
// import { getModelByUniqueId } from '@/types/ai';
// import { handleAirQualityCommand } from '@/handlers/air-quality';
// import { handleWeatherCommand } from '@/handlers/weather';
// async function handleStatus(chatId: number) {
//     const kv = TELEGRAM_BOT_KV();
//     const state = await getUserState(kv, chatId);
//     const modelId = await getUserModel(kv, chatId);
//     const promptId = await getUserPrompt(kv, chatId);
//     const model = getModelByUniqueId(modelId);
//     const contextLength = await getUserContextLength(kv, chatId);

//     const stateDescriptions = {
//         'IDLE': '空闲状态，等待命令',
//         'AI': 'AI 对话模式',
//         'CALC': '计算器模式',
//         'TMDB': '影视搜索模式',
//         'MODEL': '模型选择模式',
//         'AIR': '空气质量查询模式',
//         'WEATHER': '天气查询模式'
//     };

//     const commandHelp = `📋 可用命令：\n\n/ai - 进入AI对话模式\n/calc - 进入计算器模式\n/tmdb - 搜索影视信息\n/model - 切换AI模型\n/prompt - 切换提示词模板\n/clear - 清除对话历史\n/air - 查询空气质量\n/status - 查看当前状态\n/weather - 查询天气`;

//     const statusMessage = `🤖 机器人当前状态：\n\n📱 当前模式：${state} (${stateDescriptions[state] || '未知状态'})\n🎯 当前模型：${model?.name || modelId}\n🏢 模型提供商：${model?.providerId || '未知'}\n📝 当前提示词：${promptId}\n💬 对话历史：${contextLength} 条消息\n${commandHelp}`;

//     await sendMessage(chatId, statusMessage);
// }

// export async function handleCommands(message: any) {
//     const chatId = message.chat.id;
//     const text = message.text;

//     switch (text) {
//         case '/start':
//         case '/cancel':
//             await setUserState(TELEGRAM_BOT_KV(), chatId, 'IDLE');
//             await handleStart(chatId);
//             return;
//         case '/clear':
//             await clearUserContext(TELEGRAM_BOT_KV(), chatId);
//             await setUserPrompt(TELEGRAM_BOT_KV(), chatId, 'default');
//             await sendMessage(chatId, "✨ 已清除对话历史");
//             return;
//         case '/model':
//             await clearUserContext(TELEGRAM_BOT_KV(), chatId);
//             await setUserPrompt(TELEGRAM_BOT_KV(), chatId, 'default');
//             await setUserState(TELEGRAM_BOT_KV(), chatId, 'IDLE');
//             await handleTextMessage(message, 'IDLE');
//             return;
//         case '/ai':
//             await setUserState(TELEGRAM_BOT_KV(), chatId, 'AI');
//             await handleTextMessage(message, 'AI');
//             return;
//         case '/calc':
//             await setUserState(TELEGRAM_BOT_KV(), chatId, 'CALC');
//             await handleTextMessage(message, 'CALC');
//             return;
//         case '/prompt':
//             await clearUserContext(TELEGRAM_BOT_KV(), chatId);
//             await setUserState(TELEGRAM_BOT_KV(), chatId, 'IDLE');
//             await showPromptSelection(chatId);
//             return;
//         case '/tmdb':
//             await setUserState(TELEGRAM_BOT_KV(), chatId, 'TMDB');
//             await sendMessage(chatId, '请输入要搜索的影视名称');
//             return;
//         case '/status':
//             await handleStatus(chatId);
//             return;
//         case '/air':
//             await setUserState(TELEGRAM_BOT_KV(), chatId, 'IDLE');
//             await handleAirQualityCommand(chatId);
//             return;
//         case '/weather':
//             await setUserState(TELEGRAM_BOT_KV(), chatId, 'WEATHER');
//             await sendMessage(chatId, '请输入经纬度，例如：28.16700304429513,113.0402297055291');
//             return;
//     }

//     const currentState = await getUserState(TELEGRAM_BOT_KV(), chatId);
//     switch (currentState) {
//         case 'CALC':
//             await handleTextMessage(message, 'CALC');
//             return;
//         case 'AI':
//             await handleTextMessage(message, 'AI');
//             return;
//         case 'TMDB':
//             await handleTMDBCommand(chatId, text);
//             return;
//         case 'WEATHER':
//             await handleWeatherCommand(chatId, text);
//             return;
//         default:
//             await handleStart(chatId);
//             return;
//     }
// }