const { PermissionFlagsBits } = require('discord.js');
const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
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
            const queue = await polaris.moon.getQueue(interaction.guild.id);

            if (!queue) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'missingPlayer',
                    commandName: module.exports.name,
                });
                return;
            }

            const tracks = await queue.tracks.toArray().slice(0, 3);
            const trackNames = await tracks.map((track) => track.title);

            const embed = await embedBuilder('queue', module.exports.module, trackNames);
            await interaction.editReply({ embeds: [embed] });
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
