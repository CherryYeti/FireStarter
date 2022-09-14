const { token } = require('./config.json')
const child_process = require('child_process')
const discord = require('discord.js')
const fs = require('fs')
const client = new discord.Client({
  intents: [discord.GatewayIntentBits.Guilds],
})
const serversData = JSON.parse(fs.readFileSync('servers.json'))
var processes = new Array(serversData.servers.length)
var running = new Array(serversData.servers.length).fill(false)
//Allows the bot to sign in`
client.once('ready', () => {
  console.log('FireStarter v2.0.5 ----- Built on 9/13/22 \nReady to work!')
})
//Runs whenever the bot receives a command
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  const { commandName } = interaction
  if (commandName === 'help') {
    await interaction.reply({ embeds: [helpEmbed] })
  } else if (commandName === 'servers') {
    await interaction.reply({ embeds: [printServers()] })
  } else if (commandName === 'start') {
    //Get command paramaters
    var selected = interaction.options.getInteger('server_number')
    if (numberOutOfRange(selected)) {
      await interaction.reply(selected.toString() + ' is not a server!')
    } else {
      //Grab settings from servers.json file
      var server = serversData.servers[selected]
      var javaPath = serversData.versions[server.ver]
      var minimumRam = server.minram
      var maximumRam = server.maxram
      var name = server.name
      var dir = getPath(server.path)
      var path = server.path
      await interaction.reply(`Starting server ${name}`)
      //Start the server and save it as an array element
      processes[selected] = child_process.exec(
        `cd ${dir} && ${javaPath} -Xms${minimumRam}M -Xmx${maximumRam}M -jar ${path} nogui`
      )
      //Pipe output data to a function
      processes[selected].stdout.on('data', (data) => {
        processOutput(data, interaction, selected)
      })
    }
  } else if (commandName === 'cmd') {
    //Get command paramaters
    var command = interaction.options.getString('command')
    if (numberOutOfRange(selected)) {
      await interaction.reply(selected.toString() + ' is not a server!')
    } else {
      if (processes[selected]) {
        processes[selected].stdin.write(command + '\n')
        await interaction.reply('Executed command ' + command)
      } else {
        await interaction.reply('This server is currently not running')
      }
    }
  } else if (commandName === 'who') {
    //Get command paramaters
    if (numberOutOfRange(selected)) {
      await interaction.reply(selected.toString() + ' is not a server!')
    } else {
      if (processes[selected]) {
        await interaction.reply('Listing')
        processes[selected].stdin.write('/list\n')
      } else {
        await interaction.reply('This server is currently not running')
      }
    }
  } else if (commandName === 'stop') {
    if (numberOutOfRange(selected)) {
      await interaction.reply(selected.toString() + ' is not a server!')
    } else {
      if (processes[selected]) {
        await interaction.reply('Stopping server ' + selected.toString())
        processes[selected].stdin.write('stop\n')
        running[selected] = false
      } else {
        await interaction.reply('This server is currently not running')
      }
    }
  }
})
function numberOutOfRange(selected) {
  //Checks if sever paramater in command is valid
  if ((selected >= serversData.servers.length) | (selected < 0)) {
    return true
  } else {
    return false
  }
}
async function processOutput(data, interaction, selected) {
  //Dictates responses to certain keywords in server output
  if (data.includes('For help, type ')) {
    await interaction.followUp('Server is now up!')
    running[selected] = true
  } else if (data.includes('players online:')) {
    await interaction.followUp(
      'Online ' + data.toString().substring(data.indexOf(':', 70)) + '\n'
    )
  } else if (data.includes('joined the game')) {
    await interaction.followUp(
      data.toString().substring(data.indexOf(':', 30) + 2) + '\n'
    )
  } else if (data.includes('left the game')) {
    await interaction.followUp(
      data.toString().substring(data.indexOf(':', 30) + 2) + '\n'
    )
  } else if (data.includes('<')) {
    await interaction.followUp(
      data.toString().substring(data.indexOf('<', 30)) + '\n'
    )
  } else if (data.includes('EULA')) {
    await interaction.followUp(
      'You must accept the EULA for server ' +
        selected +
        ' before you can start it'
    )
    running[selected] = false
  }
}
function getPath(pathString) {
  //Grab path to change to before launching server
  var last = pathString.lastIndexOf('/')
  var path = pathString.substring(0, last + 1)
  return path
}
function printServers() {
  //Lists all servers
  if (serversData.servers.length > 0) {
    var message = ''
    for (var server in serversData['servers']) {
      message = message.concat(
        `[${server}] ${serversData['servers'][server].name} | Online ${running[server]} \n`
      )
    }
    const serverEmbed = {
      color: 0xf9734e,
      title: 'Servers',
      description: message,
      footer: {
        text: 'Made by CherryYeti',
        icon_url: 'https://i.ibb.co/DC1GF9z/favicon.png',
      },
    }
    return serverEmbed
  } else {
    const noServersEmbed = {
      color: 0xf9734e,
      title: 'Servers',
      description: 'There are currently no servers added to firestarter',
      footer: {
        text: 'Made by CherryYeti',
        icon_url: 'https://i.ibb.co/DC1GF9z/favicon.png',
      },
    }
    return noServersEmbed
  }
}
const helpEmbed = {
  color: 0xf9734e,
  title: 'HELP ME',
  description: 'List of commands',
  fields: [
    {
      name: '/help',
      value: 'What brought you here',
    },
    {
      name: '/servers',
      value: 'Lists all available servers',
    },
    {
      name: '/start',
      value: 'Starts server with corresponding value',
    },
    {
      name: '/stop',
      value: 'Stops server with corresponding value',
    },
    {
      name: '/cmd',
      value: 'Execute command with corresponding server (NO SLASHES)',
    },
    {
      name: '/who',
      value: 'Lists who is on the corresponding server',
    },
  ],
  footer: {
    text: 'Made by CherryYeti',
    icon_url: 'https://i.ibb.co/DC1GF9z/favicon.png',
  },
}
client.login(token)
