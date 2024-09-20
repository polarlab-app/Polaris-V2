const guildData = require('../../schemas/guildData');
const { colors } = require('../../data/consoleColors');
const { PermissionFlagsBits } = require('discord.js');

module.exports = async (polaris) => {
    try {
        for (const fetchedGuild of polaris.guilds.cache) {
            let guildDocument = await guildData.findOne({ id: `${fetchedGuild[0]}` });
            if (!guildDocument) {
                const guild = fetchedGuild[1];
                const members = await fetchedGuild[1].members.fetch();
                await guildData.create({
                    id: `${guild.id}`,
                    name: `${guild.name}`,
                    icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : null,
                    description: `${guild.description}`,
                    data: {
                        memberCount: `${guild.memberCount}`,
                        ownerID: `${guild.ownerId}`,
                        createdAt: `${guild.joinedTimestamp}`,
                        dateAdded: new Date().toISOString(),
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
                        staff: members
                            .filter(
                                (member) =>
                                    member.permissions.has(PermissionFlagsBits.Administrator) && !member.user.bot
                            )
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
                continue;
            }
            continue;
        }
        console.log(colors.success + '[POLARIS STABLE] Polaris Success: Guild Data Verified!');
    } catch (error) {
        console.log(error);
    }
};
