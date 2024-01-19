const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');

const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

module.exports = {
    name: 'play',
    description: 'Plays audio in your voice channel',
    options: [
        {
            name: 'song',
            description: 'The song you want to play',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    module: 'music',

    permissionsRequired: [PermissionFlagsBits.Speak],
    botPermissions: [PermissionFlagsBits.Speak],

    callback: async (polaris, interaction) => {
        try {
            const song = await interaction.options.get('song').value;

            const vc = await interaction.member.voice.channel;
            if (!vc) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'voiceChannelRequired',
                    commandName: module.exports.name,
                });
                return;
            }

            player = await polaris.moon.players.create({
                guildId: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                autoPlay: false,
                volume: 30,
            });
            let res = await polaris.moon.search({
                query: song,
                source: 'youtube',
                requester: [],
            });

            if (res.loadType === 'loadfailed') {
                return interaction.editReply({
                    content: `:x: Load failed - the system is not cooperating.`,
                });
            } else if (res.loadType === 'empty') {
                return interaction.editReply({
                    content: `:x: No matches found!`,
                });
            }

            if (res.loadType === 'playlist') {
                for (const track of res.tracks) {
                    player.queue.add(track);
                }
            } else {
                player.queue.add(res.tracks[0]);
            }

            if (!player.playing) {
                player.play();
            }

            const embed = await embedBuilder('play', module.exports.module, [
                res.tracks[0].title,
                res.tracks[0].url,
                res.tracks[0].author,
            ]);
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
