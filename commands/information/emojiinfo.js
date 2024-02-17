const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'emoji-info',
    description: 'View certain information about an emoji',
    options: [
        {
            name: 'name',
            description: 'The name of the emoji',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    module: 'information',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const name = await interaction.options.get('name').value;
            const emoji = interaction.guild.emojis.cache.find((e) => e.name == name);

            if (!emoji) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'generic',
                    commandName: module.exports.name,
                    error: error,
                });
            }

            const embed = await embedBuilder(
                module.exports.name,
                module.exports.module,
                [emoji.name, emoji.id, emoji.author, emoji.animated],
                undefined,
                emoji.imageURL()
            );
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
