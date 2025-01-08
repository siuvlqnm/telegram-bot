import { Context } from 'hono';

export interface List {
    id?: number;
    user_id: number;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ListItem {
    id?: number;
    list_id: number;
    content: string;
    completed: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Tag {
    id?: number;
    name: string;
}

export class ListService {
    private db: D1Database;

    constructor(c: Context) {
        this.db = c.env.DB;
    }

    // Lists CRUD operations
    async createList(list: List): Promise<List> {
        const { user_id, name, description } = list;
        const result = await this.db.prepare(
            'INSERT INTO lists (user_id, name, description) VALUES (?, ?, ?) RETURNING *'
        ).bind(user_id, name, description).first<List>();
        return result!;
    }

    async getList(id: number): Promise<List | null> {
        return await this.db.prepare(
            'SELECT * FROM lists WHERE id = ?'
        ).bind(id).first<List>();
    }

    async getLists(user_id: number): Promise<List[]> {
        return await this.db.prepare(
            'SELECT * FROM lists WHERE user_id = ? ORDER BY updated_at DESC'
        ).bind(user_id).all<List>().then(result => result.results);
    }

    async updateList(id: number, list: Partial<List>): Promise<List | null> {
        const updates = Object.entries(list)
            .filter(([key]) => key !== 'id' && key !== 'created_at')
            .map(([key]) => `${key} = ?`)
            .join(', ');

        const values = Object.entries(list)
            .filter(([key]) => key !== 'id' && key !== 'created_at')
            .map(([_, value]) => value);

        const query = `
            UPDATE lists 
            SET ${updates}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? 
            RETURNING *
        `;

        return await this.db.prepare(query)
            .bind(...values, id)
            .first<List>();
    }

    async deleteList(id: number): Promise<void> {
        await this.db.prepare('DELETE FROM lists WHERE id = ?').bind(id).run();
    }

    // List items CRUD operations
    async addListItem(item: ListItem): Promise<ListItem> {
        const { list_id, content, completed } = item;
        const result = await this.db.prepare(
            'INSERT INTO list_items (list_id, content, completed) VALUES (?, ?, ?) RETURNING *'
        ).bind(list_id, content, completed).first<ListItem>();
        return result!;
    }

    async getListItems(list_id: number): Promise<ListItem[]> {
        return await this.db.prepare(
            'SELECT * FROM list_items WHERE list_id = ? ORDER BY created_at ASC'
        ).bind(list_id).all<ListItem>().then(result => result.results);
    }

    async updateListItem(id: number, item: Partial<ListItem>): Promise<ListItem | null> {
        const updates = Object.entries(item)
            .filter(([key]) => key !== 'id' && key !== 'created_at')
            .map(([key]) => `${key} = ?`)
            .join(', ');

        const values = Object.entries(item)
            .filter(([key]) => key !== 'id' && key !== 'created_at')
            .map(([_, value]) => value);

        const query = `
            UPDATE list_items 
            SET ${updates}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? 
            RETURNING *
        `;

        return await this.db.prepare(query)
            .bind(...values, id)
            .first<ListItem>();
    }

    async deleteListItem(id: number): Promise<void> {
        await this.db.prepare('DELETE FROM list_items WHERE id = ?').bind(id).run();
    }

    // Tags operations
    async createTag(name: string): Promise<Tag> {
        const result = await this.db.prepare(
            'INSERT INTO tags (name) VALUES (?) ON CONFLICT(name) DO UPDATE SET name = name RETURNING *'
        ).bind(name).first<Tag>();
        return result!;
    }

    async addTagToList(list_id: number, tag_id: number): Promise<void> {
        await this.db.prepare(
            'INSERT INTO list_tags (list_id, tag_id) VALUES (?, ?) ON CONFLICT DO NOTHING'
        ).bind(list_id, tag_id).run();
    }

    async removeTagFromList(list_id: number, tag_id: number): Promise<void> {
        await this.db.prepare(
            'DELETE FROM list_tags WHERE list_id = ? AND tag_id = ?'
        ).bind(list_id, tag_id).run();
    }

    async getListTags(list_id: number): Promise<Tag[]> {
        return await this.db.prepare(`
            SELECT t.* FROM tags t
            JOIN list_tags lt ON lt.tag_id = t.id
            WHERE lt.list_id = ?
        `).bind(list_id).all<Tag>().then(result => result.results);
    }
}