const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, oldEmoji, newEmoji) => {
    const guild = await guildData.findOne({ id: oldEmoji.guild.id });
    if (!guild) {
        return;
    }

    if (guild.config.logs.emojiLogs.status == true) {
        let channelSend = await oldEmoji.guild.channels.cache.find(
            (c) => c.id == guild.config.logs.emojiLogs.channelId
        );

        if (!guild.config.logs.emojiLogs.channelId || !channelSend) {
            channelSend = await oldEmoji.guild.channels.cache.find(
                (c) => c.topic == 'pemojilogs'
            );
            if (!channelSend) {
                return;
            }
        }
        const auditLogs = await oldEmoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiUpdate,
            limit: 2,
        });
        const emojiUpdateLog = auditLogs.entries.first();
        const creator = await emojiUpdateLog.executor;

        const embed = await embedBuilder('emojiUpdate', 'logs', [
            creator.id,
            oldEmoji.name,
            newEmoji.name,
            oldEmoji.id,
        ]);
        await channelSend.send({ embeds: [embed] });
    }
};
