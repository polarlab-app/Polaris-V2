const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');
const caseSchema = require('../../schemas/case');
const generateCaseID = require('../../utilities/generateCaseID');

module.exports = async (polaris, message) => {
    try {
        const guild = await guildData.findOne({ id: message.guild.id });
        if (!guild) {
            return;
        }

        console.log('t');
        if (guild.config.logs.messageLogs.status == true) {
            console.log('t2');
            const auditLogs = await message.guild.fetchAuditLogs({
                type: AuditLogEvent.MessageDelete,
                limit: 1,
            });
            console.log('a');
            const messageCreateLog = await auditLogs.entries.first();
            const currentTime = Date.now();
            const auditLogTime = await messageCreateLog.createdTimestamp;
            const creator =
                Math.abs(auditLogTime - currentTime) <= 2000 ? await messageCreateLog.executor : message.author;

            console.log(creator);
            await caseSchema.create({
                id: generateCaseID(),
                name: 'messageLogs',
                serverID: message.guild.id,
                status: 'Closed',
                action: 'Message Deleted',
                date: new Date().toISOString(),
                duration: 'Permanent',
                users: {
                    offenderID: message.id,
                    offenderUsername: message.author.username,
                    authorID: creator.id,
                    authorUsername: creator.username,
                },
                details: {
                    note: message.content,
                    reason: 'N/A',
                    proof: 'N/A',
                },
            });

            if (guild.config.logs.messageLogs.channelID) {
                channelSend = await message.guild.channels.cache.find(
                    (c) => c.id == guild.config.logs.messageLogs.channelID
                );

                if (!channelSend) {
                    channelSend = await message.guild.channels.cache.find((c) => c.topic == 'pmessagelogs');
                    if (!channelSend) {
                        return;
                    }
                }

                const embed = await embedBuilder('messageDelete', 'logs', [
                    creator.id,
                    message.content,
                    message.author.id,
                ]);
                await channelSend.send({ embeds: [embed] });
            }
        }
    } catch (error) {
        console.log(error);
    }
};
