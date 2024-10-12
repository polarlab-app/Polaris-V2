const errorHandler = require('../../handlers/errorHandler');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');
const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');

const memberData = require('../../schemas/memberData');

module.exports = {
    name: 'clear-warns',
    description: 'Clears a users warns',
    options: [
        {
            name: 'user',
            description: 'The user whose warns to clear',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
    module: 'moderation',

    permissionsRequired: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const user = await interaction.options.get('user');
            await memberData.updateOne({ id: `${interaction.guild.id}${user.value}` }, { $set: { warns: [] } });

            const embed = await successEmbedBuilder(module.exports.name, [user.user.username]);
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
