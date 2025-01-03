// src/core/command-registry.ts
import { Context } from 'hono';

export interface Command {
  name: string;
  description: string;
  handler: (c: Context) => Promise<Response> | Response;
}

export class CommandRegistry {
  private commands: Map<string, Command> = new Map();

  register(command: Command): void {
    this.commands.set(command.name, command);
  }

  getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  getAllCommands(): Map<string, Command> {
    return this.commands;
  }
}