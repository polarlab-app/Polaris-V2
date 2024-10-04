const userData = require('../../schemas/userData');

module.exports = async (polaris, guild) => {
    for (const user of guild.members.fetch()) {
        const userDataCheck = await userData.findOne({ id: user.id });
        if (!userDataCheck && !user.bot) {
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
};
