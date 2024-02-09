const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, oldEmoji, newEmoji) => {
    console.log(oldEmoji);
    console.log(newEmoji);
    const guild = await guildData.findOne({ id: oldEmoji.guild.id });
    if ((await guild.config.logs.roleLogs.find((cfg) => cfg.name == 'status').value) !== 'enabled') {
        return;
    }

    let channelSend;
    if (guild.config.logs.channelLogs.find((cfg) => cfg.name == 'channelId').value) {
        channelSend = oldEmoji.guild.channels.cache.find(
            (c) => c.id == guild.config.logs.channelLogs.find((cfg) => cfg.name == 'channelId').value
        );
    } else {
        channelSend = oldEmoji.guild.channels.cache.find((c) => c.topic == 'prolelogs');
    }

    const auditLogs = await oldEmoji.guild.fetchAuditLogs({ type: AuditLogEvent.EmojiUpdate, limit: 2 });
    const emojiUpdateLog = auditLogs.entries.first();
    const creator = await emojiUpdateLog.executor;

    const embed = await embedBuilder('emojiUpdate', 'logs', [creator.id, oldEmoji.name, newEmoji.name, oldEmoji.id]);
    await channelSend.send({ embeds: [embed] });
};
