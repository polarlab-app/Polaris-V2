const { PermissionFlagsBits } = require('discord.js');
const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

module.exports = {
    name: 'queue',
    description: 'Displays the first 3 songs in the queue',
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
            const tracks = player.queue.tracks;
            if (!tracks) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'missingPlayer',
                    commandName: module.exports.name,
                });
                return;
            }

            const actualTracks = tracks.slice(0, 3);
            const trackNames = actualTracks.map((track) => track.title);

            const embed = await embedBuilder('queue', module.exports.module, trackNames);
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
