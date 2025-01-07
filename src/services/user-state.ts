// src/services/user-state.ts
export interface UserState {
  currentIntent?: string;
  // 其他状态属性
  preferredModelProvider?: string;
  preferredModel?: string;
  chatContext?: any[];
  [key: string]: any;
}

export class UserStateService {
  private kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  async getState(chatId: number): Promise<UserState | undefined> {
    const raw = await this.kv.get(`user-state:${chatId}`);
    return raw ? JSON.parse(raw) : undefined;
  }

  async setState(chatId: number, state: UserState): Promise<void> {
    await this.kv.put(`user-state:${chatId}`, JSON.stringify(state));
  }

  async updateState(chatId: number, updates: Partial<UserState>): Promise<void> {
    const currentState = await this.getState(chatId) || {};
    const newState = { ...currentState, ...updates };
    await this.setState(chatId, newState);
  }

  async clearState(chatId: number): Promise<void> {
    await this.kv.delete(`user-state:${chatId}`);
  }
}