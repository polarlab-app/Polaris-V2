const errorHandler = require('../../handlers/errorHandler');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

const memberData = require('../../schemas/memberData');
const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'remove-warn',
    description: 'Removes a specific warning from a member',
    options: [
        {
            name: 'user',
            description: 'The user whose warn to remove',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'warn-id',
            description: 'The ID of the warning to remove',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    module: 'moderation',

    permissionsRequired: [PermissionFlagsBits.ManageNicknames],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const user = await interaction.options.get('user');
            const warnId = await interaction.options.get('warn-id').value;

            const memberDb = await memberData.findOne({
                id: `${interaction.guild.id}${user.value}`,
                warns: {
                    $elemMatch: {
                        id: warnId,
                    },
                },
            });

            if (!memberDb) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'invalidWarn',
                    commandName: module.exports.name,
                });
                return;
            }
            await memberData.updateOne({ id: memberDb.id }, { $pull: { warns: { id: warnId } } });

            const embed = await successEmbedBuilder(module.exports.name, [warnId, user.user.username]);
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
