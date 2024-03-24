const { Client, Events, GatewayIntentBits, EmbedBuilder, Collection } = require('discord.js');
const fs = require('node:fs')
const path = require('node:path');
const logger = require('../src/app-logger');
const { checkForUpdates } = require('../src/patch-util')

module.exports = {
    startClient: () => {
        let client = new Client({ intents: [GatewayIntentBits.Guilds] });

        initCommands(client);

        client.once(Events.ClientReady, readyClient => {
            readyHandler(readyClient);
        });
        
        client.login(process.env.TOKEN);
        
        client.on(Events.InteractionCreate, async interaction => {
            interactionHandler(interaction);
        });
    }
}

function initCommands(client) {
    client.commands = new Collection();

    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);
    
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}

async function readyHandler(client) {
    logger.info("Application is ready to use.");

    setInterval(() => {
        checkForUpdates(async(item) => {
            if(!item) {
                return;
            }

            const channel = client.channels.cache.find(channel => channel.name === "seaf-high-command");

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(item.title)
                .setDescription(`Latest patch notes availible for ${item.title}`)
                .setURL(item.link)

            channel.send({embeds: [embed]})
        })
    }, 1800000);
}

async function interactionHandler(interaction) {
    if (!interaction.isChatInputCommand()) return;
        
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        logger.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        logger.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}