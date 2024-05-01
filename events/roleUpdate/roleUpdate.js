const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, role) => {
    const guild = await guildData.findOne({ id: role.guild.id });
    if ((await guild.config.logs.roleLogs.find((cfg) => cfg.name == 'status').value) !== 'enabled') {
        return;
    }

    let channelSend;
    if (guild.config.logs.roleLogs.find((cfg) => cfg.name == 'channelId').value != 0) {
        channelSend = role.guild.channels.cache.find(
            (c) => c.id == guild.config.logs.roleLogs.find((cfg) => cfg.name == 'channelId').value
        );
    } else {
        channelSend = role.guild.channels.cache.find((c) => c.topic == 'prolelogs');
    }

    const auditLogs = await role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleCreate, limit: 2 });
    const roleCreateLog = auditLogs.entries.first();
    const creator = await roleCreateLog.executor;

    const embed = await embedBuilder('roleUpdate', 'logs', []);
    await channelSend.send({ embeds: [embed] });
};
