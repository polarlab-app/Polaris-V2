const guildData = require('../../schemas/guildData');
const { colors } = require('../../data/consoleColors');

module.exports = async (polaris) => {
    try {
        for (const fetchedGuild of polaris.guilds.cache) {
            let guildDocument = await guildData.findOne({ id: `${fetchedGuild[0]}` });
            if (!guildDocument) {
                const guild = fetchedGuild[1];
                await guildData.create({
                    id: `${guild.id}`,
                    name: `${guild.name}`,
                    icon: `${guild.icon}`,
                    description: `${guild.description}`,
                    data: {
                        memberCount: `${guild.memberCount}`,
                        ownerID: `${guild.ownerId}`,
                        createdAt: `${guild.joinedTimestamp}`,
                        dateAdded: new Date().toISOString(),
                        staff: [],
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
                            channelID: null,
                            exp: 'range',
                            amount: '6/8',
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
                continue;
            }
            continue;
        }
        console.log(colors.success + '[POLARIS STABLE] Polaris Success: Guild Data Verified!');
    } catch (error) {
        console.log(error);
    }
};
