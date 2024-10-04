const userData = require('../../schemas/userData');
const { colors } = require('../../data/consoleColors');

module.exports = async (polaris) => {
    try {
        for (const user of polaris.users.cache.values()) {
            const userDataCheck = await userData.findOne({ id: user.id });
            if (!userDataCheck) {
                await userData.create({
                    id: user.id,
                    economy: {
                        bankBalance: 0,
                        purseBalance: 0,
                        inventory: [],
                        job: null,
                    },
                });
            }
        }
        console.log(colors.success + '[POLARIS STABLE] Polaris Success: User Data Verified!');
    } catch (error) {
        console.log(error);
    }
};
