const { modules } = require('../../config.json');
const { colors } = require('../../data/colors');
const errorHandler = require('../../handlers/errorHandler');

module.exports = {
    name: '',

    permissionsRequired: [],
    botPermissions: [PermissionFlagsBits.ManageRoles],

    callback: async (polaris, interaction) => {
        await interaction.deferReply();
        if (modules.module === 'disabled') {
            try {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'systemDisabled',
                    commandName: module.exports.name,
                });
            } catch (error) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'generic',
                    commandName: module.exports.name,
                    error: error,
                });
            }
        } else {
            try {
                interaction.editReply('test');
                console.log(colors.debug + `[DEBUG] ${interaction.user.id} ran ${module.exports.name}`)
            } catch (error) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'generic',
                    commandName: module.exports.name,
                    error: error,
                });
            }
        }
    },
};
