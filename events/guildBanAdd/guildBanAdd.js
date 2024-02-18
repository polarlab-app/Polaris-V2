const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { AuditLogEvent } = require('discord.js');

module.exports = async (polaris, arg) => {
    /*const guild = await guildData.findOne({ id: role.guild.id });
    if ((await guild.config.logs.memberLogs.find((cfg) => cfg.name == 'status').value) !== 'enabled') {
        return;
    }

    let channelSend;
    if (guild.config.logs.memberLogs.find((cfg) => cfg.name == 'channelId').value) {
        channelSend = role.guild.channels.cache.find(
            (c) => c.id == guild.config.logs.memberLogs.find((cfg) => cfg.name == 'channelId').value
        );
    } else {
        channelSend = role.guild.channels.cache.find((c) => c.topic == 'pmemberlogs');
    }

    const auditLogs = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 2 });
    const guildBanAddLog = auditLogs.entries.first();
    const creator = await guildBanAddLog.executor;

    const embed = await embedBuilder('guildBanAdd', 'logs', [creator.id, user.id, creator.id]);
    await channelSend.send({ embeds: [embed] });*/
};
