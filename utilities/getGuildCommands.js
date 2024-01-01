module.exports = async (polaris, guildId) => {
    let guildCommands;

    const guild = await polaris.guilds.fetch(guildId);
    guildCommands = guild.commands;

    await guildCommands.fetch();
    return guildCommands;
};
