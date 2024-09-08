const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, emoji) => {
    const guild = await guildData.findOne({ id: emoji.guild.id });
    if (!guild) {
        return;
    }

    if (guild.config.logs.emojiLogs.status) {
        let channelSend = await emoji.guild.channels.cache.find((c) => c.id == guild.config.logs.emojiLogs.channelId);

        if (!guild.config.logs.emojiLogs.channelId || !channelSend) {
            channelSend = await emoji.guild.channels.cache.find((c) => c.topic == 'pemojilogs');
            if (!channelSend) {
                return;
            }
        }

        const auditLogs = await emoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiCreate,
            limit: 2,
        });
        const emojiCreateLog = auditLogs.entries.first();
        const creator = await emojiCreateLog.executor;

        const embed = await embedBuilder('emojiCreate', 'logs', [creator.id, emoji.name, emoji.id]);
        await channelSend.send({ embeds: [embed] });
    }
};
