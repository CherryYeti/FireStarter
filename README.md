<h1 align="center">FireStarter</h1>

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Fire-dynamic-gradient.png" alt="firestarter-logo" width="120px" height="120px"/>
  <br>
    <i>
      FireStarter is a free and open source Discord bot used to start, stop and manage options on your minecraft servers using Python
    </i>
  <br>
</p>

<p align="center">
  <a href="https://javandel.net/jason">My Portfolio</a>
  ·
  <a href="https://github.com/cherryyeti/FireStarter-Python/issues">Submit an Issue</a>
  <br>
  <br>
</p>

# Why?
You may ask, why did I make this project? Well, the short answer is that my friend apparently hates answering discord messages, or being at his computer at all, so I decided to bypass him entirely and just run servers on his computer that I could remotely control.

# Prerequisites

## Python

In order to run this program, you must have [Python 3](https://www.python.org/downloads/windows/) installed.
<br>
<strong>If you are on Windows, make sure to check the box that says "Add Python X.X to PATH" during installation!</strong>

## Java

I would highly recommend using OpenJDK, reminder that Java 8 is required to run Minecraft versions 1.12 through 1.17. Java 17 is required to run Minecraft version 1.18 and up.     

Finding the paths for the java executables can be a bit dificult at times, so here are some pre-provided paths that may or may not work for you.

### Windows:
Since windows doesn't have a widespread package manager, you should download Java 8 and 17 from adoptium. <strong>You want the x64 msi!</strong>
<br>

[Java 8](https://adoptium.net/temurin/releases/?os=windows&package=jre&version=8)
<br>

[Java 17](https://adoptium.net/temurin/releases/?os=windows&package=jre&version=17)

The java executables are located in `C:\Program Files\Eclipse Adoptium\[version]\bin\java.exe`

### Linux:
Java 8: `/usr/lib/jvm/java-8-openjdk/jre/bin/java`
<br>

Java 17: `/usr/lib/jvm/java-17-openjdk/jre/bin/java`

### MacOS:
I would highly recommend using [brew](https://brew.sh/) to install openjdk
<br>

Java 8: `/usr/local/opt/openjdk@8/bin/java`
<br>

Java 17: `/usr/local/opt/openjdk@17/bin/java`

# Creating the bot

Check out this amazing guide by the people over at Nextcord https://docs.nextcord.dev/en/stable/discord.html

# Configuration

The yaml file is structured like this

```yaml
java:
  8: "path/to/java/8/executable"
  17: "path/to/java/17/executable"
servers:
  "server_1":
    "path": "/path/to/server/1.jar"
    "java_version": 17
    "minimum_ram": 2048
    "maximum_ram": 4096
  "server_2":
    "path": "/path/to/server/2.jar"
    "java_version": 17
    "minimum_ram": 2048
    "maximum_ram": 4096
discord:
  token: "token"
```

The ram option is in megabytes
<br>
<strong>The token from the discord bot creation should be put in the "token" option</strong>

# Running the bot
## Windows
Download the code from the button at the top of the page and unzip the file, then run the setup script

```DOS
setup.bat
```
Then, you can run the bot with

```DOS
run.bat
```
## Linux/Mac OS
Download the code from the button at the top of the page or by using the terminal command

```bash
git clone https://github.com/CherryYeti/FireStarter-Python
```
Mark all scripts in the directory as executable and run the setup.sh
```bash
chmod +x *.sh && ./setup.sh
```
Then, you can run the bot with

```DOS
./run.sh
```