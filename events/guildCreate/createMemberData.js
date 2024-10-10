const memberData = require('../../schemas/memberData');

module.exports = async (polaris, guild) => {
    try {
        const members = await guild.members.fetch();
        for (const member of members) {
            const memberDataCheck = await memberData.findOne({ id: `${guild[1].id}${member[1].id}` });
            if (!memberDataCheck && !member.bot) {
                await memberData.create({
                    id: `${guild[1].id}${member[1].id}`,
                    stats: {
                        exp: 0,
                        rank: 0,
                        messages: 0,
                    },
                    cases: [],
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
};
