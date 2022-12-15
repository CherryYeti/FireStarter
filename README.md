<h1 align="center">FireStarter</h1>

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Fire-dynamic-gradient.png" alt="firestarter-logo" width="120px" height="120px"/>
  <br>
    <i>
      FireStarter is a free and open source Discord bot used to start, stop and manage options on your minecraft servers using Node.js
    </i>
  <br>
</p>

<p align="center">
  <a href="https://javandel.net/jason">My Portfolio</a>
  ·
  <a href="https://github.com/cherryyeti/firestarter/issues">Submit an Issue</a>
  <br>
  <br>
</p>

- [Prerequisites](#prerequisites)
  - [Node JS (Node.js 16.9.0 or newer is required!)](#node-js-nodejs-1690-or-newer-is-required)
    - [Windows](#windows)
    - [MacOS](#macos)
    - [Linux](#linux)
  - [Java](#java)
    - [Windows](#windows-1)
    - [MacOS](#macos-1)
    - [Linux](#linux-1)
- [Downloading the code](#downloading-the-code)
- [Configuring the code](#configuring-the-code)
  - [Java.ini file](#javaini-file)
    - [Windows](#windows-2)
    - [MacOS (Untested paths)](#macos-untested-paths)
    - [Linux](#linux-2)
  - [Servers.ini file](#serversini-file)
- [Setting up the discord bot (little hard)](#setting-up-the-discord-bot-little-hard)
- [Final commands!](#final-commands)
- [The commands](#the-commands)
- [Feedback/Issues](#feedbackissues)

# Prerequisites

## Node JS (Node.js 16.9.0 or newer is required!)

### Windows

- Visit the [Node.js] website and download either the current or lts version

### MacOS

- Visit the [Node.js] website and download either the current or lts version

### Linux

- Check [this website](https://nodejs.org/en/download/package-manager/) for how to install it with your package manager

## Java

You need to install two different version of java in order to play all the versions of minecraft.

- For minecraft version 1.0 to version 1.16.5, you need to have Java 8 installed
- For minecraft version 1.17 to the current version, you need to have Java 17 installed

### Windows

- Visit the Adtoptium Website and download both [Java 17] and [Java 8]

### MacOS

- Visit the Adtoptium Website and download both [Java 17] and [Java 8]

### Linux

- Download openjdk 8 and 17 from your repository using your package manager

# Downloading the code

- It is recommended that you download the code by pressing the code button at the top of this page

# Configuring the code

This may require some poking around, but it isn't super difficult

The two files that you need to be concerned with are <i>java.ini</i> and <i>servers.ini</i>

<i>java.ini</i> contains the file paths to your java installations

<i>servers.ini</i> contains the file paths to your server jar files as well as options for those jar files

## Java.ini file

Inside of the java.ini file, there will be two entries, <strong>8</strong> and <strong>17</strong>

You need to fill these paths with the location of your java installations

### Windows

Because windows is a hellish operating system, their folder path are different from everyone else.
The paths for the files are located at `C:\Program Files\Eclipse Adoptium\jdk-[version]-hotspot\bin\java.exe`

When you paste these java paths into the java.ini file, <strong>MAKE SURE TO ADD TWO BACKSLASHES INSTEAD OF ONE (I.E. `C:\Program Files` -> `C:\\Program Files`</strong>

### MacOS (Untested paths)

- The paths for the java installations should be

`/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/java`

`/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/java`

- If you are using brew to install openjdk, the locations will be

`/usr/local/opt/openjdk@8/bin/java`

`/usr/local/opt/openjdk@8/bin/java`

### Linux

- For most distrobutions that I've used, these are the paths

`/usr/lib/jvm/java-8-openjdk/jre/bin/java`

`/usr/lib/jvm/java-17-openjdk/jre/bin/java`

## Servers.ini file

This file should be pretty straight forward

`[Vanilla]` is simply an id to determine seperate servers, if possible, please do not name these sections the same

The `PATH` variable should be a direct path to the server jar file.
When you paste server jar paths into the servers.ini file, <strong>MAKE SURE TO ADD TWO BACKSLASHES INSTEAD OF ONE (I.E. `C:\Program Files` -> `C:\\Program Files`</strong>

The `JAVA` variable is the version of java that the server should run on. Refer to [this section](#java) to see which version to use. (Value should be either 8 or 17)

`MIN_RAM` represents the minimum amount of ram that your server will use in Megabytes (i.e. 4Gb ram = 4096Mb)

`MIN_RAM` represents the maximum amount of ram that your server will use in Megabytes (i.e. 4Gb ram = 4096Mb)

The `NAME` variable represents what the /servers command will print. This name is not used for anything else.

# Setting up the discord bot (little hard)

1. The first thing that you need to do is visit your [Discord Developer Page]
2. Click on the `New Application` button located in the top right corner
3. Name the bot whatever you want (preferrably FireStarter) and tick TOS box below and the create button
4. This will bring you to the General Information page of your application. In the middle of the page, there is a section that says `APPLICATION ID`, click on the copy button below the ID and paste it into the .env file in the `ID` variable.
5. On the left side of the screen, on the navbar, there will be a button named Bot. Click on the button
6. Click on the add bot button that pops up
7. Under the profile picture of the bot, there will be a section named Authorization Flow. <strong>MAKE SURE TO TURN OFF THE PUBLIC BOT OPTION.</strong>
8. Further down the page, there will be a section named Privileged Gateway Intents, turn on the  <strong>Message Content Intent</strong> option and click the green Save Changes button that appears at the bottom of the screen
9. Back to the top of the page, click on the button that says reset token, this will grab the token that your discord bot uses to communicate with discord. <strong>DO NOT EVER SHARE THIS TOKEN WITH ANYONE, NO MATTER WHAT</strong>
10. Click the copy token button below the token and paste it into the .env file in the `TOKEN` variable
11. On the left navbar, there will be a dropdown labeled OAuth2. Click it and select the URL Generator option
12. In the scopes section, select both bot, and applications.commands
13. Press the copy button next to the url at the bottom of the page and paste it in a new tab
14. Select which server you want to add it to
15. Go the server you just added to bot to and copy the server id. (discord.com/channels/`SERVERID`/dontcopythislastpart)
16. Paste the server id into the .env file in the `GUILD` variable
17. That's it! The bot will handle registering the commands, and if everything is set up correctly, you should be good to go!

# Final commands!

Use the command prompt or terminal to navigate to the folder that firestarter is installed in, and type `npm i`, this will install all of the packages that allows your bot to communicate with discord.

Type `node index.js` to run the bot!

# The commands

The `/help` command will list all of the commands

The `/servers` command will list all of the server listed in the servers.ini file

The `/start` command will start the server with the corresponding value. (Values can be found by running the `/servers` command)

The `/stop` command will stop the server with the corresponding value. (Values can be found by running the `/servers` command)

The `/cmd` command will send a command the server with the corresponding value. (Values can be found by running the `/servers` command) (No slash is needed in the cmd option of the `/cmd` command)

The `/who` command will list all active platers on the server with the corresponding value. (Values can be found by running the `/servers` command)

# Feedback/Issues

Any and all feedback is greatly appreciated, as this is my first real project that I've seen to completion. Thank you!

[discord developer page]: https://discord.com/developers/applications
[java 17]: https://adoptium.net/temurin/releases/?version=17
[java 8]: https://adoptium.net/temurin/releases/?version=8
[node.js]: https://nodejs.org/
