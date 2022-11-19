import { SlashCommandBuilder, Interaction } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder;
  execute(interaction: Interaction): Promise<void>;
}
