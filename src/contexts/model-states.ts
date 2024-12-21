export async function getUserModel(kv: KVNamespace, userId: number): Promise<string> {
    const modelId = await kv.get(`user:${userId}:model`);
    return modelId || 'google/gemini-2.0-flash-exp:free'; // 默认模型
}

export async function setUserModel(kv: KVNamespace, userId: number, modelId: string) {
    await kv.put(`user:${userId}:model`, modelId);
}