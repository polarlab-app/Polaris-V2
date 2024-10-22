const memberData = require('../../schemas/memberData');
const embedBuilder2 = require('../../creators/embeds/embedBuilder2');
const { ApplicationCommandOptionType } = require('discord.js');
module.exports = {
	name: 'leaderboard',
	description: 'Shows the top 10 users with the most XP',
	module: 'insights',
	options: [
		{
			name: 'category',
			description: 'The category to show the leaderboard for',
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{
					name: 'Levels',
					value: 'levels',
				},
				{
					name: 'Messages',
					value: 'messages',
				},
			],
		},
	],
	permissionsRequired: [],
	botPermissions: [],

	callback: async (polaris, interaction) => {
		let data;
		const category = interaction.options.get('category').value;

		if (category === 'levels') {
			data = await memberData
				.find({ id: { $regex: `^${interaction.guild.id}` } })
				.sort({ 'stats.rank': -1 })
				.limit(10);
		} else if (category === 'messages') {
			data = await memberData
				.find({ id: { $regex: `^${interaction.guild.id}` } })
				.sort({ 'stats.messages': -1 })
				.limit(10);
		}

		const embed = await embedBuilder2({
			title: 'Leaderboard',
			description: `${data
				.map((user, index) => {
					if (user) {
						if (category === 'levels')
							return `**${index + 1}.** <@${user.id.replace(interaction.guild.id, '')}> - 🏷️ ${
								user.stats.rank
							}\n`;
						else if (category === 'messages')
							return `**${index + 1}.** <@${user.id.replace(interaction.guild.id, '')}> - 💬 ${
								user.stats.messages
							}\n`;
					} else {
						return `**${index + 1}.** No data found`;
					}
				})
				.join('')}`,
			footerType: 'insights',
		});
		await interaction.editReply({ embeds: [embed] });
	},
};
