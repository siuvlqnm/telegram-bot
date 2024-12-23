export async function getUserPrompt(kv: KVNamespace, userId: number): Promise<string> {
    const promptId = await kv.get(`user:${userId}:prompt`);
    return promptId || 'default';
}

export async function setUserPrompt(kv: KVNamespace, userId: number, promptId: string): Promise<void> {
    await kv.put(`user:${userId}:prompt`, promptId);
} 