const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('war-status')
		.setDescription('Receive latest galactic war status'),
	async execute(interaction) {
		let warStatus = await getWarStatus();

		let warStatusJson = await warStatus.json();

		let campaigns = warStatusJson.campaigns;

		let activeCompaignPlanetIndexes = campaigns.map((campaign) => { return campaign.planet.index });

		let planets = getPlanets(activeCompaignPlanetIndexes, warStatusJson.planet_status);

		let message = "# <TRANSMISSION RECIEVED>\n"

		message += "# __Active Campaigns__\n";

		message += createPlanetMessage(planets);

		if (warStatusJson.global_events.length != 0) {
			message += "# __Major Orders__\n";

			warStatusJson.global_events.forEach((orders) => {
				message += orders.message.en + "\n"
			});
		}

		message += "# <END OF TRANSMISSION>\n"

		await interaction.reply(message);
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

function createPlanetMessage(planets) {
	let message = "";
	planets.forEach((p) => {
		message += `## __${p.planet.name}__\n`;
		message += `> Campaign Type: ${getCampaignType(p.owner)}\n`
		message += `> Status: ${parseFloat(p.liberation).toFixed(2)} %\n`;
		message += `> Hell Divers Deployed: ${p.players}\n`;
	});

	return message;
}

function getCampaignType(owner) {
	if (owner == "Humans") {
		return "Defend";
	} 

	return owner === "Humans" ? "Defend" : "Liberation";
}