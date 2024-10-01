const errorHandler = require('../../handlers/errorHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'role-info',
    description: 'Gets certain information about a role',
    options: [
        {
            name: 'role',
            description: 'The role you want to find information about',
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
    ],
    module: 'information',

    permissionsRequired: [],
    botPermissions: [],

    callback: async (polaris, interaction) => {
        try {
            const role = await interaction.options.get('role');

            let roleIcon;
            if (role.role.icon) {
                roleIcon = role.role.icon;
            } else {
                roleIcon = `https://cdn.discordapp.com/icons/${role.role.guild.id}/${role.role.guild.icon}`;
            }

            let permissions;

            const permissionsArray = role.role.permissions.toArray();
            if (permissionsArray.length !== 0) {
                permissions = permissionsArray.map((permission) => `> **${permission}**`).join('\n');
            } else {
                permissions = 'none';
            }

            const embed = await embedBuilder(
                module.exports.name,
                module.exports.module,
                [
                    role.value,
                    role.role.hexColor,
                    role.role.position,
                    role.role.hoist,
                    role.role.managed,
                    role.role.mentionable,
                    permissions,
                ],
                undefined,
                roleIcon
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
