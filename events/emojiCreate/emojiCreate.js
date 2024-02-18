const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, emoji) => {
    const guild = await guildData.findOne({ id: emoji.guild.id });
    if ((await guild.config.logs.roleLogs.find((cfg) => cfg.name == 'status').value) !== 'enabled') {
        return;
    }

    let channelSend;
    if (guild.config.logs.channelLogs.find((cfg) => cfg.name == 'channelId').value) {
        channelSend = emoji.guild.channels.cache.find(
            (c) => c.id == guild.config.logs.channelLogs.find((cfg) => cfg.name == 'channelId').value
        );
    } else {
        channelSend = emoji.guild.channels.cache.find((c) => c.topic == 'prolelogs');
    }

    const auditLogs = await emoji.guild.fetchAuditLogs({ type: AuditLogEvent.EmojiCreate, limit: 2 });
    const emojiCreateLog = auditLogs.entries.first();
    const creator = await emojiCreateLog.executor;

    const embed = await embedBuilder('emojiCreate', 'logs', [creator.id, emoji.name, emoji.id]);
    await channelSend.send({ embeds: [embed] });
};
