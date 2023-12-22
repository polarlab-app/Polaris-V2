const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const { useMainPlayer, QueryType } = require('discord-player');


const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');


module.exports = {
    name: 'play',
    description: 'Plays audio in your voice channel',
    options: [{
        name: 'song',
        description: 'The song you want to play',
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
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
            const song = await interaction.options.get('song').value


            const player = await useMainPlayer();
            const res = await player.play(vc, song, {
                searchEngine: QueryType.AUTO,
                nodeOptions: {
                    metadata: {
                        channel: vc,
                    },
                    autoSelfDeaf: true,
                    volume: 30,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 10,
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 240,
                    connectionTimeout: 999999999,
                },
            });

            const track = await res.track;

            const embed = await embedBuilder('play', module.exports.module, [track.title, track.url, track.author]);
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
