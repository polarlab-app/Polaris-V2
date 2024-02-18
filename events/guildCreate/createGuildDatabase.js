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
                        value: '1103718172877660230',
                    },
                ],
                serverLogs: [
                    {
                        name: 'status',
                        value: 'enabled',
                    },
                ],
                roleLogs: [
                    {
                        name: 'status',
                        value: 'enabled',
                    },
                ],
                memberLogs: [
                    {
                        name: 'status',
                        value: 'enabled',
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
