import { Context } from 'hono';
import { ListService } from '@/services/list';
import { AIProvider } from '@/services/ai/ai-provider';

export class ListModule {
    private listService: ListService;
    private provider?: AIProvider;

    constructor(c: Context) {
        this.listService = new ListService(c);
        // 获取 AI provider
        const aiModule = c.get('aiModule');
        this.provider = aiModule.getProvider('deepseek');
    }

    // 处理自然语言的列表操作请求
    async processListCommand(chatId: number, text: string) {
        if (!this.provider) {
            throw new Error('AI provider not found');
        }

        const tools = [
            {
                type: "function",
                function: {
                    name: "create_list",
                    description: "创建一个新的列表",
                    parameters: {
                        type: "object",
                        properties: {
                            name: { type: "string", description: "列表名称" },
                            description: { type: "string", description: "列表描述（可选）" }
                        },
                        required: ["name"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "add_list_item",
                    description: "向列表添加一个项目",
                    parameters: {
                        type: "object",
                        properties: {
                            list_id: { type: "number", description: "列表ID" },
                            content: { type: "string", description: "项目内容" }
                        },
                        required: ["list_id", "content"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "add_list_tag",
                    description: "为列表添加标签",
                    parameters: {
                        type: "object",
                        properties: {
                            list_id: { type: "number", description: "列表ID" },
                            tag_name: { type: "string", description: "标签名称" }
                        },
                        required: ["list_id", "tag_name"]
                    }
                }
            }
        ];

        const messages = [
            {
                role: 'system',
                content: `你是一个智能列表助手，帮助用户管理他们的列表。
                当用户想要：
                1. 创建列表时，使用 create_list 函数
                2. 添加列表项时，使用 add_list_item 函数
                3. 添加标签时，使用 add_list_tag 函数
                请分析用户的自然语言输入，理解他们的意图，并调用相应的函数。`
            },
            {
                role: 'user',
                content: text
            }
        ];

        const response = await this.provider.generateText(messages, 'deepseek-chat', { tools });
        
        if (response.type === 'tool_calls') {
            const { name, arguments: args } = response.content;
            
            switch (name) {
                case 'create_list':
                    return await this.createList(chatId, args.name, args.description);
                case 'add_list_item':
                    return await this.addListItem(args.list_id, args.content);
                case 'add_list_tag':
                    return await this.addTag(args.list_id, args.tag_name);
                default:
                    throw new Error(`Unknown function: ${name}`);
            }
        }

        return null;
    }

    async createList(userId: number, name: string, description?: string) {
        return await this.listService.createList({
            user_id: userId,
            name,
            description
        });
    }

    async getLists(userId: number) {
        return await this.listService.getLists(userId);
    }

    async getList(listId: number) {
        return await this.listService.getList(listId);
    }

    async updateList(listId: number, updates: { name?: string; description?: string }) {
        return await this.listService.updateList(listId, updates);
    }

    async deleteList(listId: number) {
        await this.listService.deleteList(listId);
    }

    async addListItem(listId: number, content: string) {
        return await this.listService.addListItem({
            list_id: listId,
            content,
            completed: false
        });
    }

    async getListItems(listId: number) {
        return await this.listService.getListItems(listId);
    }

    async toggleListItem(itemId: number, completed: boolean) {
        return await this.listService.updateListItem(itemId, { completed });
    }

    async deleteListItem(itemId: number) {
        await this.listService.deleteListItem(itemId);
    }

    async addTag(listId: number, tagName: string) {
        const tag = await this.listService.createTag(tagName);
        await this.listService.addTagToList(listId, tag.id!);
        return tag;
    }

    async removeTag(listId: number, tagId: number) {
        await this.listService.removeTagFromList(listId, tagId);
    }

    async getListTags(listId: number) {
        return await this.listService.getListTags(listId);
    }
}