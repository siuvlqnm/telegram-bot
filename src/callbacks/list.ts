import { Context } from 'hono';
import { ListModule } from '@/modules/list';

export const handleNewListCallback = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const chatId = c.get('telegramUpdate').callback_query?.message?.chat.id;
    const messageId = c.get('telegramUpdate').callback_query?.message?.message_id;

    await telegramService.editMessageText(
        chatId,
        messageId,
        '📝 Please send the list name in the following format:\n/newlist List Name | Description (optional)',
        { parse_mode: 'HTML' }
    );

    return c.text('New list callback handled');
};

export const handleAddItemCallback = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const callbackQuery = c.get('telegramUpdate').callback_query;
    const chatId = callbackQuery?.message?.chat.id;
    const messageId = callbackQuery?.message?.message_id;
    const [_, listId] = callbackQuery?.data?.split(':') || [];

    await telegramService.editMessageText(
        chatId,
        messageId,
        `📝 Please send the item content in the following format:\n/additem ${listId} Item Content`,
        { parse_mode: 'HTML' }
    );

    return c.text('Add item callback handled');
};

export const handleAddTagCallback = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const callbackQuery = c.get('telegramUpdate').callback_query;
    const chatId = callbackQuery?.message?.chat.id;
    const messageId = callbackQuery?.message?.message_id;
    const [_, listId] = callbackQuery?.data?.split(':') || [];

    await telegramService.editMessageText(
        chatId,
        messageId,
        `🏷 Please send the tag name in the following format:\n/addtag ${listId} TagName`,
        { parse_mode: 'HTML' }
    );

    return c.text('Add tag callback handled');
};

export const handleEditListCallback = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const callbackQuery = c.get('telegramUpdate').callback_query;
    const chatId = callbackQuery?.message?.chat.id;
    const messageId = callbackQuery?.message?.message_id;
    const [_, listId] = callbackQuery?.data?.split(':') || [];

    await telegramService.editMessageText(
        chatId,
        messageId,
        `✏️ Please send the updated list details in the following format:\n/editlist ${listId} New Name | New Description`,
        { parse_mode: 'HTML' }
    );

    return c.text('Edit list callback handled');
};

export const handleDeleteListCallback = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const callbackQuery = c.get('telegramUpdate').callback_query;
    const chatId = callbackQuery?.message?.chat.id;
    const messageId = callbackQuery?.message?.message_id;
    const [_, listId] = callbackQuery?.data?.split(':') || [];

    const keyboard = [
        [
            { text: '✅ Yes', callback_data: `confirm_delete_list:${listId}` },
            { text: '❌ No', callback_data: `cancel_delete_list:${listId}` }
        ]
    ];

    await telegramService.editMessageText(
        chatId,
        messageId,
        '❗️ Are you sure you want to delete this list? This action cannot be undone.',
        {
            reply_markup: { inline_keyboard: keyboard },
            parse_mode: 'HTML'
        }
    );

    return c.text('Delete list callback handled');
};

export const handleConfirmDeleteListCallback = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const callbackQuery = c.get('telegramUpdate').callback_query;
    const chatId = callbackQuery?.message?.chat.id;
    const messageId = callbackQuery?.message?.message_id;
    const [_, listId] = callbackQuery?.data?.split(':') || [];

    const listModule = new ListModule(c);
    await listModule.deleteList(parseInt(listId));

    await telegramService.editMessageText(
        chatId,
        messageId,
        '✅ List deleted successfully.',
        { parse_mode: 'HTML' }
    );

    return c.text('List deleted');
};

export const handleCancelDeleteListCallback = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const callbackQuery = c.get('telegramUpdate').callback_query;
    const chatId = callbackQuery?.message?.chat.id;
    const messageId = callbackQuery?.message?.message_id;
    const [_, listId] = callbackQuery?.data?.split(':') || [];

    const listModule = new ListModule(c);
    const list = await listModule.getList(parseInt(listId));
    const items = await listModule.getListItems(parseInt(listId));
    const tags = await listModule.getListTags(parseInt(listId));

    let message = `📋 <b>${list?.name}</b>\n`;
    if (list?.description) {
        message += `📝 ${list.description}\n`;
    }
    if (tags.length > 0) {
        message += `\n🏷 Tags: ${tags.map(tag => `#${tag.name}`).join(' ')}\n`;
    }
    message += '\n📌 Items:\n';

    if (items.length === 0) {
        message += '   No items yet\n';
    } else {
        for (const item of items) {
            message += `   ${item.completed ? '✅' : '⬜️'} ${item.content}\n`;
        }
    }

    const keyboard = [
        [
            { text: '➕ Add Item', callback_data: `add_item:${listId}` },
            { text: '🏷 Add Tag', callback_data: `add_tag:${listId}` }
        ],
        [
            { text: '✏️ Edit List', callback_data: `edit_list:${listId}` },
            { text: '🗑 Delete List', callback_data: `delete_list:${listId}` }
        ]
    ];

    await telegramService.editMessageText(chatId, messageId, message, {
        reply_markup: { inline_keyboard: keyboard },
        parse_mode: 'HTML'
    });

    return c.text('Delete cancelled');
};