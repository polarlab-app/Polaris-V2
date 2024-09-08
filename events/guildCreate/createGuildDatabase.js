const guildData = require('../../schemas/guildData');

module.exports = async (polaris, guild) => {
    let guildCheck = await guildData.findOne({ id: `${guild.id}` });
    if (guildCheck) {
        return;
    }
    const members = await guild.members.fetch();
    await guildData.create({
        id: `${guild.id}`,
        name: `${guild.name}`,
        icon: `${guild.iconURL()}`,
        description: `${guild.description}`,
        data: {
            memberCount: `${guild.memberCount}`,
            ownerId: `${guild.ownerId}`,
            createdAt: `${guild.createdAt}`,
            dateAdded: new Date().toISOString(),
            staff: members
                .filter((member) => member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
                .map((admin) => admin.id),
        },
        config: {
            general: {
                status: 'enabled',
                channelId: '0',
            },
            logs: {
                channelLogs: {
                    status: true,
                    channelID: '0',
                },
                serverLogs: {
                    status: true,
                    channelID: '0',
                },
                roleLogs: {
                    status: true,
                    channelID: '0',
                },
                memberLogs: {
                    status: true,
                    channelID: '0',
                },
                messageLogs: {
                    status: true,
                    channelID: '0',
                },
                emojiLogs: {
                    status: true,
                    channelID: '0',
                },
            },
            verification: {
                status: false,
                roles: [],
                channelID: '0',
            },
            leveling: {
                status: true,
                channelID: '0',
                exp: 'static',
                amount: '6',
            },
            music: {
                status: true,
                channelId: '0',
            },
        },
    });
};
