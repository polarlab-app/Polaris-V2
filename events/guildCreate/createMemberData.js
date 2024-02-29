const memberData = require('../../schemas/memberData');

module.exports = async (polaris, guild) => {
    try {
        const members = await guild.members.fetch();

        members.forEach(async (member) => {
            if (!member.user.bot) {
                const databaseId = `${guild.id}${member.user.id}`;
                const supposedMember = await memberData.findOne({ id: databaseId });

                if (!supposedMember) {
                    await memberData.create({ id: databaseId, exp: 0, rank: 0, warns: [] });
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
};
