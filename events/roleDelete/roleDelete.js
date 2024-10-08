const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');
const caseSchema = require('../../schemas/case');

module.exports = async (polaris, role) => {
    if (role.managed) {
        return;
    }

    const guild = await guildData.findOne({ id: role.guild.id });
    if (!guild) {
        return;
    }

    if (guild.config.logs.roleLogs.status) {
        let channelSend;

        const auditLogs = await role.guild.fetchAuditLogs({
            type: AuditLogEvent.RoleDelete,
            limit: 2,
        });
        const roleDeleteLog = auditLogs.entries.first();
        const creator = await roleDeleteLog.executor;

        await caseSchema.create({
            id: 't',
            name: 'roleLogs',
            serverID: role.guild.id,
            status: 'Closed',
            action: 'Role Deleted',
            date: new Date().toISOString(),
            duration: 'Permanent',
            users: {
                offenderID: role.id,
                offenderUsername: role.name,
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

        const embed = await embedBuilder('roleDelete', 'logs', [creator.id, role.name, role.id]);
        await channelSend.send({ embeds: [embed] });
    }
};
