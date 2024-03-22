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
        data: [
            {
                name: 'memberCount',
                value: `${guild.memberCount}`,
            },
            {
                name: 'ownerId',
                value: `${guild.ownerId}`,
            },
        ],
        config: {
            general: [
                {
                    name: 'AIFunctionality',
                    value: 'true',
                },
            ],
            logs: {
                channelLogs: [
                    {
                        name: 'status',
                        value: 'enabled',
                    },
                    {
                        name: 'channelId',
                        value: '0',
                    },
                ],
                serverLogs: [
                    {
                        name: 'status',
                        value: 'enabled',
                    },
                    {
                        name: 'channelId',
                        value: '0',
                    },
                ],
                roleLogs: [
                    {
                        name: 'status',
                        value: 'enabled',
                    },
                    {
                        name: 'channelId',
                        value: '0',
                    },
                ],
                memberLogs: [
                    {
                        name: 'status',
                        value: 'enabled',
                    },
                    {
                        name: 'channelId',
                        value: '0',
                    },
                ],
                messageLogs: [
                    {
                        name: 'status',
                        value: 'enabled',
                    },
                    {
                        name: 'channelId',
                        value: '0',
                    },
                ],
                emojiLogs: [
                    {
                        name: 'status',
                        value: 'enabled',
                    },
                    {
                        name: 'channelId',
                        value: '0',
                    },
                ],
            },
            leveling: [
                {
                    name: 'status',
                    value: 'enabled',
                },
            ],
            music: [
                {
                    name: 'status',
                    value: 'enabled',
                },
            ],
        },
    });
    console.log('registered a new guild');
};
