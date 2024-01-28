const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'nick',
    description: 'Give yourself a fun nickname',
    options: [
        {
            name:'nickname',
            description: "The nickname you want to give yourself",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],
    module: 'utilities',

    permissionsRequired: [],
    botPermissions: [PermissionFlagsBits.ManageNicknames],

    callback: async (polaris, interaction) => {
        try {
            const nickname = await interaction.options.get('nickname').value;
            await interaction.member.setNickname(nickname);
            const successEmbed = await successEmbedBuilder(module.exports.name, [nickname]);
            await interaction.editReply({ embeds: [successEmbed] });
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
