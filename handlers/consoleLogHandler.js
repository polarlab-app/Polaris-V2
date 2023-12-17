const { colors } = require('../data/consoleColors')

module.exports = async ({ interaction, errorType, commandName }) => {
    let logs = {
        systemDisabled: colors.error + `[ERROR] [502] Module Disabled`,
        devOnly: colors.error + `[ERROR] [606] Developer Only`,
        debugInfo: interaction ? colors.error + `[INFO] (Guild: ${interaction.guild.id}) (Author: ${interaction.user.id}) (Command: ${commandName})` : 'No interaction provided',
        commandRan: interaction ? colors.error + `[DEBUG] (Polaris) ${interaction.user.id} Ran ${commandName} Command` : 'No interaction provided',
        space: 'ᅠᅠ',
        commandsRefreshing: colors.regular + 'Started refreshing application (/) commands',
        commandsRegistered: colors.regular + 'Successfully reloaded application (/) commands',
    };

    console.log(logs[errorType] || 'undefined');
};