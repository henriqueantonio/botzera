import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';
import {
  SlashCommandBuilder,
  Interaction,
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js';
import path from 'path';

import { Command } from './Command';

type PlaySoundProps = {
  soundPath: string;
  interaction: ChatInputCommandInteraction;
};

export default class EyeDetec implements Command {
  public data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName('eye-detect')
    .setDescription('Escolhe se algo é VERDAD ou MENTIRA');

  private async playSound({ interaction, soundPath }: PlaySoundProps) {
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    if (!member) return;
    if (!member.voice.channelId) {
      await interaction.reply('Você precisa estar em um canal de voz');
      return;
    }

    const resource = createAudioResource(soundPath);

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
  }

  public async execute(interaction: Interaction<CacheType>): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const isTrue = Math.random() > 0.5;

    const rootPath = path.resolve(__dirname, '..', '..', 'assets', 'sounds');

    if (isTrue) {
      const commandsPath = `${rootPath}/verdad.mp3`;

      await this.playSound({ interaction, soundPath: commandsPath });

      await interaction.reply('É VERDAD');
      return;
    }

    const commandsPath = `${rootPath}/mentira.mp3`;

    await this.playSound({ interaction, soundPath: commandsPath });

    await interaction.reply('É MENTIRA');
  }
}
