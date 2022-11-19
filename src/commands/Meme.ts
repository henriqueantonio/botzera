import path from 'path';
import { SlashCommandBuilder, Interaction, CacheType } from 'discord.js';
import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';

import { MemeRepository } from '../repositories';
import { Command } from './Command';

export default class Meme implements Command {
  constructor(private memeRepository = new MemeRepository()) {}

  data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Manda um meme')
    .addStringOption(option =>
      option
        .setName('nome')
        .setDescription('O nome do meme escolhido')
        .setRequired(true)
        .setAutocomplete(false),
    ) as SlashCommandBuilder;

  public async execute(interaction: Interaction<CacheType>): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const member = interaction.guild?.members.cache.get(interaction.user.id);
    if (!member) return;
    if (!member.voice.channelId) {
      await interaction.reply('Você precisa estar em um canal de voz');
      return;
    }

    const choosedMeme = interaction.options.data[0];

    const isMemeValid = this.memeRepository.memeExists(
      String(choosedMeme.value),
    );

    if (isMemeValid) {
      const commandsPath = path.resolve(
        __dirname,
        '..',
        '..',
        'assets',
        'sounds',
        `${choosedMeme.value}.mp3`,
      );

      const resource = createAudioResource(commandsPath);

      const channel = interaction.channel;
      const guild = interaction.guild;

      if (!guild || !channel) {
        await interaction.reply('Você precisa estar em um canal de voz');
        return;
      }

      const connection = joinVoiceChannel({
        channelId: member.voice.channelId,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });

      if (!connection) {
        await interaction.reply('Não consegui entrar no canal de voz');
        return;
      }

      const player = createAudioPlayer();

      connection.subscribe(player);

      player.play(resource);

      player.on('stateChange', (_, newState) => {
        if (newState.status === 'idle') {
          connection.destroy();
        }
      });

      await interaction.reply(`Meme ${choosedMeme.value} foi enviado gurizão`);
      return;
    }

    await interaction.reply('Esse meme não existe gurizão');
  }
}
