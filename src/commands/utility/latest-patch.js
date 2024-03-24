const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const { getLatest } = require('../../patch-util');

const logger = require('../../app-logger');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('latest-patch')
		.setDescription('Retrieves the latest patch notes'),
	async execute(interaction) {
        const interactionGuildMember= await interaction.guild.members.fetch(interaction.user.id)

        logger.info(`COMMAND=<name=${interaction}, id=${interaction.id}> recieved from GUILD=<name=${interaction.guild}, id=${guild_id=interaction.guild.id}> initiated by USER=<username=${interactionGuildMember.user.username}, id=${interactionGuildMember.id}`)

        getLatest(async (item) => {
            const description = `Latest patch notes for ${item.title}`

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(item.title)
                .setDescription(description)
                .setURL(item.link)

            await interaction.reply({embeds: [ embed ]});
        });    
	},
};