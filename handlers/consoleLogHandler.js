module.exports = async ({ interaction, errorType, commandName }) => {
    const logs = {
        systemDisabled: `[ERROR] [502] Module Disabled`,
        debugInfo: `[INFO] (Guild: ${interaction.guild.id}) (Author: ${interaction.user.id}) (Command: ${commandName})`,
        commandRan: `[DEBUG] (Polaris) ${interaction.user.id} Ran ${commandName} Command`,
    };

    return logs[errorType] || 'undefined error';
};
