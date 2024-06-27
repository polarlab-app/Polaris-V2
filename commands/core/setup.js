const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');
const buttonBuilder = require('../../creators/buttons/buttonBuilder');

const { ApplicationCommandOptionType, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'setup',
    description: 'The core setup command',
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'verification',
            description: 'Sets up verification in the server',
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: 'channel',
                    description: 'The channel to setup verification in',
                    required: true,
                },
            ],
        },
    ],
    module: 'core',

    permissionsRequired: [],
    botPermissions: [],
    devOnly: true,

    callback: async (polaris, interaction) => {
        try {
            const channelId = await interaction.options.get('channel').value;
            const button = await buttonBuilder('verify');

            const row = new ActionRowBuilder().addComponents(button);
            const embed = await embedBuilder('verification', module.exports.module, [interaction.guild.name]);
            const successEmbed = await successEmbedBuilder('verification', [channelId]);

            const channel = await interaction.guild.channels.cache.find((c) => c.id == channelId);

            await channel.send({ embeds: [embed], components: [row] });

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
