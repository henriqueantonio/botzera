import { Collection } from 'discord.js';
import path from 'path';
import fs from 'fs';

import { Command } from './commands/Command';

export const setCommands = async (): Promise<Collection<unknown, Command>> => {
  const commands = new Collection<unknown, Command>();

  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandImported = await import(filePath);
    const command = new commandImported.default();

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }

  return commands;
};
