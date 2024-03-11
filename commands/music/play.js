const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');

const errorHandler = require('../../handlers/errorHandler');
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
            //const source = await interaction.options.get('source').value;

            const vc = await interaction.member.voice.channel;
            if (!vc) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'voiceChannelRequired',
                    commandName: module.exports.name,
                });
                return;
            }

            let player;

            try {
                player = await polaris.moon.players.get(interaction.guild.id);

                if (!player) {
                    player = await polaris.moon.players.create({
                        guildId: interaction.guild.id,
                        voiceChannel: interaction.member.voice.channel.id,
                        textChannel: interaction.channel.id,
                        autoPlay: false,
                        volume: 30,
                    });
                }
            } catch (error) {
                console.log(error);
            } finally {
                if (!player.connected) {
                    await player.connect({ setDeaf: true, setMute: false });
                }

                let res = await polaris.moon.search({
                    query: song,
                    source: 'youtube',
                    requester: [],
                });

                if (res.loadType == 'error') {
                    return await interaction.editReply({
                        content: `:x: Load failed - the system is not cooperating.`,
                    });
                } else if (res.loadType == 'empty') {
                    return await interaction.editReply({
                        content: `:x: No matches found!`,
                    });
                }

                if (res.loadType == 'playlist') {
                    for (const track of res.tracks) {
                        await player.queue.add(track);
                    }
                } else {
                    await player.queue.add(res.tracks[0]);
                }

                if (!player.playing) {
                    await player.play();
                }

                const embed = await embedBuilder('play', module.exports.module, [
                    res.tracks[0].title,
                    res.tracks[0].url,
                    res.tracks[0].author,
                ]);
                await interaction.editReply({ embeds: [embed] });
            }
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
