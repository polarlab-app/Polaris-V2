const memberData = require('../../schemas/memberData');
const { colors } = require('../../data/consoleColors');

module.exports = async (polaris) => {
    try {
        for (const guild of polaris.guilds.cache) {
            const members = await guild[1].members.fetch();
            for (const member of members) {
                const memberDataCheck = await memberData.findOne({ id: `${guild[1].id}${member[1].id}` });
                if (!memberDataCheck) {
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
        }
        console.log(colors.success + '[POLARIS STABLE] Polaris Success: Member Data Verified!');
    } catch (error) {
        console.log(error);
    }
};
