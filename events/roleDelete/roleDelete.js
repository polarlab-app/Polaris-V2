const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, role) => {
    if (role.managed) {
        return;
    }

    const guild = await guildData.findOne({ id: role.guild.id });
    if (!guild) {
        return;
    }

    if (guild.config.logs.roleLogs.status == true) {
        let channelSend = await role.guild.channels.cache.find(
            (c) => c.id == guild.config.logs.roleLogs.channelId
        );

        if (!guild.config.logs.roleLogs.channelId || !channelSend) {
            channelSend = await role.guild.channels.cache.find(
                (c) => c.topic == 'pchannellogs'
            );
            if (!channelSend) {
                return;
            }
        }
        const auditLogs = await role.guild.fetchAuditLogs({
            type: AuditLogEvent.RoleDelete,
            limit: 2,
        });
        const roleDeleteLog = auditLogs.entries.first();
        const creator = await roleDeleteLog.executor;

        const embed = await embedBuilder('roleDelete', 'logs', [
            creator.id,
            role.name,
            role.id,
        ]);
        await channelSend.send({ embeds: [embed] });
    }
};
