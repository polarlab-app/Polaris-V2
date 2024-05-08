const guildData = require('../../schemas/guildData');

module.exports = async (polaris, guild) => {
    let guildCheck = await guildData.findOne({ id: `${guild.id}` });
    if (guildCheck) {
        return;
    }

    await guildData.create({
        id: `${guild.id}`,
        name: `${guild.name}`,
        icon: `${guild.iconURL()}`,
        description: `${guild.description}`,
        data: {
            memberCount: `${guild.memberCount}`,
            ownerId: `${guild.ownerId}`,
        },
        config: {
            general: {
                status: 'enabled',
                channelId: '0',
            },
            logs: {
                channelLogs: {
                    status: 'enabled',
                    channelId: '0',
                },
                serverLogs: {
                    status: 'enabled',
                    channelId: '0',
                },
                roleLogs: {
                    status: 'enabled',
                    channelId: '0',
                },
                memberLogs: {
                    status: 'enabled',
                    channelId: '0',
                },
                messageLogs: {
                    status: 'enabled',
                    channelId: '0',
                },
                emojiLogs: {
                    status: 'enabled',
                    channelId: '0',
                },
            },
            verification: {
                status: 'disabled',
                roles: [],
                channelId: '0',
            },
            leveling: {
                status: 'enabled',
                channelId: '0',
                exp: 'static',
                expValue: '6',
            },
            music: {
                status: 'enabled',
                channelId: '0',
            },
        },
    });
};
