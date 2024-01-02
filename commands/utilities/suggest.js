const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { ApplicationCommandOptionType } = require('discord.js');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

module.exports = {
    name: 'suggest',
    description: 'Suggests something to the server',
    options: [
        {
            name: 'suggestion',
            description: 'The user you want to report',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    module: 'utilities',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const successEmbed = await successEmbedBuilder(module.exports.name, `<@interaction.options.get('user').value>`);
            interaction.guild.channels.cache.forEach(async (channel) => {
                if (channel.topic == 'psuggest') {
                    const embed = await embedBuilder(module.exports.name, module.exports.module, [
                        interaction.user.id,
                        interaction.options.get('suggestion').value,
                    ]);
                    const message = await channel.send({ embeds: [embed] });
                    await message.react('<:ThumbsUp:1191755148242997309>')
                    await message.react('<:ThumbsDown:1191754994400112690>')
                    await message.react('<:magicwandsparkles:1157418380991660102>')
                }
            });
            await interaction.editReply({ embeds: [successEmbed] });
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
