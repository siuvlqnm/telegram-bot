// 添加 Cloudflare Workers 类型
/// <reference types="@cloudflare/workers-types" />

export type Bindings = {
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_BOT_KV: KVNamespace;
};