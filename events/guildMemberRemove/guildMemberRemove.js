const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');

module.exports = async (polaris, member) => {
    try {
        const guild = await guildData.findOne({ id: member.guild.id });
        if (!guild) {
            return;
        }

        if (guild.config.logs.memberLogs.status == true) {
            let channelSend = await member.guild.channels.cache.find(
                (c) => c.id == guild.config.logs.memberLogs.channelId
            );

            if (!guild.config.logs.memberLogs.channelId || !channelSend) {
                channelSend = await member.guild.channels.cache.find(
                    (c) => c.topic == 'pmemberlogs'
                );
                if (!channelSend) {
                    return;
                }
            }

            const rolesArray = member.roles.cache;
            const roles = rolesArray
                .map((role) => `> <@&${role.id}>`)
                .join('\n');

            const embed = await embedBuilder(
                'guildMemberRemove',
                'logs',
                [member.user.id, roles],
                undefined,
                `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
            );
            await channelSend.send({ embeds: [embed] });
        }
    } catch (error) {
        console.log(error);
    }
};
