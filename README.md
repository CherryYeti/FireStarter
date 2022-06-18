Welcome to FireStarter!

FireStarter is an open source discord bot coded to help start, stop and manage your minecraft servers!

# PREREQUISITES
Node.js 16.6.0 or newer is required.

Windows :  You can download nodejs from https://nodejs.org/en/download/

Debian/Ubuntu : `sudo apt install nodejs`

Arch : `sudo pacman -S nodejs`

Fedora : dnf module install nodejs:17
# INSTALLATION
## Windows
1. Click on the download code button in the main page and save the zip file somewhere
2. Extract the zip file
3. Open Command Prompt (cmd) and navigate to the folder using `cd` to change directories and `dir` to list all directories 
4. Type `npm i` once you are inside the folder to install the necessary dependencies

## Linux
1. Download zip or type `git clone https://github.com/CherryYeti/FireStarter/` into the terminal
2. Navigate into directory
3. Type `npm i` to install the necessary dependencies

# DISCORD BOT SETUP

1. Go to [https://discord.com/developers/applications](https://discord.com/developers/applications) and click on New Application in the top right corner
2. Name it whatever you want (preferrably FireStarter)
3. Click on the Bot option on the left side of the screen
4. Click on the Add Bot button and confirm
5. Customize bot to your liking
6. Click on the Copy button below the `Click to reveal token`
7. MAKE SURE TO CHECK PRIVILEGED GATEWAY INTENTS
![https://i.ibb.co/477yrBz/screenshot.png](https://i.ibb.co/477yrBz/screenshot.png)
8. Click on the OAuth2 dropdown on the left side of the screen and click on URL Generator
9. In the scopes section, select bot and applications.commands, at the bottom of the page, there should be a link that looks like this
`https://discord.com/api/oauth2/authorize?client_id=[CLIENTID]&permissions=0&scope=bot%20applications.commands`
10. Copy the CLIENTID and paste it into the config.json file in its place. Do the same with the token
11. Right click on the server that you want to invite it to and click copy id. Paste it in the guildId slot
12. Choose which server to invite it to and approve the permissions 
13. Go back to the terminal and run the command node deploy-commands.js. If all is done right, it should give you success.

# SETUP INFO
The file called SERVERS.json will act as your way to add servers and java installations
For the "versions" entry, you want to put the path to your java executable, as well as the version. I recommend openjdk.
You will most likeley need to install both Java 8 and Java 17, as mojang decided that games from 1.18 onwards will need to run java 17
The ram options are in MB. [https://www.gbmb.org/gb-to-mb]

# RUNNING
All you need to do is to go into the Command Prompt (or Terminal) and type `node ./index.js`. The bot should say `Ready` once it has initilized

Type /help in discord in order to get started!
