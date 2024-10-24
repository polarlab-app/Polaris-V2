const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');
const caseSchema = require('../../schemas/case');
const errorHandler = require('../../handlers/errorHandler');
const generateCaseID = require('../../utilities/generateCaseID');

module.exports = async (polaris, oldRole, newRole) => {
	try {
		const guild = await guildData.findOne({ id: oldRole.guild.id });
		if (!guild) {
			return;
		}

		const roleIndex = guild.data.roles.findIndex((r) => r.id === oldRole.id);
		if (roleIndex !== -1) {
			guild.data.roles[roleIndex].name = newRole.name;
			guild.data.roles[roleIndex].color = newRole.color;
			guild.data.roles[roleIndex].position = newRole.rawPosition;
		} else {
			guild.data.roles.push({
				id: newRole.id,
				name: newRole.name,
				color: newRole.color,
				position: newRole.rawPosition,
			});
		}

		guild.markModified('data.roles');
		await guild.save();

		if (guild.config.logs.roleLogs.status) {
			let channelSend;

			const auditLogs = await newRole.guild.fetchAuditLogs({
				type: AuditLogEvent.RoleUpdate,
				limit: 2,
			});
			const roleCreateLog = auditLogs.entries.first();
			const creator = await roleCreateLog.executor;

			await caseSchema.create({
				id: generateCaseID(),
				name: 'roleLogs',
				serverID: newRole.guild.id,
				status: 'Closed',
				action: 'Role Updated',
				date: new Date().toISOString(),
				duration: 'Permanent',
				users: {
					offenderID: oldRole.id,
					offenderUsername: oldRole.name,
					authorID: creator.id,
					authorUsername: creator.username,
				},
				details: {
					note: 'N/A',
					reason: 'N/A',
					proof: 'N/A',
				},
			});
			if (!guild.config.logs.roleLogs.channelID) {
				channelSend = await role.guild.channels.cache.find((c) => c.topic == 'prolelogs');
				if (!channelSend) {
					return;
				}
			} else {
				channelSend = await role.guild.channels.cache.find((c) => c.id == guild.config.logs.roleLogs.channelID);

				if (!channelSend) {
					channelSend = await role.guild.channels.cache.find((c) => c.topic == 'prolelogs');
					if (!channelSend) {
						return;
					}
				}
			}

			const embed = await embedBuilder('roleUpdate', 'logs', []);
			await channelSend.send({ embeds: [embed] });
		}
	} catch (error) {
		await errorHandler({ errorType: 'generic', error: error });
	}
};
