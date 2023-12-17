const { modules } = require('../../config.json');
const { colors } = require('../../data/colors');

const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');

module.exports = {
    name: '',

    permissionsRequired: [],
    botPermissions: [],

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
        }
    },
};
