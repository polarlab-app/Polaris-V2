const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const generateRandomNumber = require('../../utilities/generateRandomNumber');
const { ApplicationCommandOptionType } = require('discord.js');
const userData = require('../../schemas/userData');

module.exports = {
    name: 'slots',
    description: 'Try your luck on a slots machine',
    options: [
        {
            name: 'amount',
            description: 'The amount you want to bet',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    module: 'economy',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const amount = interaction.options.get('amount').value;
            const user = await userData.findOne({ id: interaction.user.id });

            let result;
            if (user.bankBalance >= amount) {
                const number = await generateRandomNumber(1, 2);

                if (number === 1) {
                    user.bankBalance -= amount;
                    await user.save();
                } else {
                    user.bankBalance += amount;
                    await user.save();
                }

                switch (number) {
                    case 1:
                        result = 'lost';
                        break;
                    default:
                        result = 'earned';
                }
            } else {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'notEnoughMoney',
                    commandName: module.exports.name,
                });
                return;
            }

            const embed = await embedBuilder(`${module.exports.name}`, `${module.exports.module}`, [amount, result]);
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
