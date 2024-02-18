const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, message) => {
    const guild = await guildData.findOne({ id: message.guild.id });
    if ((await guild.config.logs.roleLogs.find((cfg) => cfg.name == 'status').value) !== 'enabled') {
        return;
    }

    let channelSend;
    if (guild.config.logs.channelLogs.find((cfg) => cfg.name == 'channelId').value) {
        channelSend = message.guild.channels.cache.find(
            (c) => c.id == guild.config.logs.channelLogs.find((cfg) => cfg.name == 'channelId').value
        );
    } else {
        channelSend = message.guild.channels.cache.find((c) => c.topic == 'prolelogs');
    }

    const auditLogs = await message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete, limit: 1 });
    const messageCreateLog = auditLogs.entries.first();
    const creator = await messageCreateLog.executor;

    const embed = await embedBuilder('messageDelete', 'logs', [creator.id, message.content, message.author.id]);
    await channelSend.send({ embeds: [embed] });
};
