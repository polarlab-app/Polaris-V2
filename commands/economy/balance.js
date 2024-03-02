const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const { ApplicationCommandOptionType } = require('discord.js');
const userData = require('../../schemas/userData');

module.exports = {
    name: 'balance',
    description: 'Displays yours or another users balance',
    options: [
        {
            name: 'user',
            description: 'The user whose balance to get',
            required: false,
            type: ApplicationCommandOptionType.Mentionable,
        },
    ],
    module: 'economy',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            let member;
            let user;
            let username;
            try {
                const option = await interaction.options.get('user');
                if (option) {
                    member = await userData.findOne({ id: option.value });
                    user = option.value;
                    username = option.user.username;
                } else {
                    member = await userData.findOne({ id: interaction.user.id });
                    user = interaction.user.id;
                    username = interaction.user.username;
                }
            } finally {
                const embed = await embedBuilder(module.exports.name, module.exports.module, [
                    member.purse_balance,
                    member.bank_balance,
                    user,
                    username,
                ]);
                await interaction.editReply({ embeds: [embed] });
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
