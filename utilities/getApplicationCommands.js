module.exports = async (polaris, guildId) => {
    let applicationCommands;
    let guildCommands;

    if (guildId) {
        const guild = await polaris.guilds.fetch(guildId);
        guildCommands = guild.commands;

        await guildCommands.fetch();
        return guildCommands;
    } else {
        applicationCommands = await polaris.application.commands;

        await applicationCommands.fetch();
        return applicationCommands;
    }
};
