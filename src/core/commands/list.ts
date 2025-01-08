import { Context } from 'hono';
import { ListModule } from '@/modules/list';

export const startListCommand = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const chatId = c.get('telegramUpdate').message?.chat.id;
    const listModule = new ListModule(c);
    const lists = await listModule.getLists(chatId);

    let message = '📝 您的列表:\n\n';
    if (lists.length === 0) {
        message = '📝 您还没有创建任何列表。使用 /newlist 创建一个新列表，或直接告诉我您想创建什么列表。';
    } else {
        for (const list of lists) {
            message += `📋 ${list.name}\n`;
            if (list.description) {
                message += `   ${list.description}\n`;
            }
            message += `   /list_${list.id}\n\n`;
        }
    }

    const keyboard = [
        [{ text: '➕ 新建列表', callback_data: 'new_list' }],
    ];

    await telegramService.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard },
        parse_mode: 'HTML'
    });

    return c.text('Lists command executed');
};

export const showListCommand = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const chatId = c.get('telegramUpdate').message?.chat.id;
    const messageText = c.get('telegramUpdate').message?.text || '';
    const listId = parseInt(messageText.split('_')[1]);

    const listModule = new ListModule(c);
    const list = await listModule.getList(listId);
    
    if (!list) {
        await telegramService.sendMessage(chatId, '❌ 列表未找到');
        return c.text('List not found');
    }

    const items = await listModule.getListItems(listId);
    const tags = await listModule.getListTags(listId);

    let message = `📋 <b>${list.name}</b>\n`;
    if (list.description) {
        message += `📝 ${list.description}\n`;
    }
    if (tags.length > 0) {
        message += `\n🏷 标签: ${tags.map(tag => `#${tag.name}`).join(' ')}\n`;
    }
    message += '\n📌 项目:\n';

    if (items.length === 0) {
        message += '   还没有添加任何项目\n';
    } else {
        for (const item of items) {
            message += `   ${item.completed ? '✅' : '⬜️'} ${item.content}\n`;
        }
    }

    const keyboard = [
        [
            { text: '➕ 添加项目', callback_data: `add_item:${listId}` },
            { text: '🏷 添加标签', callback_data: `add_tag:${listId}` }
        ],
        [
            { text: '✏️ 编辑列表', callback_data: `edit_list:${listId}` },
            { text: '🗑 删除列表', callback_data: `delete_list:${listId}` }
        ]
    ];

    await telegramService.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard },
        parse_mode: 'HTML'
    });

    return c.text('List details shown');
};

// 新增：处理自然语言的列表操作
export const handleListCommand = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const chatId = c.get('telegramUpdate').message?.chat.id;
    const messageText = c.get('telegramUpdate').message?.text || '';

    const listModule = new ListModule(c);
    try {
        const result = await listModule.processListCommand(chatId, messageText);
        if (result) {
            let message = '✅ 操作成功！\n\n';
            if ('name' in result) {
                // 如果是创建列表的结果
                message += `📋 <b>${result.name}</b>\n`;
                // if (result.description) {
                //     message += `📝 ${result.description}\n`;
                // }
                const keyboard = [
                    [
                        { text: '➕ 添加项目', callback_data: `add_item:${result.id}` },
                        { text: '🏷 添加标签', callback_data: `add_tag:${result.id}` }
                    ]
                ];
                await telegramService.sendMessage(chatId, message, {
                    reply_markup: { inline_keyboard: keyboard },
                    parse_mode: 'HTML'
                });
            } else {
                // 如果是添加项目或标签的结果
                const list = await listModule.getList(result.list_id);
                const items = await listModule.getListItems(result.list_id);
                const tags = await listModule.getListTags(result.list_id);

                message = `📋 <b>${list?.name}</b>\n`;
                if (list?.description) {
                    message += `📝 ${list.description}\n`;
                }
                if (tags.length > 0) {
                    message += `\n🏷 标签: ${tags.map(tag => `#${tag.name}`).join(' ')}\n`;
                }
                message += '\n📌 项目:\n';

                for (const item of items) {
                    message += `   ${item.completed ? '✅' : '⬜️'} ${item.content}\n`;
                }

                const keyboard = [
                    [
                        { text: '➕ 添加项目', callback_data: `add_item:${result.list_id}` },
                        { text: '🏷 添加标签', callback_data: `add_tag:${result.list_id}` }
                    ],
                    [
                        { text: '✏️ 编辑列表', callback_data: `edit_list:${result.list_id}` },
                        { text: '🗑 删除列表', callback_data: `delete_list:${result.list_id}` }
                    ]
                ];

                await telegramService.sendMessage(chatId, message, {
                    reply_markup: { inline_keyboard: keyboard },
                    parse_mode: 'HTML'
                });
            }
        } else {
            await telegramService.sendMessage(chatId, '❌ 抱歉，我没有理解您的意思。请尝试更清晰的表达，或使用命令来操作列表。');
        }
    } catch (error) {
        console.error('处理列表命令时出错:', error);
        await telegramService.sendMessage(chatId, '❌ 操作失败，请稍后重试。');
    }

    return c.text('List command handled');
};