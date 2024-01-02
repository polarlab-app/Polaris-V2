const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

module.exports = {
    name: 'poll',
    description: 'Create a poll in the server',
    options: [
        {
            name: 'poll',
            description: 'The user you want to report',
            required: true,
            type: ApplicationCommandOptionType.String,
        },

    ],
    module: 'utilities',

    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            interaction.guild.channels.cache.forEach(async (channel) => {
                if (channel.topic == 'ppoll') {
                    const embed = await embedBuilder(module.exports.name, module.exports.module, [
                        interaction.user.id,
                        interaction.options.get('poll').value,
                    ]);
                    const message = await channel.send({ embeds: [embed] });
                    await message.react('<:ThumbsUp:1191755148242997309>')
                    await message.react('<:ThumbsDown:1191754994400112690>')

                    const successEmbed = await successEmbedBuilder(module.exports.name, channel.id);
                    await interaction.editReply({ embeds: [successEmbed] });
                }
            });
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
