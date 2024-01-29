const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

module.exports = {
    name: 'volume',
    description: 'Sets the volume of the queue',
    options: [
        {
            name: 'volume',
            description: 'The volume you wish to use',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    module: 'music',
    
    permissionsRequired: [PermissionFlagsBits.Speak],
    botPermissions: [PermissionFlagsBits.Speak],

    callback: async (polaris, interaction) => {
        try {
            const vc = await interaction.member.voice.channel;
            const volume = await interaction.options.get("volume").value;

            if (!vc) {
                await errorHandler({interaction: interaction, errorType: 'voiceChannelRequired', commandName: module.exports.name});
                return;
            }
            if(volume < 0 || volume > 150) {
                return interaction.editReply({
                    content: ':x: The maximum volume increase is 150 and the minimum is 0'
                })
            }
            
            const player = await polaris.moon.players.get(interaction.guild.id)
            await player.setVolume(volume);

            const embed = await successEmbedBuilder('volume', [volume])
            await interaction.editReply({embeds: [embed]})
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
