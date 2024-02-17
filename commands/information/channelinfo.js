const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'channel-info',
    description: 'Gets information about a channel',
    options: [
        {
            name: 'channel',
            description: 'The channel to get the info of',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
    module: 'information',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const channel = await interaction.options.get('channel');

            const embed = await embedBuilder(
                module.exports.name,
                module.exports.module,
                [
                    channel.channel.id,
                    channel.channel.name,
                    channel.channel.rawPosition,
                    channel.type,
                    channel.channel.nsfw,
                ],
                undefined,
                `https://cdn.discordapp.com/icons/${channel.channel.guild.id}/${channel.channel.guild.icon}`
            );
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
