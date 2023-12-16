module.exports = async (polaris) => {

    let applicationCommands;
    applicationCommands = await polaris.application.commands;

  await applicationCommands.fetch();
  return applicationCommands;
};