const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');
const errorHandler = require('../../handlers/errorHandler');
const embedBuilder2 = require('../../creators/embeds/embedBuilder2');
const caseSchema = require('../../schemas/case');
const memberData = require('../../schemas/memberData');
const generateCaseID = require('../../utilities/generateCaseID');

module.exports = {
	name: 'timeout',
	description: 'Times out a member from the server',
	options: [
		{
			name: 'user',
			description: 'The user to timeout',
			type: ApplicationCommandOptionType.Mentionable,
			required: true,
		},
		{
			name: 'duration',
			description: 'The duration of the timeout',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: 'reason',
			description: 'The reason for timing out the member',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
		{
			name: 'notes',
			description: 'Any additional notes regarding the timeout',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
		{
			name: 'proof',
			description: 'Proof relating to the timeout',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	module: 'moderation',
	permissionsRequired: [PermissionFlagsBits.ModerateMembers],
	botPermissions: [PermissionFlagsBits.ModerateMembers],

	callback: async (polaris, interaction) => {
		try {
			const id = interaction.options.get('user').value;
			const rawDuration = interaction.options.get('duration').value;
			const reason = interaction.options.get('reason')?.value || 'N/A';
			const notes = interaction.options.get('notes')?.value || 'N/A';
			const proof = interaction.options.get('proof')?.value || 'N/A';

			const caseID = await generateCaseID();
			const member = await memberData.findOne({ id: `${interaction.guild.id}${interaction.author.id}` });

			const modifiedDuration = rawDuration.split(' ');
			let duration = 0;
			for (const i in modifiedDuration) {
				duration += ms(modifiedDuration[i]);
			}
			const user = await interaction.guild.members.fetch(id);

			if (!user || !duration)
				await errorHandler({
					interaction: interaction,
					errorType: 'generic',
					commandName: module.exports.name,
				});

			await caseSchema.create({
				id: caseID,
				name: 'messageLogs',
				serverID: interaction.guild.id,
				status: 'Closed',
				action: 'Message Deleted',
				date: new Date().toISOString().toString(),
				duration: ms(duration, { long: true }),
				users: {
					offenderID: user.id,
					offenderUsername: user.username,
					authorID: interaction.author.id,
					authorUsername: interaction.author.username,
				},
				details: {
					note: notes,
					reason: reason,
					proof: proof,
				},
			});
			await user.timeout(duration, reason);
			const embed = await embedBuilder2({
				title: 'Member Timed Out',
				description: `**<@${user.user.id}>** has been timed out for **${rawDuration}**.`,
				footerType: 'moderation',
				timestamp: true,
			});
			await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			await errorHandler({
				interaction: interaction,
				errorType: 'generic',
				commandName: module.exports.name,
				error: error,
			});
		}
	},
};
