const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, emoji) => {
    try {
        const guild = await guildData.findOne({ id: emoji.guild.id });
        if (!guild) {
            return;
        }

        if (guild.config.logs.emojiLogs.status) {
            let channelSend = await emoji.guild.channels.cache.find(
                (c) => c.id == guild.config.logs.emojiLogs.channelId
            );

            if (!guild.config.logs.emojilLogs.channelId || !channelSend) {
                channelSend = await emoji.guild.channels.cache.find((c) => c.topic == 'pemojilogs');
                if (!channelSend) {
                    return;
                }
            }

            const auditLogs = await emoji.guild.fetchAuditLogs({
                type: AuditLogEvent.EmojiDelete,
                limit: 2,
            });
            const emojiDeleteLog = auditLogs.entries.first();
            const creator = await emojiDeleteLog.executor;

            const embed = await embedBuilder('emojiDelete', 'logs', [creator.id, emoji.name, emoji.id]);
            await channelSend.send({ embeds: [embed] });
        }
    } catch (error) {
        console.log(error);
        return;
    }
};
