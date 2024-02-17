const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { ApplicationCommandOptionType } = require('discord.js');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

module.exports = {
    name: 'report',
    description: 'Reports a user to the staff team',
    options: [
        {
            name: 'user',
            description: 'The user you want to report',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'The reason for reporting the user',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    module: 'utilities',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const successEmbed = await successEmbedBuilder(
                module.exports.name,
                `<@interaction.options.get('user').value>`
            );
            interaction.guild.channels.cache.forEach(async (channel) => {
                if (channel.topic == 'preport') {
                    const embed = await embedBuilder(module.exports.name, module.exports.module, [
                        interaction.user.id,
                        interaction.options.get('user').value,
                        interaction.options.get('reason').value,
                    ]);
                    const message = await channel.send({ embeds: [embed] });
                    await message.react('<:ThumbsUp:1191755148242997309>');
                    await message.react('<:ThumbsDown:1191754994400112690>');
                }
            });
            await interaction.editReply({ embeds: [successEmbed] });
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
