const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, role) => {
    await console.log(role.guild.id);
    const guild = await guildData.findOne({ id: role.guild.id });
    if ((await guild.config.logs.roleLogs.find((cfg) => cfg.name == 'status').value) !== 'enabled') {
        return;
    }

    let channelSend;
    if (guild.config.logs.channelLogs.find((cfg) => cfg.name == 'channelId').value) {
        channelSend = role.guild.channels.cache.find(
            (c) => c.id == guild.config.logs.channelLogs.find((cfg) => cfg.name == 'channelId').value
        );
    } else {
        channelSend = role.guild.channels.cache.find((c) => c.topic == 'prolelogs');
    }

    const auditLogs = await role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleDelete, limit: 2 });
    const roleDeleteLog = auditLogs.entries.first();
    const creator = await roleDeleteLog.executor;

    const embed = await embedBuilder('roleDelete', 'logs', [creator.id, role.name, role.id]);
    await channelSend.send({ embeds: [embed] });
};
