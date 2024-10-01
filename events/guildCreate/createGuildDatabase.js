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
            members: members
                .filter((member) => !member.user.bot)
                .map((member) => ({
                    id: member.id,
                    username: member.user.username,
                    name: member.displayName,
                    nickname: member.nickname,
                })),
            roles: guild.roles.cache
                .filter((role) => !role.managed && role.name !== '@everyone')
                .map((role) => ({
                    id: role.id,
                    name: role.name,
                    color: role.hexColor,
                    rawPosition: role.position,
                })),
            channels: guild.channels.cache
                .filter((channel) => channel.type != 4)
                .sort((a, b) => a.rawPosition - b.rawPosition)
                .map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                    rawPosition: channel.rawPosition,
                })),
            emojis: guild.emojis.cache.map((emoji) => ({
                id: emoji.id,
                name: emoji.name,
            })),
            staff: members
                .filter((member) => member.permissions.has(PermissionFlagsBits.Administrator) && !member.user.bot)
                .map((member) => ({
                    id: member.id,
                    value: 'dashboardAdministrator',
                    status: true,
                })),
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
                    filterMode: 'blacklist',
                    filter: [],
                },
                serverLogs: {
                    status: true,
                    channelID: null,
                    filterMode: 'blacklist',
                    filter: [],
                },
                roleLogs: {
                    status: true,
                    channelID: null,
                    filterMode: 'blacklist',
                    filter: [],
                },
                memberLogs: {
                    status: true,
                    channelID: null,
                    filterMode: 'blacklist',
                    filter: [],
                },
                messageLogs: {
                    status: true,
                    channelID: null,
                    filterMode: 'blacklist',
                    filter: [],
                },
                emojiLogs: {
                    status: true,
                    channelID: null,
                    filterMode: 'blacklist',
                    filter: [],
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
                rewards: {
                    status: false,
                    rewards: [],
                },
                boosters: {
                    status: false,
                    channelBoosters: [],
                    roleBoosters: [],
                    memberBoosters: [],
                },
            },
            music: {
                status: true,
                channelId: null,
            },
        },
    });
};
