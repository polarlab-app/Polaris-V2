const memberData = require('../../schemas/memberData');
const calculateRankExp = require('../../utilities/calculateRankExp');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const guildData = require('../../schemas/guildData');
const errorHandler = require('../../handlers/errorHandler');

module.exports = async (polaris, message) => {
    try {
        if (message.author.bot) {
            return;
        }

        let member = await memberData.findOne({ id: `${message.guild.id}${message.author.id}` });
        const guild = await guildData.findOne({ id: `${message.guild.id}` });
        if (!guild) return;
        if (!guild.config.leveling.status) return;

        if (!member) {
            await memberData.create({
                id: `${message.guild.id}${message.author.id}`,
                stats: {
                    exp: 0,
                    rank: 0,
                    messages: 0,
                },
            });
            return;
        } else {
            const calculateMultiplier = (boosters, ids) => {
                return boosters.reduce(
                    (acc, booster) => {
                        if (booster.status == true && ids.includes(booster.id)) {
                            if (guild.config.leveling.boosters.mode == 'multiply') {
                                return acc * booster.value;
                            } else if (guild.config.leveling.boosters.mode == 'add') {
                                console.log(acc + parseInt(booster.value));
                                return acc + parseInt(booster.value);
                            } else if (guild.config.leveling.boosters.mode == 'maximum') {
                                return Math.max(acc, parseInt(booster.value));
                            }
                        }
                        return acc;
                    },
                    guild.config.leveling.boosters.mode === 'multiply' ? 1 : 0
                );
            };

            let multiplier = 1;
            if (guild.config.leveling.boosters.status == true) {
                const roleMultiplier = calculateMultiplier(
                    guild.config.leveling.boosters.roleBoosters,
                    message.member.roles.cache.map((role) => role.id)
                );

                const channelMultiplier = calculateMultiplier(guild.config.leveling.boosters.channelBoosters, [
                    message.channel.id,
                ]);

                const memberMultiplier = calculateMultiplier(guild.config.leveling.boosters.memberBoosters, [
                    message.author.id,
                ]);

                if (guild.config.leveling.boosters.mode === 'multiply') {
                    multiplier *= roleMultiplier * channelMultiplier * memberMultiplier;
                } else if (guild.config.leveling.boosters.mode === 'add') {
                    multiplier += roleMultiplier + channelMultiplier + memberMultiplier;
                } else if (guild.config.leveling.boosters.mode === 'maximum') {
                    multiplier = Math.max(multiplier, roleMultiplier, channelMultiplier, memberMultiplier);
                }
            }

            if (guild.config.leveling.type == 'static') {
                member.stats.exp += parseInt(guild.config.leveling.amount) * multiplier;
            } else {
                const [min, max] = guild.config.leveling.amount.split('/');
                member.stats.exp +=
                    (Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min)) * multiplier;
                console.log(
                    (Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min)) * multiplier
                );
            }

            await member.save();

            const rankExp = await calculateRankExp(member.stats.rank + 1);

            if (member.stats.exp >= rankExp) {
                member.stats.rank += 1;
                await member.save();

                if (guild.config.leveling.display.status) {
                    const embed = await embedBuilder('leveling', 'leveling', [
                        parseInt(member.stats.rank),
                        parseInt(member.stats.rank) - 1,
                        message.member.id,
                    ]);

                    if (guild.config.leveling.display.type == 'dedicated') {
                        if (guild.config.leveling.display.channelID) {
                            const channel = await message.guild.channels.cache.get(
                                guild.config.leveling.display.channelID
                            );
                            if (!channel) return;
                            await channel.send({ embeds: [embed] });
                        } else {
                            message.guild.channels.cache.forEach(async (channel) => {
                                if (channel.topic == 'pleveling') {
                                    await channel.send({ embeds: [embed] });
                                }
                            });
                        }
                    } else {
                        await message.channel.send({ embeds: [embed] });
                    }
                }
                if (guild.config.leveling.rewards.status) {
                    const rankRole = guild.config.leveling.rewards.rewards.find(
                        (reward) => reward.id == member.stats.rank
                    );
                    if (rankRole && rankRole.status) {
                        const role = await message.guild.roles.cache.get(rankRole.value);
                        await message.member.roles.add(role);
                        await consoleLogHandler({ errorType: 'rankAdded', message: message });
                    }
                }
            }
        }
    } catch (error) {
        await errorHandler({ errorType: 'generic', error: error });
    }
};
