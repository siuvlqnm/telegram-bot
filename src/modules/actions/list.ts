import { Context } from 'hono';
import { ListModule } from '@/modules/list';

export const handleNewList = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const chatId = c.get('telegramUpdate').message?.chat.id;
    const messageText = c.get('telegramUpdate').message?.text || '';
    const [_, ...nameParts] = messageText.split(' ');
    const [name, description] = nameParts.join(' ').split('|').map((s: string) => s.trim());

    if (!name) {
        await telegramService.sendMessage(
            chatId,
            '❌ Please provide a list name in the format:\n/newlist List Name | Description (optional)'
        );
        return c.text('Invalid list name');
    }

    const listModule = new ListModule(c);
    const list = await listModule.createList(chatId, name, description);

    let message = `✅ List created successfully!\n\n📋 <b>${list.name}</b>\n`;
    if (list.description) {
        message += `📝 ${list.description}\n`;
    }

    const keyboard = [
        [
            { text: '➕ Add Item', callback_data: `add_item:${list.id}` },
            { text: '🏷 Add Tag', callback_data: `add_tag:${list.id}` }
        ]
    ];

    await telegramService.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard },
        parse_mode: 'HTML'
    });

    return c.text('List created');
};

export const handleAddItem = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const chatId = c.get('telegramUpdate').message?.chat.id;
    const messageText = c.get('telegramUpdate').message?.text || '';
    const [_, listId, ...contentParts] = messageText.split(' ');
    const content = contentParts.join(' ').trim();

    if (!listId || !content) {
        await telegramService.sendMessage(
            chatId,
            '❌ Please provide the list ID and item content in the format:\n/additem ListID Item Content'
        );
        return c.text('Invalid item data');
    }

    const listModule = new ListModule(c);
    const list = await listModule.getList(parseInt(listId));

    if (!list) {
        await telegramService.sendMessage(chatId, '❌ List not found');
        return c.text('List not found');
    }

    await listModule.addListItem(parseInt(listId), content);
    const items = await listModule.getListItems(parseInt(listId));
    const tags = await listModule.getListTags(parseInt(listId));

    let message = `📋 <b>${list.name}</b>\n`;
    if (list.description) {
        message += `📝 ${list.description}\n`;
    }
    if (tags.length > 0) {
        message += `\n🏷 Tags: ${tags.map(tag => `#${tag.name}`).join(' ')}\n`;
    }
    message += '\n📌 Items:\n';

    for (const item of items) {
        message += `   ${item.completed ? '✅' : '⬜️'} ${item.content}\n`;
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

    await telegramService.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard },
        parse_mode: 'HTML'
    });

    return c.text('Item added');
};

export const handleAddTag = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const chatId = c.get('telegramUpdate').message?.chat.id;
    const messageText = c.get('telegramUpdate').message?.text || '';
    const [_, listId, tagName] = messageText.split(' ');

    if (!listId || !tagName) {
        await telegramService.sendMessage(
            chatId,
            '❌ Please provide the list ID and tag name in the format:\n/addtag ListID TagName'
        );
        return c.text('Invalid tag data');
    }

    const listModule = new ListModule(c);
    const list = await listModule.getList(parseInt(listId));

    if (!list) {
        await telegramService.sendMessage(chatId, '❌ List not found');
        return c.text('List not found');
    }

    await listModule.addTag(parseInt(listId), tagName);
    const items = await listModule.getListItems(parseInt(listId));
    const tags = await listModule.getListTags(parseInt(listId));

    let message = `📋 <b>${list.name}</b>\n`;
    if (list.description) {
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

    await telegramService.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard },
        parse_mode: 'HTML'
    });

    return c.text('Tag added');
};

export const handleEditList = async (c: Context) => {
    const telegramService = c.get('telegramService');
    const chatId = c.get('telegramUpdate').message?.chat.id;
    const messageText = c.get('telegramUpdate').message?.text || '';
    const [_, listId, ...updateParts] = messageText.split(' ');
    const [name, description] = updateParts.join(' ').split('|').map((s: string) => s.trim());

    if (!listId || !name) {
        await telegramService.sendMessage(
            chatId,
            '❌ Please provide the list ID and new details in the format:\n/editlist ListID New Name | New Description'
        );
        return c.text('Invalid list data');
    }

    const listModule = new ListModule(c);
    const list = await listModule.updateList(parseInt(listId), { name, description });

    if (!list) {
        await telegramService.sendMessage(chatId, '❌ List not found');
        return c.text('List not found');
    }

    const items = await listModule.getListItems(parseInt(listId));
    const tags = await listModule.getListTags(parseInt(listId));

    let message = `📋 <b>${list.name}</b>\n`;
    if (list.description) {
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

    await telegramService.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard },
        parse_mode: 'HTML'
    });

    return c.text('List updated');
};