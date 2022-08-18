const { token } = require('./config.json');
const child_process = require('child_process');
const discord = require('discord.js');
const fs = require('fs');
const client = new discord.Client({ intents: [discord.GatewayIntentBits.Guilds] });
const servers_data = JSON.parse(fs.readFileSync('servers.json'));
var processes = new Array(servers_data.servers.length);
var running = new Array(servers_data.servers.length).fill(false);
//Allows the bot to sign in`
client.once('ready', () => { console.log('Ready to work!'); });
//Runs whenever the bot receives a command
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { command_name } = interaction;
    if (command_name === 'help') {
        await interaction.reply({ embeds: [help_embed] });
    } else if (command_name === 'servers') {
        await interaction.reply({ embeds: [print_servers()] });
    } else if (command_name === 'start') {
        //Get command paramaters
        var selected = interaction.options.getInteger('server_number');
        if (number_out_of_range(selected)) {
            await interaction.reply(selected.toString() + ' is not a server!');
        } else {
            //Grab settings from servers.json file
            var server = servers_data.servers[selected];
            var java_path = servers_data.versions[server.ver];
            var minimum_ram = server.minram;
            var maximum_ram = server.maxram;
            var name = server.name;
            var dir = get_path(server.path);
            var path = server.path;
            await interaction.reply(`Starting server ${name}`);
            //Start the server and save it as an array element
            processes[selected] = child_process.exec(`cd ${dir} && ${java_path} -Xms${minimum_ram}M -Xmx${maximum_ram}M -jar ${path} nogui`);
            //Pipe output data to a function
            processes[selected].stdout.on('data', (data) => { process_output(data, interaction, selected) });
        }
    } else if (command_name === 'cmd') {
        //Get command paramaters
        var selected = interaction.options.getInteger('server_number');
        var command = interaction.options.getString('command');
        if (number_out_of_range(selected)) {
            await interaction.reply(selected.toString() + ' is not a server!');
        } else {
            if (processes[selected]) {
                processes[selected].stdin.write(command + '\n');
                await interaction.reply('Executed command ' + command);
            } else {
                await interaction.reply('This server is currently not running');
            }
        }
    } else if (command_name === 'who') {
        //Get command paramaters
        var selected = interaction.options.getInteger('server_number');
        if (number_out_of_range(selected)) {
            await interaction.reply(selected.toString() + ' is not a server!');
        } else {
            if (processes[selected]) {
                await interaction.reply('Listing');
                processes[selected].stdin.write('/list\n');
            } else {
                await interaction.reply('This server is currently not running');
            }
        }
    } else if (command_name === 'stop') {
        var selected = interaction.options.getInteger('server_number');
        if (number_out_of_range(selected)) {
            await interaction.reply(selected.toString() + ' is not a server!');
        } else {
            if (processes[selected]) {
                await interaction.reply('Stopping server ' + selected.toString());
                processes[selected].stdin.write('stop\n');
                running[selected] = false;
            } else {
                await interaction.reply('This server is currently not running');
            }
        }
    }
});
function number_out_of_range(selected) {
    //Checks if sever paramater in command is valid
    if (selected >= servers_data.servers.length | selected < 0) {
        return true;
    } else {
        return false;
    }
}
async function process_output(data, interaction, selected) {
    //Dictates responses to certain keywords in server output
    if (data.includes('For help, type ')) {
        await interaction.followUp('Server is now up!');
        running[selected] = true;
    } else if (data.includes('players online:')) {
        await interaction.followUp('Online ' + data.toString().substring(data.indexOf(':', 70)) + '\n');
    } else if (data.includes('joined the game')) {
        await interaction.followUp(data.toString().substring(data.indexOf(':', 30) + 2) + '\n');
    } else if (data.includes('left the game')) {
        await interaction.followUp(data.toString().substring(data.indexOf(':', 30) + 2) + '\n');
    } else if (data.includes('<')) {
        await interaction.followUp(data.toString().substring(data.indexOf('<', 30)) + '\n');
    } else if (data.includes('EULA')) {
        await interaction.followUp('You must accept the EULA for server ' + selected + ' before you can start it');
        running[selected] = false;
    }
}
function get_path(path_string) {
    //Grab path to change to before launching server
    var last = path_string.lastIndexOf('/');
    var path = path_string.substring(0, last + 1);
    return path;
}
function print_servers() {
    //Lists all servers
    if (servers_data > 0) {
        var message = ''
        for (server in servers_data['servers']) {
            message = message.concat(`[${server}] ${servers_data['servers'][server].name} | Online ${running[server]} \n`);
        }
        const serverEmbed = {
            color: 0xF9734E,
            title: 'Servers',
            description: message,
        }
        return serverEmbed;
    } else {
        const noServersEmbed = {
            color: 0xF9734E,
            title: 'Servers',
            description: 'There are currently no servers added to firestarter',
        }
        return noServersEmbed;
    }

}
const help_embed = {
    color: 0xF9734E,
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
        }
    ],
    footer: {
        text: 'Made by CherryYeti',
        icon_url: 'https://i.ibb.co/TKLgBhh/unnamed.jpg',
    },
};
client.login(token);