const { PermissionFlagsBits } = require('discord.js');

const errorHandler = require('../../handlers/errorHandler');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

module.exports = {
    name: 'shuffle',
    description: 'Shuffles the current queue',
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

            if (!player) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'missingPlayer',
                    commandName: module.exports.name,
                });
                return;
            }

            await player.shuffle();

            const embed = await successEmbedBuilder('shuffle');
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
