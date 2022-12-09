//Imports
const child_process = require("child_process");
const discord = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const ini = require("ini");
const path = require("path");
const os = require("os");
//Load token and server from .env file
dotenv.config();
//Grab java information from INI file
const java_config = ini.parse(fs.readFileSync("./java.ini", "utf-8"));
const java_config_keys = Reflect.ownKeys(java_config);

//Grab server information from INI file
const server_config = ini.parse(fs.readFileSync("./servers.ini", "utf-8"));
const server_config_keys = Reflect.ownKeys(server_config);

//Create empty arrays for reference
const server_processes = new Array(server_config_keys.length);
const server_running = new Array(server_config_keys.length).fill(false);

//Initialize discord client
const client = new discord.Client({
  intents: [discord.GatewayIntentBits.Guilds],
});

//Client prints once it is connected
client.once("ready", () => {
  console.log("FireStarter v2.1.0 ----- Built on 12/08/22 \nReady to work!");
  deployCommands();
});

client.on("interactionCreate", async (interaction) => {
  //Checks if the commands is a slash command
  if (!interaction.isChatInputCommand()) return;
  //Get associated slash command number option if applicable
  var selected = interaction.options.getInteger("server_number");
  const { commandName } = interaction;
  //Help command
  if (commandName == "help") {
    await interaction.reply({ embeds: [help_embed] });
    //Lists all servers in the server.ini file
  } else if (commandName == "servers") {
    console.log("SERVER");
    await interaction.reply({ embeds: [print_servers()] });
    //Grabs info from servers.ini and java.ini to execute command to launch server
  } else if (commandName == "start") {
    //Checks if given slash command number is a vaild server
    if (selected < server_config_keys.length && 0 <= selected) {
      var selected_server_data =
        server_config[server_config_keys[selected].toString()];
      var jar_path = selected_server_data["PATH"];
      var folder = path.dirname(jar_path);
      var ver = selected_server_data["JAVA"];
      var java = java_config["JAVA"][ver];
      var min_ram = selected_server_data["MIN_RAM"];
      var max_ram = selected_server_data["MAX_RAM"];
      var name = selected_server_data["NAME"];
      //Put quotes around paths in windows because mircosoft sucks
      if (os.platform() == "win32") {
        jar_path = `'${jar_path}'`;
        java = `'${java}'`;
      }
      server_processes[selected] = child_process.exec(
        `cd ${folder} && ${java} -Xms${min_ram}M -Xmx${max_ram}M -jar ${jar_path} nogui`
      );

      server_processes[selected].stdout.on("data", (data) => {
        process_server_output(data, interaction, selected);
      });

      await interaction.reply(
        `Server ${selected} (${name}) is being started...`
      );
      server_running[selected] = true;
    } else {
      await interaction.reply(`${selected.toString()} is not a server!`);
    }
    //Stops server based on slash command number
  } else if (commandName == "stop") {
    if (selected < server_config_keys.length && 0 <= selected) {
      await interaction.reply(`Stopping server ${selected.toString()}`);
      server_processes[selected].stdin.write("stop\n");
      server_running[selected] = false;
    } else {
      await interaction.reply(`${selected.toString()} is not a server!`);
    }
    //Sends command to server based on slash command number
  } else if (commandName == "cmd") {
    if (selected < server_config_keys.length && 0 <= selected) {
      var command = interaction.options.getString("command");
      if (server_processes[selected]) {
        server_processes[selected].stdin.write(`${command}\n`);
        await interaction.reply(`Executed command ${command}`);
      } else {
        await interaction.reply("This server is currently not running");
      }
    }
    //Lists all people on selected server
  } else if (commandName == "who") {
    if (server_processes[selected]) {
      server_processes[selected].stdin.write(`/list\n`);
    } else {
      await interaction.reply("This server is currently not running");
    }
  }
});
//Function that handles the output of the server command
async function process_server_output(data, interaction, selected) {
  if (data.includes("For help, type ")) {
    await interaction.followUp("Server is now up!");
    server_running[selected] = true;
  } else if (data.includes("players online:")) {
    await interaction.followUp(
      `Online ${data.toString().substring(data.indexOf(":", 70))}\n`
    );
  } else if (data.includes("joined the game")) {
    // await interaction.followUp(
    //   data.toString().substring(data.indexOf(":", 30) + 2) + "\n"
    // );
  } else if (data.includes("left the game")) {
    // await interaction.followUp(
    //   data.toString().substring(data.indexOf(":", 30) + 2) + "\n"
    // );
  } else if (data.includes("<")) {
    // await interaction.followUp(
    //   data.toString().substring(data.indexOf("<", 30)) + "\n"
    // );
  } else if (data.includes("EULA")) {
    await interaction.followUp(
      `You must accept the EULA for server ${selected} before you can start it`
    );
    server_running[selected] = false;
  }
}

