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
        member.exp = parseInt(member.exp);
        if (guild.config.leveling.type == 'static') {
            member.exp += parseInt(guild.config.leveling.amount);
        } else {
            const [min, max] = guild.config.leveling.amount.split('/');

            member.exp += Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min);
        }
        await member.save();

        const rankExp = await calculateRankExp(member.rank);

        if (member.exp >= rankExp) {
            member.rank = parseInt(member.rank);

            member.rank += 1;
            await member.save();

            if (guild.config.leveling.display.status) {
                const embed = await embedBuilder('leveling', 'leveling', [
                    parseInt(member.rank),
                    parseInt(member.rank) - 1,
                    message.member.id,
                ]);

                if (guild.config.leveling.display.type == 'dedicated') {
                    if (guild.config.leveling.display.channelID) {
                        const channel = await message.guild.channels.cache.get(guild.config.leveling.display.channelID);
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
                const rankRole = guild.config.leveling.rewards.rewards.find((reward) => reward.id == member.rank);
                if (rankRole && rankRole.status) {
                    const role = await message.guild.roles.cache.get(rankRole.value);
                    await message.member.roles.add(role);
                    await consoleLogHandler({ errorType: 'rankAdded', message: message });
                }
            }
        }
    }
};
