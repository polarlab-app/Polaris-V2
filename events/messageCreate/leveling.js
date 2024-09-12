const memberData = require('../../schemas/memberData');
const calculateRankExp = require('../../utilities/calculateRankExp');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const guildData = require('../../schemas/guildData');

module.exports = async (polaris, message) => {
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
            exp: 0,
            rank: 0,
            cases: [],
        });
        return;
    } else {
        if (guild.config.leveling.type == 'static') {
            member.exp += guild.config.leveling.amount;
        } else {
            member.exp += Math.floor(
                Math.round(
                    Math.random() *
                        (guild.config.leveling.amount.split('/')[1] - guild.config.leveling.amount.split('/')[0] + 1) +
                        guild.config.leveling.amount.split('/')[0]
                )
            );
        }
        await member.save();

        const rankExp = await calculateRankExp(member.rank);

        if (member.exp >= rankExp) {
            member.rank += 1;
            await member.save();

            if (guild.config.leveling.display.status) {
                if (guild.config.leveling.display.type == 'dedicated') {
                    if (guild.config.leveling.display.channelID) {
                        const channel = await message.guild.channels.cache.get(guild.config.leveling.display.channelID);
                        if (!channel) return;
                        const embed = await embedBuilder('leveling', 'leveling', [
                            member.rank,
                            member.rank - 1,
                            message.member.id,
                        ]);
                        await channel.send({ embeds: [embed] });
                    } else {
                        message.guild.channels.cache.forEach(async (channel) => {
                            if (channel.topic == 'pleveling') {
                                const embed = await embedBuilder('leveling', 'leveling', [
                                    member.rank,
                                    member.rank - 1,
                                    message.member.id,
                                ]);
                                await channel.send({ embeds: [embed] });
                            }
                        });
                    }
                } else {
                    const embed = await embedBuilder('leveling', 'leveling', [
                        member.rank,
                        member.rank - 1,
                        message.member.id,
                    ]);
                    await message.channel.send({ embeds: [embed] });
                }
            }
            if (guild.config.leveling.rewards) {
                const rankRole = guild.config.leveling.rewards.find((reward) => reward.id == member.rank);
                if (rankRole) {
                    const role = await message.guild.roles.cache.get(rankRole.value);
                    await message.member.roles.add(role);
                    await consoleLogHandler({ errorType: 'rankAdded', message: message });
                }
            }
        }
    }
};
