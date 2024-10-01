const { colors } = require('../data/consoleColors');

module.exports = async ({ interaction, errorType, commandName, polaris, message }) => {
    const logs = {
        systemDisabled: colors.error + `[ERROR] [502] Module Disabled`,
        devOnly: colors.error + `[ERROR] [703] Developer Only`,
        generic: colors.error + `[ERROR] [000] Internal System Error`,
        debugInfo: interaction
            ? colors.info +
              `[INFO] (Guild: ${interaction.guild.id}) (Author: ${interaction.user.id}) (Command: ${commandName})`
            : 'No interaction provided',
        commandRan: interaction
            ? colors.debug + `[DEBUG] (Polaris) ${interaction.user.id} Ran ${commandName} Command`
            : 'No interaction provided',
        space: 'ᅠᅠ',
        commandsRefreshing: colors.regular + 'Started refreshing application (/) commands',
        commandsRegistered: colors.regular + 'Successfully reloaded application (/) commands',
        pinging: polaris ? colors.info + `[SYSTEM] Current ping is ${polaris.ws.ping}ms` : 'Failed to fetch ping',
        invalidPermissions: colors.error + `[ERROR] [702] Invalid Permissions`,
        invalidBotPermissions: colors.error + `[ERROR] [701] Invalid Bot Permissions`,
        restart: colors.error + '[SYSTEM] Restarting the application...',
        voiceChannelRequired: colors.error + '[ERROR] [104] Voice Channel Required',
        invalidAction: colors.error + '[ERROR] [606] Invalid Action',
        nonExistentUser: colors.error + '[ERROR] [904] User not found',
        rankAdded: message
            ? colors.debug + `[DEBUG] (Polaris) Added 1 rank to ${message.author.id}`
            : 'no author available',
        invalidWarn: colors.error + '[ERROR] [605] Invalid Warn Data provided',
    };

    console.log(logs[errorType] || 'undefined');
};
