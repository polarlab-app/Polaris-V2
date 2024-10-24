const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const { ApplicationCommandOptionType } = require('discord.js');
const userData = require('../../schemas/userData');

module.exports = {
    name: 'withdraw',
    description: 'Withdraw a chosen amount of money from your bank account',
    options: [
        {
            name: 'amount',
            description: 'The amount of money to withdraw',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        },
    ],
    module: 'economy',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const amount = interaction.options.get('amount').value;
            const user = await userData.findOne({ id: interaction.user.id });

            if (user.economy.bankBalance >= amount) {
                const updatedUser = await userData.findOneAndUpdate(
                    { id: interaction.user.id },
                    {
                        $inc: { 'economy.purseBalance': amount, 'economy.bankBalance': -amount },
                    },
                    {
                        new: true,
                    }
                );

                await updatedUser.save();

                const embed = await embedBuilder('deposit', `${module.exports.module}`, [
                    amount,
                    updatedUser.economy.bankBalance,
                    updatedUser.economy.purseBalance,
                ]);

                await interaction.editReply({ embeds: [embed] });
            } else {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'notEnoughMoney',
                    commandName: module.exports.name,
                });
            }
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
