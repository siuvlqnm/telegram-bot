type UserState = 'IDLE' | 'CALC' | 'AI' | 'MODEL' | 'TMDB' | 'WEATHER';

export async function getUserState(kv: KVNamespace, userId: number): Promise<UserState> {
    const state = await kv.get(`user:${userId}:state`);
    return (state as UserState) || 'IDLE';
}

export async function setUserState(kv: KVNamespace, userId: number, state: UserState): Promise<void> {
    await kv.put(`user:${userId}:state`, state);
}