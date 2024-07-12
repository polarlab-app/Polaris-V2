const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, role) => {
    const guild = await guildData.findOne({ id: role.guild.id });
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
    }

    const auditLogs = await role.guild.fetchAuditLogs({
        type: AuditLogEvent.RoleCreate,
        limit: 2,
    });
    const roleCreateLog = auditLogs.entries.first();
    const creator = await roleCreateLog.executor;

    const embed = await embedBuilder('roleUpdate', 'logs', []);
    await channelSend.send({ embeds: [embed] });
};
