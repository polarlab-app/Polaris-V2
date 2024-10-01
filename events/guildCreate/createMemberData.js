const memberData = require('../../schemas/memberData');

module.exports = async (polaris, guild) => {
    try {
        const members = await guild.members.fetch();

        members.forEach(async (member) => {
            if (!member.user.bot) {
                const supposedMember = await memberData.findOne({ id: `${guild.id}${member.user.id}` });

                if (!supposedMember) {
                    await memberData.create({
                        id: `${guild.id}${member.user.id}`,
                        stats: { exp: 0, rank: 0, messages: 0 },
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
};
