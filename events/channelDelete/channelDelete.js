const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, channel) => {
    const guild = await guildData.findOne({ id: channel.guildId });
    if ((await guild.config.logs.channelLogs.find((cfg) => cfg.name == 'status').value) == 'enabled') {
        const channelSend = channel.guild.channels.cache.find(
            (c) => c.id == guild.config.logs.channelLogs.find((cfg) => cfg.name == 'channelId').value
        );

        const auditLogs = await channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelDelete, limit: 2 });
        const channelCreateLog = auditLogs.entries.first();
        const creator = await channelCreateLog.executor;

        const embed = await embedBuilder('channelDelete', 'logs', [creator.id, channel.name, channel.id]);
        await channelSend.send({ embeds: [embed] });
    }
};
