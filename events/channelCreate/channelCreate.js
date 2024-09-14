const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');
const caseSchema = require('../../schemas/case');

module.exports = async (polaris, channel) => {
    const guild = await guildData.findOne({ id: channel.guildId });
    if (!guild) {
        return;
    }

    if (guild.config.logs.channelLogs.status) {
        let channelSend;
        const auditLogs = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelCreate,
            limit: 2,
        });
        const channelCreateLog = auditLogs.entries.first();
        const creator = await channelCreateLog.executor;

        await caseSchema.create({
            id: 't',
            name: 'channelLogs',
            serverID: channel.guild.id,
            status: 'Closed',
            action: 'Channel Created',
            date: new Date().toISOString(),
            duration: 'Permanent',
            users: {
                offenderID: channel.id,
                offenderUsername: channel.name,
                authorID: creator.id,
                authorUsername: creator.username,
            },
            details: {
                note: 'N/A',
                reason: 'N/A',
                proof: 'N/A',
            },
        });
        if (!guild.config.logs.channelLogs.channelID) {
            channelSend = await channel.guild.channels.cache.find((c) => c.topic == 'pchannellogs');
            if (!channelSend) {
                return;
            }
        } else {
            channelSend = await channel.guild.channels.cache.find(
                (c) => c.id == guild.config.logs.channelLogs.channelID
            );

            if (!channelSend) {
                channelSend = await channel.guild.channels.cache.find((c) => c.topic == 'pchannellogs');
                if (!channelSend) {
                    return;
                }
            }
        }

        const embed = await embedBuilder('channelCreate', 'logs', [creator.id, channel.id]);
        await channelSend.send({ embeds: [embed] });
    }
};
