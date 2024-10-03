const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');
const caseSchema = require('../../schemas/case');

module.exports = async (polaris, oldEmoji, newEmoji) => {
    const guild = await guildData.findOne({ id: oldEmoji.guild.id });
    if (!guild) {
        return;
    }

    const emojiIndex = guild.data.emojis.findIndex((e) => e.id === oldEmoji.id);
    if (emojiIndex !== -1) {
        guild.data.emojis[emojiIndex].name = newEmoji.name;
    } else {
        guild.data.emojis.push({ id: newEmoji.id, name: newEmoji.name });
    }
    guild.markModified('data.emojis');
    await guild.save();

    if (guild.config.logs.emojiLogs.status) {
        let channelSend;

        const auditLogs = await oldEmoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiCreate,
            limit: 2,
        });
        const emojiCreateLog = auditLogs.entries.first();
        const creator = await emojiCreateLog.executor;

        await caseSchema.create({
            id: 't',
            name: 'emojiLogs',
            serverID: oldEmoji.guild.id,
            status: 'Closed',
            action: 'Emoji Created',
            date: new Date().toISOString(),
            duration: 'Permanent',
            users: {
                offenderID: oldEmoji.id,
                offenderUsername: oldEmoji.name,
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
            channelSend = await oldEmoji.guild.channels.cache.find((c) => c.topic == 'pemojilogs');
            if (!channelSend) {
                return;
            }
        } else {
            channelSend = await oldEmoji.guild.channels.cache.find(
                (c) => c.id == guild.config.logs.emojiLogs.channelID
            );

            if (!channelSend) {
                channelSend = await oldEmoji.guild.channels.cache.find((c) => c.topic == 'pemojilogs');
                if (!channelSend) {
                    return;
                }
            }
        }

        const embed = await embedBuilder('emojiUpdate', 'logs', [
            creator.id,
            oldEmoji.name,
            newEmoji.name,
            oldEmoji.id,
        ]);
        await channelSend.send({ embeds: [embed] });
    }
};
