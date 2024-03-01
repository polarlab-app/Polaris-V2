const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'member-info',
    description: 'Get a members information in an instant',
    options: [
        {
            name: 'member',
            description: 'The member whose information to get',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
    module: 'information',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const member = await interaction.options.get('member');

            const rolesArray = interaction.member.roles.cache;
            const roles = rolesArray.map((role) => `> <@&${role.id}>`).join('\n');

            const embed = await embedBuilder(
                module.exports.name,
                module.exports.module,
                [
                    member.value,
                    member.user.username,
                    member.user.bot,
                    member.member.joinedTimestamp.toString().slice(0, 10),
                    roles,
                ],
                undefined,
                `https://cdn.discordapp.com/avatars/${member.value}/${member.user.avatar}.png`
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
