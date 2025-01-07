// src/core/task-registry.ts
import { Context } from 'hono';

export interface Task {
  name: string;
  description: string;
  handler: (c: Context, params: Record<string, any>) => Promise<void>;
}

export class TaskRegistry {
  private tasks: Map<string, Task> = new Map();

  register(task: Task): void {
    this.tasks.set(task.name, task);
  }

  getTask(name: string): Task | undefined {
    return this.tasks.get(name);
  }

  getAllTasks(): Map<string, Task> {
    return this.tasks;
  }
}

// export type TaskHandler = (c: Context, params: Record<string, any>) => Promise<void>;

// interface TaskRegistry {
//     [intent: string]: TaskHandler;
// }

// const taskRegistry: TaskRegistry = {};

// export function registerTask(intent: string, handler: TaskHandler) {
//     taskRegistry[intent] = handler;
// }

// export function getTaskHandler(intent: string): TaskHandler | undefined {
//     return taskRegistry[intent];
// }