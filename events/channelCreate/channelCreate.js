const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, channel) => {
    const guild = await guildData.findOne({ id: channel.guildId });
    if (!guild) {
        return;
    }

    if (guild.config.logs.channelLogs.status == true) {
        let channelSend = await channel.guild.channels.cache.find(
            (c) => c.id == guild.config.logs.channelLogs.channelId
        );

        if (!guild.config.logs.channelLogs.channelId || !channelSend) {
            channelSend = await channel.guild.channels.cache.find(
                (c) => c.topic == 'pchannellogs'
            );
            if (!channelSend) {
                return;
            }
        }

        const auditLogs = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelCreate,
            limit: 2,
        });
        const channelCreateLog = auditLogs.entries.first();
        const creator = await channelCreateLog.executor;

        const embed = await embedBuilder('channelCreate', 'logs', [
            creator.id,
            channel.id,
        ]);
        await channelSend.send({ embeds: [embed] });
    }
};
