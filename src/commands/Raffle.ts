import { SlashCommandBuilder, Interaction, CacheType } from 'discord.js';
import { Command } from './Command';

export default class Raffle implements Command {
  data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName('sortear')
    .setDescription('Sorteia um participante do canal de voz');

  public async execute(interaction: Interaction<CacheType>): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const channel = interaction.channel;
    if (!channel) return;

    const members = channel.client.users.cache.filter(user => !user.bot);
    if (members.size === 0) return;

    const choosedMember = members.random();

    await interaction.reply(
      `Se fodeu <@${choosedMember}>, tu foi o escolhido!`,
    );
  }
}
