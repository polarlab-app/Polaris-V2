const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');

const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

module.exports = {
    name: 'loop',
    description: 'Loops the currently playing queue',
    options: [
        {
            name: 'type',
            description: 'The loop type to use',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'none',
                    value: '0',
                },
                {
                    name: 'song',
                    value: '1',
                },
                {
                    name: 'queue',
                    value: '2',
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

            if (!player) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'missingPlayer',
                    commandName: module.exports.name,
                });
                return;
            }

            const loopMode = await interaction.options.get('type').value;

            await player.setLoop(loopMode);

            const embed = await successEmbedBuilder('pause');
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
