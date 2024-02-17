const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');

module.exports = {
    name: 'server-info',
    description: 'Gets the current guilds information',
    module: 'information',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const guild = interaction.guild;

            const embed = await embedBuilder(
                module.exports.name,
                module.exports.module,
                [guild.id, guild.name, guild.ownerId, guild.memberCount, guild.preferredLocale, guild.roles.cache.size],
                undefined,
                `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
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
