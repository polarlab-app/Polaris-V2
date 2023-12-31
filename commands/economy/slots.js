const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
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
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],
    module: 'economy',
    
    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const amount = interaction.options.get('amount').value

            const user = await userData.findOne({ id: interaction.user.id });

            if (user.bank_balance >= amount) {
                const number = await generateRandomNumber(1, 2);
                
                if (number === 1) {
                    user.bank_balance -= amount;
                    await user.save();
                } else {
                    user.bank_balance += amount;
                    await user.save();
                }
            } else {
                await errorHandler({interaction: interaction, errorType: 'notEnoughMoney', commandName: module.exports.name})
            }

            /* const embed = await embedBuilder('slots', `${module.exports.module}`,[amount])
            await interaction.editReply({embeds: [embed]}) */
            await consoleLogHandler({
                interaction: interaction,
                commandName: module.exports.name,
                errorType: 'commandRan',
            });
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
