const guildData = require('@schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');
const caseSchema = require('@schemas/case');

module.exports = async (polaris, emoji) => {
    const guild = await guildData.findOne({ id: emoji.guild.id });
    if (!guild) {
        return;
    }

    guild.data.emojis.push({ id: emoji.id, name: emoji.name });
    await guild.save();

    if (guild.config.logs.emojiLogs.status) {
        let channelSend;

        const auditLogs = await emoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiCreate,
            limit: 2,
        });
        const emojiCreateLog = auditLogs.entries.first();
        const creator = await emojiCreateLog.executor;

        await caseSchema.create({
            id: 't',
            name: 'emojiLogs',
            serverID: emoji.guild.id,
            status: 'Closed',
            action: 'Emoji Created',
            date: new Date().toISOString(),
            duration: 'Permanent',
            users: {
                offenderID: emoji.id,
                offenderUsername: emoji.name,
                authorID: creator.id,
                authorUsername: creator.username,
            },
            details: {
                note: 'N/A',
                reason: 'N/A',
                proof: 'N/A',
            },
        });
        if (!guild.config.logs.emojiLogs.channelID) {
            channelSend = await emoji.guild.channels.cache.find((c) => c.topic == 'pemojilogs');
            if (!channelSend) {
                return;
            }
        } else {
            channelSend = await emoji.guild.channels.cache.find((c) => c.id == guild.config.logs.emojiLogs.channelID);

            if (!channelSend) {
                channelSend = await emoji.guild.channels.cache.find((c) => c.topic == 'pemojilogs');
                if (!channelSend) {
                    return;
                }
            }
        }

        const embed = await embedBuilder('emojiCreate', 'logs', [creator.id, emoji.name, emoji.id]);
        await channelSend.send({ embeds: [embed] });
    }
};
