const { PermissionFlagsBits } = require("discord.js");
const { useQueue } = require("discord-player");

const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

module.exports = {
    name: 'resume',
    description: 'Resumes paused Audio',
    module: 'music',
    
    permissionsRequired: [PermissionFlagsBits.Speak],
    botPermissions: [PermissionFlagsBits.Speak],

    callback: async (polaris, interaction) => {
        try {
            const vc = await interaction.member.voice.channel;
            if (!vc) {
                await errorHandler({interaction: interaction, errorType: 'voiceChannelRequired', commandName: module.exports.name});
                return;
            }
            const queue = await useQueue(interaction.guild.id);
            await queue.node.resume();

            const embed = await successEmbedBuilder('resume')
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
