const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, emoji) => {
    const guild = await guildData.findOne({ id: emoji.guild.id });
    if ((await guild.config.logs.emojiLogs.find((cfg) => cfg.name == 'status').value) !== 'enabled') {
        return;
    }

    let channelSend;
    if (guild.config.logs.emojiLogs.find((cfg) => cfg.name == 'channelId').value != 0) {
        channelSend = emoji.guild.channels.cache.find(
            (c) => c.id == guild.config.logs.emojiLogs.find((cfg) => cfg.name == 'channelId').value
        );
    } else {
        channelSend = emoji.guild.channels.cache.find((c) => c.topic == 'pemojilogs');
    }

    const auditLogs = await emoji.guild.fetchAuditLogs({ type: AuditLogEvent.EmojiDelete, limit: 2 });
    const emojiDeleteLog = auditLogs.entries.first();
    const creator = await emojiDeleteLog.executor;

    const embed = await embedBuilder('emojiDelete', 'logs', [creator.id, emoji.name, emoji.id]);
    await channelSend.send({ embeds: [embed] });
};
