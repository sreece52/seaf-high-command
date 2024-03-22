const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const { getLatest } = require('../../patch-util');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('latest-patch')
		.setDescription('Retrieves the latest patch notes'),
	async execute(interaction) {
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