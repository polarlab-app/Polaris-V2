const { colors } = require('../data/consoleColors')

module.exports = async ({ interaction, errorType, commandName, polaris }) => {
    const logs = {
        systemDisabled: colors.error + `[ERROR] [502] Module Disabled`,
        devOnly: colors.error + `[ERROR] [606] Developer Only`,
        generic: colors.error + `[ERROR] [000] Internal System Error`,
        debugInfo: interaction ? colors.info + `[INFO] (Guild: ${interaction.guild.id}) (Author: ${interaction.user.id}) (Command: ${commandName})` : 'No interaction provided',
        commandRan: interaction ? colors.debug + `[DEBUG] (Polaris) ${interaction.user.id} Ran ${commandName} Command` : 'No interaction provided',
        space: 'ᅠᅠ',
        commandsRefreshing: colors.regular + 'Started refreshing application (/) commands',
        commandsRegistered: colors.regular + 'Successfully reloaded application (/) commands',
        pinging:  polaris ? colors.regular + `[SYSTEM] Current ping is ${polaris.ws.ping}ms` : 'Failed to fetch ping',
        invalidPermissions: colors.error + `[ERROR] [702] Invalid Permissions`,
        invalidBotPermissions: colors.error + `[ERROR] [701] Invalid Bot Permissions`,
        restart: colors.error + "[SYSTEM] Restarting the application...",
        voiceChannelRequired: colors.error + "[ERROR] [104] Voice Channel Required",
        invalidAction: colors.error + "[ERROR] [606] Invalid Action"
    };

    console.log(logs[errorType] || 'undefined');
};