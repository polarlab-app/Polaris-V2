const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const embedBuilder = require('../../creators/embeds/embedBuilder');
const { ApplicationCommandOptionType } = require('discord.js');

const convertIntToHex = require('../../utilities/convertIntToHex');

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
                roleIcon = undefined;
            }

            const embed = await embedBuilder(
                module.exports.name,
                module.exports.module,
                [
                    role.value,
                    await convertIntToHex(role.role.color),
                    role.role.position,
                    role.role.hoist,
                    role.role.managed,
                    role.role.mentionable,
                ],
                undefined,
                roleIcon
            );
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
