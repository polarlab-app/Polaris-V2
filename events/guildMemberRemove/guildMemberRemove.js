const guildData = require('../../schemas/guildData');
const embedBuilder = require('../../creators/embeds/embedBuilder');

module.exports = async (polaris, member) => {
    try {
        const guild = await guildData.findOne({ id: member.guild.id });

        if ((await guild.config.logs.memberLogs.find((cfg) => cfg.name == 'status').value) == 'enabled') {
            let channelSend;
            if ((await guild.config.logs.memberLogs.find((cfg) => cfg.name == 'channelId').value) != 0) {
                channelSend = await member.guild.channels.cache.find(
                    async (c) =>
                        c.id == (await guild.config.logs.memberLogs.find((cfg) => cfg.name == 'channelId').value)
                );
            } else {
                channelSend = await member.guild.channels.cache.find((c) => c.topic == 'pmemberlogs');
            }

            const rolesArray = member.roles.cache;
            const roles = rolesArray.map((role) => `> <@&${role.id}>`).join('\n');

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
