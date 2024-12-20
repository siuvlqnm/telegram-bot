import { Bindings } from '@/bindings';

// 全局环境变量
export const env: Bindings = (globalThis as any).process?.env ?? globalThis;