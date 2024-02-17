const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');

const errorHandler = require('../../handlers/errorHandler');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

module.exports = {
    name: 'autoplay',
    description: 'Controls autoplay for music',
    options: [
        {
            name: 'mode',
            description: 'The mode of autoplay to use',
            required: true,
            type: ApplicationCommandOptionType.Boolean,
            choices: [
                {
                    name: 'Enable',
                    value: true,
                },
                {
                    name: 'Disable',
                    value: false,
                },
            ],
        },
    ],
    module: 'music',

    permissionsRequired: [PermissionFlagsBits.Speak],
    botPermissions: [PermissionFlagsBits.Speak],

    callback: async (polaris, interaction) => {
        try {
            const vc = await interaction.member.voice.channel;
            if (!vc) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'voiceChannelRequired',
                    commandName: module.exports.name,
                });
                return;
            }
            const player = await polaris.moon.players.get(interaction.guild.id);
            const status = await interaction.options.get('mode').value;

            if (!player) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'missingPlayer',
                    commandName: module.exports.name,
                });
                return;
            }
            await player.setAutoPlay(status);

            const embed = await successEmbedBuilder('pause');
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
