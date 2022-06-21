## Welcome to FireStarter!

FireStarter is a free and open source discord bot coded to help start, stop and manage your minecraft servers!

# PREREQUISITES
## Node.js 16.6.0 or newer is required.

## Windows
You can download nodejs from https://nodejs.org/en/download/

## Mac
You can download nodejs from https://nodejs.org/en/download/
## Linux
### Debian/Ubuntu
`sudo apt install nodejs`

### Arch
`sudo pacman -S nodejs`

### Fedora
`sudo dnf module install nodejs:16/development`

### openSuse
`zypper install nodejs18`


The file called SERVERS.json will act as your way to add servers and java installations.
For the "versions" entry, you want to put the path to your java executable, as well as the version. I personally recommend openjdk.
You will most likely need to install both Java 8 and Java 17, as mojang decided that games from 1.18 onwards will need to run java 17.
The ram options are in MB. [https://www.gbmb.org/gb-to-mb]

## Multiple Java versions

## Windows
1. Download java 18 from https://adoptium.net/temurin/releases/?version=18
2. Download java 8 from https://adoptium.net/temurin/releases/?version=8
<br>
Paths:
8: C:/\"Program Files\"/\"Eclipse Adoptium\"/jdk-8.0.332.9-hotspot/bin/java
18:C:/\"Program Files\"/\"Eclipse Adoptium\"/jdk-18.0.1.10-hotspot/bin/java

## NOTE
### If you have spaces in any of the paths, you need to put \\"around the spaced words
### Ex. 
### Instead of C:/Program Files/ 
### It is C:/\\"Program Files\\"/
## Mac
1. Open the terminal app
2. Install homebrew by typing `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
3. Type `brew install openjdk@8 openjdk@18`
<br>
Paths :
<br>
8:  `/usr/local/opt/openjdk@8/bin/java`
<br>
18:`/usr/local/opt/openjdk@18/bin/java`

## Linux

### Debian/Ubuntu
 `sudo apt install openjdk-8-jdk openjdk-17-jdk`

Paths : 
<br>
8:  `/usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java`
<br>
17:`/usr/lib/jvm/java-17-openjdk-amd64/bin/java`

### Arch
 `sudo pacman -S jdk-openjdk jdk8-openjdk`

Paths :
<br>
8:  `/usr/lib/jvm/java-8-openjdk/jre/bin/java`
<br>
18:`/usr/lib/jvm/java-18-openjdk/bin/java`

### Fedora
 `sudo dnf install java-1.8.0-openjdk java-17-openjdk`

Paths :
<br>
8:  `/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.332.b09-1.fc36.x86_64/jre/bin/java`
<br>
17:`/usr/lib/jvm/java-17-openjdk-17.0.3.0.7-1.fc36.x86_64/bin/java`

### OpenSuse
 `sudo zypper in java-1_8_0-openjdk java-18-openjdk`

Paths :
<br>
8:  `/usr/lib64/jvm/java-1.8.0-openjdk-1.8.0/jre/bin/java`
<br>
18:`/usr/lib64/jvm/java18-openjdk-18/bin/java`

# INSTALLATION
## Windows
1. Click on the download code button in the main page and save the zip file anywhere
2. Extract files
3. Open the folder and select and copy the top bar
4. Open the Command Prompt and type `cd ` then paste the path
5. Type `npm i` once you are inside the folder to install the necessary dependencies

## Mac
1. Click on the download code button and move the FireStarter folder anywhere.
2. Open the terminal and navigate to the directory
3. Type `npm i` to install the necessary dependencies

## Linux
1. Download zip or type `git clone https://github.com/CherryYeti/FireStarter/` into the terminal
2. Navigate into directory
3. Type `npm i` to install the necessary dependencies


# DISCORD BOT SETUP

1. Go to [https://discord.com/developers/applications](https://discord.com/developers/applications) and click on New Application in the top right corner.
2. Any name will work.
3. Click on the Bot option on the left side of the screen.
4. Click on the Add Bot button on the right side of the page and confirm.
5. Customize bot to your liking.
6. Click on the Copy button below the `Click to reveal token`.
7. Uncheck the `Requires OAuth2 Code Grant.
![https://i.ibb.co/477yrBz/screenshot.png](https://i.ibb.co/D4WG7gg/discord.png)
8. Click on the OAuth2 dropdown on the left side of the screen and click on URL Generator.
9. In the scopes section, select bot and applications.commands, at the bottom of the page, there should be a link that looks like this
`https://discord.com/api/oauth2/authorize?client_id=[CLIENTID]&permissions=0&scope=bot%20applications.commands`
10. Copy the CLIENTID portion and paste it into the config.json file in the clientID slot.
10. Take the token that you saved earlier and paste it into the config.json file in the token slot.
11. Right click on the server icon that you want to invite it to and click copy id. Paste it in the guildId slot.
12. Choose which server to invite it to and approve the permissions 
13. Go back to the terminal and type in the command `node deploy-commands.js`. If all is done right, it should say `Successfully registered application commands.`



# RUNNING
All you need to do is to go into the Command Prompt (or Terminal) and type `node ./index.js`. The bot should say `Ready to work` once it has initilized.

Type /help in discord in order to get started!