function print_servers() {
  if (server_config_keys.length > 0) {
    var message = "";
    for (let key in server_config_keys) {
      message = message.concat(
        `${
          server_config[server_config_keys[key].toString()]["NAME"]
        } (Server ${key}) | Online ${server_running[key]}\n`
      );
    }
    const serverEmbed = {
      color: 0xf9734e,
      title: "Servers",
      description: message,
      footer: {
        text: "Made by CherryYeti",
        icon_url: "https://i.ibb.co/DC1GF9z/favicon.png",
      },
    };
    return serverEmbed;
  } else {
    const noServersEmbed = {
      color: 0xf9734e,
      title: "Servers",
      description: "There are currently no servers added to firestarter",
      footer: {
        text: "Made by CherryYeti",
        icon_url: "https://i.ibb.co/DC1GF9z/favicon.png",
      },
    };
    return noServersEmbed;
  }
}

const help_embed = {
  color: 0xf9734e,
  title: "HELP ME",
  description: "List of commands",
  fields: [
    {
      name: "/help",
      value: "What brought you here",
    },
    {
      name: "/servers",
      value: "Lists all available servers",
    },
    {
      name: "/start",
      value: "Starts server with corresponding value",
    },
    {
      name: "/stop",
      value: "Stops server with corresponding value",
    },
    {
      name: "/cmd",
      value: "Execute command with corresponding server (NO SLASHES)",
    },
    {
      name: "/who",
      value: "Lists who is on the corresponding server",
    },
  ],
  footer: {
    text: "Made by CherryYeti",
    icon_url: "https://i.ibb.co/DC1GF9z/favicon.png",
  },
};
//Deploys slash commands to discord
function deployCommands() {
  const commands = [
    new discord.SlashCommandBuilder()
      .setName("help")
      .setDescription("Get started"),
    new discord.SlashCommandBuilder()
      .setName("servers")
      .setDescription("Lists all available servers"),
    new discord.SlashCommandBuilder()
      .setName("start")
      .setDescription("Starts server with corresponding value")
      .addIntegerOption((option) =>
        option
          .setName("server_number")
          .setDescription("Server number")
          .setRequired(true)
      ),
    new discord.SlashCommandBuilder()
      .setName("stop")
      .setDescription("Stops server with corresponding value")
      .addIntegerOption((option) =>
        option
          .setName("server_number")
          .setDescription("Server number")
          .setRequired(true)
      ),
    new discord.SlashCommandBuilder()
      .setName("cmd")
      .setDescription("Execute command with corresponding server")
      .addIntegerOption((option) =>
        option
          .setName("server_number")
          .setDescription("Server number")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("command")
          .setDescription("Command to execute")
          .setRequired(true)
      ),
    new discord.SlashCommandBuilder()
      .setName("who")
      .setDescription("Lists who is on the corresponding server")
      .addIntegerOption((option) =>
        option
          .setName("server_number")
          .setDescription("Server number")
          .setRequired(true)
      ),
  ].map((command) => command.toJSON());
  if (process.env.TOKEN && process.env.ID && process.env.GUILD) {
    const rest = new discord.REST({ version: "9" }).setToken(process.env.TOKEN);
    rest
      .put(
        discord.Routes.applicationGuildCommands(
          process.env.ID,
          process.env.GUILD
        ),
        {
          body: commands,
        }
      )
      .then(() => console.log("Successfully registered application commands."))
      .catch(console.error);
  }
}

// Start the client
client.login(process.env.TOKEN);
