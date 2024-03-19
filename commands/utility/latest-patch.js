const { SlashCommandBuilder } = require('discord.js');
const Parser  = require("rss-parser");

const { feed_url } = require('../../config.json');




module.exports = {
	data: new SlashCommandBuilder()
		.setName('latest-patch')
		.setDescription('Retrieves the latest patch notes'),
	async execute(interaction) {
        await interaction.reply('Retrieving the latest patch notes:');

        const parse = async url => {
            let parser = new Parser ();
            const feed = await parser.parseURL(url);

            let contentLength = feed.items[0].contentSnippet.length;

            if (contentLength <= 2000) {
                await interaction.followUp(feed.items[0].contentSnippet);
            } else {

                let numMessages = Math.floor(contentLength / 2000);
                
                startIndex = 0;
                endIndex = 2000;
                
                for (i = 0; i < numMessages; i++) {
                    await interaction.followUp(feed.items[0].contentSnippet.substring(startIndex, endIndex));
                    startIndex = endIndex;
                    if ((contentLength - endIndex) < 2000) {
                        break;
                    } else {
                        endIndex += 2000;
                    }
                }

                await interaction.followUp(feed.items[0].contentSnippet.substring(startIndex));
            }
        };
        
        parse(feed_url);
	},
};