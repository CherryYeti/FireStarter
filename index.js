const fs = require('fs');
const discord = require('discord.js');
const child_process = require('child_process');
const { token } = require('./config.json');
const servers_data = JSON.parse(fs.readFileSync('SERVERS.json'));
var processes = new Array(servers_data.servers.length)
var running = new Array(servers_data.servers.length).fill(false)
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS] });
client.once('ready', () => { console.log('Ready!'); });
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    if (commandName === 'help') {
        await interaction.reply({ embeds: [serverEmbed] });
    } else if (commandName === 'servers') {
        await interaction.reply({ embeds: [printServer()] });
    } else if (commandName === 'start') {
        var selected = interaction.options.getInteger('input')
        if (selected >= servers_data.servers.length | selected < 0) {
            await interaction.reply((interaction.options.getInteger('input')).toString() + " is not a server!");
        } else {
            var server = servers_data.servers[selected]
            var java_path = servers_data.versions[servers_data.servers[selected].ver]
            var min_ram = server.minram
            var max_ram = server.maxram
            var name = server.name
            var dir = getPath(server.path)
            var path = server.path
            await interaction.reply(`Starting server ${name}`)
            processes[selected] = child_process.exec(`cd ${dir} && ${java_path} -Xms${min_ram}M -Xmx${max_ram}M -jar ${path} nogui`)
            processes[selected].stdout.on("data", (data) => {
                processOutput(data, interaction, selected)
            })
        }
    } else if (commandName === 'cmd') {
        var selected = interaction.options.getInteger('input')
        if (selected >= servers_data.servers.length | selected < 0) {
            await interaction.reply((interaction.options.getInteger('input')).toString() + " is not a server!")
        } else {
            if (processes[selected]) {
                await interaction.reply("Executed command")
                processes[selected].stdin.write(interaction.options.getString('command') + '\n')
            } else {
                await interaction.reply("This server is currently not running")
            }
        }

    } else if (commandName === 'who') {
        var selected = interaction.options.getInteger('input')
        if (selected >= servers_data.servers.length | selected < 0) {
            await interaction.reply((interaction.options.getInteger('input')).toString() + " is not a server!")
        } else {
            if (processes[selected]) {
                await interaction.reply("Listing")
                processes[selected].stdin.write('/list\n')
            } else {
                await interaction.reply("This server is currently not running")
            }
        }
    } else if (commandName === 'stop') {
        var selected = interaction.options.getInteger('input')
        if (selected >= servers_data.servers.length | selected < 0) {
            await interaction.reply((interaction.options.getInteger('input')).toString() + " is not a server!")
        } else {
            if (processes[selected]) {
                await interaction.reply("Stopping server " + (interaction.options.getInteger('input')).toString())
                processes[selected].stdin.write('stop\n')
            } else {
                await interaction.reply("This server is currently not running")
            }
        }
    }
});
function processOutput(data, interaction, selected) {
    if (data.includes("For help, type ")) {
        await interaction.followUp("Server is now up!");
        running[selected] = true;
    } else if (data.includes("players online:")) {
        await interaction.followUp("Online " + data.toString().substring(data.indexOf(":", 70)) + "\n");
    } else if (data.includes("joined the game")) {
        await interaction.followUp(data.toString().substring(data.indexOf(":", 30) + 2) + "\n");
    } else if (data.includes("left the game")) {
        await interaction.followUp(data.toString().substring(data.indexOf(":", 30) + 2) + "\n");
    } else if (data.includes("<")) {
        await interaction.followUp(data.toString().substring(data.indexOf("<", 30)) + "\n");
    }
}
function getPath(string) {
    var last = string.lastIndexOf('/');
    var path = string.substring(0, last + 1)
    return path
}
function printServer() {
    var message = ''
    for (key in servers_data["servers"]) {
        message = message.concat(`[${key}] ${servers_data["servers"][key].name} | Online ${running[key]} \n`)
    }
    const serverEmbed = new discord.MessageEmbed()
        .setColor("#F9734E")
        .setTitle("Servers")
        .setDescription(message)
    return serverEmbed
}
const serverEmbed = new discord.MessageEmbed()
    .setColor("#F9734E")
    .setTitle("HELP ME")
    .setDescription("List of commands")
    .addFields(
        { name: "/help", value: "What brought you here" },
        { name: "/servers", value: "Lists all available servers" },
        { name: "/start (server number)", value: "Starts server with corresponding value" },
        { name: "/stop (server number)", value: "Stops server with corresponding value" },
        { name: "/cmd (server number) (command)", value: "Execute command with corresponding server (NO SLASHES)" },
        { name: "/who (server number)", value: "Lists who is on the corresponding server" }
    )
    .setFooter("Made by CherryYeti", "https://i.ibb.co/TKLgBhh/unnamed.jpg");
client.login(token);