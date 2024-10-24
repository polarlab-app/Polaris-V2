const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const generateRandomNumber = require('../../utilities/generateRandomNumber');
const userData = require('../../schemas/userData');

module.exports = {
    name: 'beg',
    description: 'Beg for items from strangers',
    module: 'economy',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const loot = await generateRandomNumber(1, 1200);

            const user = await userData.findOneAndUpdate(
                { id: interaction.user.id },
                { $inc: { 'economy.purseBalance': loot } },
                { new: true, upsert: true }
            );

            await user.save();

            const embed = await embedBuilder('beg', `${module.exports.module}`, [loot, user.economy.purseBalance]);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await errorHandler({
                interaction: interaction,
                errorType: 'generic',
                commandName: module.exports.name,
                error: error,
            });
        }
    },
};
