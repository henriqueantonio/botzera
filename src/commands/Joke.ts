import { SlashCommandBuilder, Interaction, CacheType } from 'discord.js';
import axios from 'axios';

import { Command } from './Command';

export default class Joke implements Command {
  data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName('piada')
    .setDescription('Conta uma piada');

  public async execute(interaction: Interaction<CacheType>): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const { data } = await axios.get(
      'https://official-joke-api.appspot.com/random_joke',
    );

    await interaction.reply(data.setup);
    setTimeout(() => interaction.followUp(data.punchline), 5000);
  }
}
