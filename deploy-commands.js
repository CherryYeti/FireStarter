const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { clientId, guildId, token } = require('./config.json')

const commands = [
  new SlashCommandBuilder().setName('help').setDescription('Get started'),
  new SlashCommandBuilder()
    .setName('servers')
    .setDescription('Lists all available servers'),
  new SlashCommandBuilder()
    .setName('start')
    .setDescription('Starts server with corresponding value')
    .addIntegerOption((option) =>
      option
        .setName('server_number')
        .setDescription('Server number')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops server with corresponding value')
    .addIntegerOption((option) =>
      option
        .setName('server_number')
        .setDescription('Server number')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('cmd')
    .setDescription('Execute command with corresponding server')
    .addIntegerOption((option) =>
      option
        .setName('server_number')
        .setDescription('Server number')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('Command to execute')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('who')
    .setDescription('Lists who is on the corresponding server')
    .addIntegerOption((option) =>
      option
        .setName('server_number')
        .setDescription('Server number')
        .setRequired(true)
    ),
].map((command) => command.toJSON())
const rest = new REST({ version: '9' }).setToken(token)
rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error)
