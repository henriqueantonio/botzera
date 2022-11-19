import 'dotenv/config';
import { REST, Client, Routes } from 'discord.js';

import { setCommands } from './commands';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? '';
const DISCORD_APP_ID = process.env.DISCORD_APP_ID ?? '';
const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID ?? '';

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

void (async () => {
  const client = new Client({
    intents: ['Guilds', 'GuildVoiceStates'],
  });
  const commands = await setCommands();

  /* Login with discord */
  client.login(DISCORD_TOKEN);

  /* On bot ready */
  client.once('ready', () => {
    client.user?.setActivity('!ajuda');
    console.log(`Bot online: ${client.user?.tag}`);
  });

  await rest.put(
    Routes.applicationGuildCommands(DISCORD_APP_ID, DISCORD_SERVER_ID),
    { body: commands.map(command => command.data.toJSON()) },
  );

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) {
      await interaction.reply({
        content: 'Comando não encontrado',
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: 'Aconteceu um erro ao executar esse comando.',
        ephemeral: true,
      });
    }
  });
})();
