import nextcord
from nextcord.ext import commands
import yaml
import asyncio
import subprocess

with open("config.yaml", "r") as yaml_file:
    config_yaml_contents = yaml.safe_load(yaml_file)

server_running = [False] * len(config_yaml_contents["java"])
server_processes = [None] * len(config_yaml_contents["java"])
num_servers = len(config_yaml_contents["servers"])

def generate_embed(title, fields):
    embed = nextcord.Embed(title=title, color=nextcord.Colour.purple())
    for name, value, inline in fields:
        embed.add_field(name=name, value=value, inline=inline)
    return embed

def generate_servers_embed():
    fields = [(f'{server_name}', f'Online: {running}', False) for server_name, running in zip(config_yaml_contents["servers"].keys(), server_running)]
    servers_embed = generate_embed("Servers", fields)
    servers_embed.set_footer(text="Made by CherryYeti", icon_url="https://avatars.githubusercontent.com/u/53279269?v=4")
    return servers_embed

def generate_help_embed():
    fields = [
        ("/help", "What brought you here", False),
        ("/servers", "Lists all available servers", False),
        ("/start [server]", "Starts server with corresponding value", False),
        ("/stop [server]", "Stops server with corresponding value", False),
        ("/cmd [server] [command]", "Execute command with corresponding server (NO SLASHES)", False),
        ("/who [server]", "Lists who is on the corresponding server", False)
    ]
    help_embed = generate_embed("Help me!", fields)
    help_embed.set_footer(text="Made by CherryYeti", icon_url="https://i.ibb.co/fS29xcV/fire.png")
    return help_embed

async def process_server_output(data, interaction, selected, server_name):
    if "For help, type " in data:
        await interaction.send("Server is now up!")
        server_running[selected] = True
    elif any(keyword in data for keyword in ["players online:", "joined the game", "left the game", "<"]):
        await interaction.send(data[data.index(":", 30) + 2:] + "\n")
    elif "EULA" in data:
        await interaction.send(f"You must accept the EULA for \"{server_name}\" before you can start it")
        server_running[selected] = False

bot = commands.Bot()

@bot.slash_command(description="List Servers")
async def servers(interaction: nextcord.Interaction):
    await interaction.send(embed=generate_servers_embed())

@bot.slash_command(description="Help me!")
async def help(interaction: nextcord.Interaction):
    await interaction.send(embed=generate_help_embed())

@bot.slash_command(description="Start server")
async def start(interaction: nextcord.Interaction, server: int):
    if 0 <= server < num_servers:
        if server_running[server]:
            await interaction.send("That server is already running")
        else:
            selected_server = list(config_yaml_contents["servers"].keys())[server]
            server_info = config_yaml_contents["servers"][selected_server]
            path, java_version, minimum_ram, maximum_ram = server_info["path"], server_info["java_version"], server_info["minimum_ram"], server_info["maximum_ram"]
            folder = '/'.join(path.split('/')[:-1]) if '/' in path else '\\'.join(path.split('\\')[:-1])
            java_version_name = config_yaml_contents["java"][java_version]
            command = f'cd {folder} && {java_version_name} -Xms{minimum_ram}M -Xmx{maximum_ram}M -jar {path} nogui'
            await interaction.send(f'Starting server: {selected_server}...')
            process = await asyncio.create_subprocess_shell(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=subprocess.PIPE)
            server_processes[server] = process
            server_running[server] = True
            while True:
                stdout_line = await process.stdout.readline()
                if not stdout_line:
                    break
                data = stdout_line.decode("utf-8")
                await process_server_output(data, interaction, server, selected_server)
    else:
        await interaction.send('No server exists with that index')

@bot.slash_command(description="Execute command on server")
async def cmd(interaction: nextcord.Interaction, server: int, command: str):
    if 0 <= server < num_servers:
        if not server_running[server]:
            await interaction.send("That server is not running")
        else:
            process = server_processes[server]
            command_with_newline = command + "\n"
            process.stdin.write(command_with_newline.encode())
            await interaction.send(f'Sent command to server {server}: {command}')
    else:
        await interaction.send('No server exists with that index')

@bot.slash_command(description="Stop the server")
async def stop(interaction: nextcord.Interaction, server: int):
    if 0 <= server < num_servers:
        if not server_running[server]:
            await interaction.send("That server is not running")
        else:
            server_running[server] = False
            process = server_processes[server]
            command ="stop\n"
            process.stdin.write(command.encode())
            await interaction.send(f'Server {server} has been stopped')
    else:
        await interaction.send('No server exists with that index')

@bot.slash_command(description="List players on the server")
async def who(interaction: nextcord.Interaction, server: int):
    if 0 <= server < num_servers:
        if not server_running[server]:
            await interaction.send("That server is not running")
        else:
            server_running[server] = False
            process = server_processes[server]
            command ="list\n"
            process.stdin.write(command.encode())
    else:
        await interaction.send('No server exists with that index')

@bot.event
async def on_ready():
    print(f"Bot is ready and connected as {bot.user.name} ({bot.user.id})")
bot_token = config_yaml_contents["discord"]["token"]
bot.run(bot_token)
