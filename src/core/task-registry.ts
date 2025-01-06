// src/core/task-registry.ts
import { Context } from 'hono';

export type TaskHandler = (c: Context, params: Record<string, any>) => Promise<void>;

interface TaskRegistry {
    [intent: string]: TaskHandler;
}

const taskRegistry: TaskRegistry = {};

export function registerTask(intent: string, handler: TaskHandler) {
    taskRegistry[intent] = handler;
}

export function getTaskHandler(intent: string): TaskHandler | undefined {
    return taskRegistry[intent];
}