import { SlashCommandBuilder, ModalSubmitInteraction } from 'discord.js';
import fs from 'fs';
import path from 'path';
import csvParse from 'csv-parse';

import { Command } from './Command';
import { MemeRepository } from '../repositories';

const commandsPath = path.resolve(
  __dirname,
  '..',
  '..',
  'assets',
  'commands.csv',
);

export default class Help implements Command {
  constructor(private memeRepository = new MemeRepository()) {}

  data = new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Lista todos os comandos do botzera');

  public async execute(interaction: ModalSubmitInteraction): Promise<void> {
    const readCSV = fs.createReadStream(commandsPath);

    const parseStream = csvParse.parse({
      from_line: 1,
    });

    const parseCSV = readCSV.pipe(parseStream);

    let stringCommands: string = '';

    parseCSV.on('data', async line => {
      const [command] = line.map((palavra: string) => palavra.trim());

      stringCommands += `\n${command}`;
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    let stringMemes = '';
    this.memeRepository.getMemes().map(meme => (stringMemes += `\n\t${meme}`));
    await interaction.reply(
      '```' + `!meme <> ${stringMemes}\n\t ${stringCommands}` + '```',
    );
  }
}
