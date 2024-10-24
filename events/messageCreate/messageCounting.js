const memberData = require('../../schemas/memberData');
const guildData = require('../../schemas/guildData');

module.exports = async (polaris, message) => {
    if (message.author.bot) {
        return;
    }
    const guild = await guildData.findOne({ id: `${message.guild.id}` });
    if (!guild) return;

    const member = await memberData.findOne({ id: `${message.guild.id}${message.author.id}` });
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
        member.stats.messages += 1;
        await member.save();
    }
};
