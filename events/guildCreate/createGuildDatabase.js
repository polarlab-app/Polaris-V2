const guildData = require('../../schemas/guildData');
const { PermissionFlagsBits } = require('discord.js');

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
            ownerID: `${guild.ownerId}`,
            createdAt: `${guild.createdAt}`,
            dateAdded: new Date().toISOString(),
            staff: members
                .filter((member) => member.permissions.has(PermissionFlagsBits.Administrator))
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
                    channelID: null,
                },
                serverLogs: {
                    status: true,
                    channelID: null,
                },
                roleLogs: {
                    status: true,
                    channelID: null,
                },
                memberLogs: {
                    status: true,
                    channelID: null,
                },
                messageLogs: {
                    status: true,
                    channelID: null,
                },
                emojiLogs: {
                    status: true,
                    channelID: null,
                },
            },
            verification: {
                status: false,
                roles: [],
                channelID: null,
            },
            leveling: {
                status: true,
                type: 'range',
                amount: '6/8',
                display: {
                    status: true,
                    type: 'current',
                    channelID: null,
                },
                rewards: [],
                channelBoosters: [],
                roleBoosters: [],
                memberBoosters: [],
            },
            music: {
                status: true,
                channelId: null,
            },
        },
    });
};
