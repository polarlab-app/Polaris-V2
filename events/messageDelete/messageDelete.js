const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, message) => {
    try {
        const guild = await guildData.findOne({ id: message.guild.id });
        if (!guild) {
            return;
        }

        if (guild.config.logs.messageLogs.status == true) {
            let channelSend = await message.guild.channels.cache.find(
                (c) => c.id == guild.config.logs.messageLogs.channelId
            );

            if (!guild.config.logs.messageLogs.channelId || !channelSend) {
                channelSend = await message.guild.channels.cache.find(
                    (c) => c.topic == 'pmessagelogs'
                );
                if (!channelSend) {
                    return;
                }
            }

            const auditLogs = await message.guild.fetchAuditLogs({
                type: AuditLogEvent.MessageDelete,
                limit: 1,
            });
            const messageCreateLog = auditLogs.entries.first();
            const creator = await messageCreateLog.executor;

            const embed = await embedBuilder('messageDelete', 'logs', [
                creator.id,
                message.content,
                message.author.id,
            ]);
            await channelSend.send({ embeds: [embed] });
        }
    } catch (error) {
        console.log(error);
    }
};
