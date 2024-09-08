const memberData = require('../../schemas/memberData');
const calculateRankExp = require('../../utilities/calculateRankExp');
const levelingRoles = require('../../data/levelingRoles.json');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

module.exports = async (polaris, message) => {
    if (message.author.bot) {
        return;
    }

    let member = await memberData.findOne({ id: `${message.guild.id}${message.author.id}` });

    if (!member) {
        await memberData.create({
            id: `${message.guild.id}${message.author.id}`,
            exp: 0,
            rank: 0,
            cases: [],
        });
        return;
    } else {
        member.exp += 6;
        await member.save();

        const rankExp = await calculateRankExp(member.rank);

        if (member.exp >= rankExp) {
            member.rank += 1;
            await member.save();

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
            const rankRole = await levelingRoles[member.rank];
            if (rankRole) {
                const role = await message.guild.roles.cache.get(rankRole);
                await message.member.roles.add(role);
                await consoleLogHandler({ errorType: 'rankAdded', message: message });
            }
        }
    }
};
