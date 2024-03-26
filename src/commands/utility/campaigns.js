const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const logger = require('../../app-logger');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('campaigns')
		.setDescription('Receive latest galactic war campaign statuses'),
	async execute(interaction) {

		let warStatus = await getWarStatus();

		let warStatusJson = await warStatus.json();

		let campaigns = warStatusJson.campaigns;

		let activeCompaignPlanetIndexes = campaigns.map((campaign) => { return campaign.planet.index });

		let planets = getPlanets(activeCompaignPlanetIndexes, warStatusJson.planet_status);

		let embedArray = [];

		createPlanetEmbeds(planets, embedArray)

		let len = embedArray.length;

		let start = 0;
		let end = 10;
	
		await interaction.reply({ embeds: embedArray.slice(start, end) });

		len -= 10;

		while(len > 0) {
			start += 10;
			end += 10;
			await interaction.followUp({ embeds: embedArray.slice(start, end) });
			len -= 10;
		}
	},
};

async function getWarStatus() {
	return fetch('https://helldivers-2.fly.dev/api/801/status');
}

function getPlanets(indexes, planetStatus) {

	let planets = [];

	indexes.forEach((index) => {
		planets.push(planetStatus.filter((planetStatus) => planetStatus.planet.index === index)[0]); 
	})

	return planets;
}

function createPlanetEmbeds(planets, embeds) {
	planets.forEach((p) => {
		const planet = new EmbedBuilder();
		planet.setTitle(p.planet.name);
		planet.setThumbnail(getFactionIconLink(p.owner));
		planet.setDescription(`Currently under ${p.owner} occupation.`);
		planet.setColor(getColor(p.liberation));
		planet.setTimestamp();
		planet.addFields(
			{ name: 'Campaign Type  |', value: getCampaignType(p.owner), inline: true},
			{ name: 'Liberation Status  |', value: `${parseFloat(p.liberation).toFixed(2)}%`, inline: true},
			{ name: 'Hell Divers Deployed',  value: p.players.toString(), inline: true}
		)
		embeds.push(planet);
	});

}

function getCampaignType(owner) {
	if (owner == "Humans") {
		return "Defend";
	} 

	return owner === "Humans" ? "Defend" : "Liberation";
}

function getFactionIconLink(faction) {
	switch(faction) {
		case "Automaton":
			return "https://static.wikia.nocookie.net/helldivers_gamepedia/images/9/9e/Automatonlogo2.jpg/revision/latest?cb=20240225084229";
		case "Terminids":
			return "https://static.wikia.nocookie.net/helldivers_gamepedia/images/f/f6/Terminidlogo2.jpg/revision/latest?cb=20240225133503";
		default:
			return "https://static.wikia.nocookie.net/helldivers_gamepedia/images/8/8d/Super_earth.png/revision/latest?cb=20180527113712";
	}
}

function getColor(liberationPercent) {
	if (liberationPercent <= 25) {
		return 0xFF0000;
	}

	if (liberationPercent > 25 && liberationPercent <= 50) {
		return 0xFFA500;
	}

	if (liberationPercent > 50 && liberationPercent <= 75) {
		return 0xFFFF00;
	}

	if (liberationPercent > 75) {
		return 0x008000;
	}
}