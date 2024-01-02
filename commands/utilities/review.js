const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { ApplicationCommandOptionType } = require('discord.js');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

module.exports = {
    name: 'review',
    description: 'Rreviews the server',
    options: [
        {
            name: 'review',
            description: 'The review you want to give to the server',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'rating',
            description: 'The rating to give to the server',
            required: true,
            type: ApplicationCommandOptionType.Number,
            choices: [
                {
                    name: 'Five Stars',
                    value: 5,
                },
                {
                    name: 'Four Stars',
                    value: 4,
                },
                {
                    name: 'Three Stars',
                    value: 3,
                },
                {
                    name: 'Two Stars',
                    value: 2,
                },
                {
                    name: 'One Star',
                    value: 1,
                },
            ],
        },
    ],
    module: 'utilities',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            interaction.guild.channels.cache.forEach(async (channel) => {
                if (channel.topic == 'preview') {
                    const rating = interaction.options.get('rating').value;
                    let stars;
                    if (rating == 5) {
                        stars = '⭐⭐⭐⭐⭐';
                    } else if (rating == 4) {
                        stars = '⭐⭐⭐⭐';
                    } else if (rating == 3) {
                        stars = '⭐⭐⭐';
                    } else if (rating == 2) {
                        stars = '⭐⭐';
                    } else if (rating == 1) {
                        stars = '⭐';
                    }
                    const embed = await embedBuilder(module.exports.name, module.exports.module, [
                        interaction.user.id,
                        interaction.options.get('review').value,
                        stars,
                    ]);
                    const message = await channel.send({ embeds: [embed] });
                    await message.react('<:ThumbsUp:1191755148242997309>');
                    await message.react('<:ThumbsDown:1191754994400112690>');
                }
            });
            const successEmbed = await successEmbedBuilder(
                module.exports.name
            );
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
