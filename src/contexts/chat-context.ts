export async function getUserContext(kv: KVNamespace, chatId: number) {
    const context = await kv.get(`chat:${chatId}:context`);
    return context ? JSON.parse(context) : [];
}

export async function setUserContext(kv: KVNamespace, chatId: number, messages: any[]) {
    await kv.put(`chat:${chatId}:context`, JSON.stringify(messages));
}

export async function clearUserContext(kv: KVNamespace, userId: number) {
    await kv.delete(`chat:${userId}:context`);
}

// 可选：添加获取上下文长度的方法
export async function getUserContextLength(kv: KVNamespace, userId: number): Promise<number> {
    const context = await getUserContext(kv, userId);
    return context.length;
} 