const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

const { ApplicationCommandOptionType } = require('discord.js');
const memberData = require('../../schemas/memberData');

module.exports = {
    name: 'rank',
    description: 'Displays yours or another users rank',
    options: [
        {
            name: 'user',
            description: 'The users rank to get',
            required: false,
            type: ApplicationCommandOptionType.Mentionable,
        },
    ],
    module: 'leveling',

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
                    member = await memberData.findOne({ id: `${interaction.guild.id}${option.value}` });
                    user = option.value;
                    username = option.value.username
                } else {
                    member = await memberData.findOne({ id: `${interaction.guild.id}${interaction.user.id}` });
                    user = interaction.user.id;
                    username = interaction.user.username
                }
            } finally {
                const embed = await embedBuilder(module.exports.name, module.exports.module, [member.exp, member.rank, user, username]);
                await interaction.editReply({ embeds: [embed] });
                await consoleLogHandler({
                    interaction: interaction,
                    commandName: module.exports.name,
                    errorType: 'commandRan',
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
