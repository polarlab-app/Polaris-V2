require('dotenv').config();

const getLocalCommands = require('../../utilities/getLocalCommands');
const getLocalButtons = require('../../utilities/getLocalButtons');

const errorHandler = require('../../handlers/errorHandler');
const consoleLogHandler = require('../../handlers/consoleLogHandler');
const { modules } = require('../../config.json');

const dev = process.env.DEVELOPER_ID;

module.exports = async (polaris, interaction) => {
    await interaction.deferReply();
    await consoleLogHandler({
        interaction: interaction,
        errorType: 'commandRan',
        commandName: await interaction.commandName,
    });
    if (interaction.isChatInputCommand()) {
        const localCommands = getLocalCommands();
        try {
            const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);
            if (!commandObject) return;

            if (commandObject.devOnly) {
                if (!dev == interaction.member.id) {
                    await errorHandler({
                        errorType: 'devOnly',
                        interaction: interaction,
                        commandName: interaction.commandName,
                    });
                    return;
                }
            }

            if (commandObject.permissionsRequired?.length) {
                for (const permission of commandObject.permissionsRequired) {
                    if (!interaction.member.permissions.has(permission)) {
                        await errorHandler({
                            errorType: 'invalidPermissions',
                            interaction: interaction,
                            commandName: interaction.commandName,
                        });
                        return;
                    }
                }
            }

            if (commandObject.botPermissions?.length) {
                for (const permission of commandObject.botPermissions) {
                    const bot = interaction.guild.members.me;

                    if (!bot.permissions.has(permission)) {
                        await errorHandler({
                            errorType: 'invalidBotPermissions',
                            interaction: interaction,
                            commandName: interaction.commandName,
                        });
                        return;
                    }
                }
            }

            if (modules[commandObject.module] == 'disabled') {
                try {
                    await errorHandler({
                        errorType: 'systemDisabled',
                        interaction: interaction,
                        commandName: interaction.commandName,
                    });
                    return;
                } catch (error) {
                    await errorHandler({
                        errorType: 'generic',
                        interaction: interaction,
                        commandName: interaction.commandName,
                        error: error,
                    });
                    return;
                }
            }

            await commandObject.callback(polaris, interaction);
        } catch (error) {
            await errorHandler({
                errorType: 'generic',
                interaction: interaction,
                commandName: interaction.commandName,
                error: error,
            });
        }
    } else if (interaction.isButton()) {
        const localButtons = await getLocalButtons();
        try {
            const buttonObject = localButtons.find((btn) => btn.name === interaction.customId);

            if (!buttonObject) return;

            if (buttonObject.devOnly) {
                if (!dev == interaction.member.id) {
                    await errorHandler({
                        errorType: 'devOnly',
                        interaction: interaction,
                        commandName: interaction.customId,
                    });
                    return;
                }
            }

            if (buttonObject.permissionsRequired?.length) {
                for (const permission of buttonObject.permissionsRequired) {
                    if (!interaction.member.permissions.has(permission)) {
                        await errorHandler({
                            errorType: 'invalidPermissions',
                            interaction: interaction,
                            commandName: interaction.customId,
                        });
                        return;
                    }
                }
            }

            if (buttonObject.botPermissions?.length) {
                for (const permission of buttonObject.botPermissions) {
                    const bot = interaction.guild.members.me;

                    if (!bot.permissions.has(permission)) {
                        await errorHandler({
                            errorType: 'invalidBotPermissions',
                            interaction: interaction,
                            commandName: interaction.customId,
                        });
                        return;
                    }
                }
            }

            await buttonObject.callback(polaris, interaction);
        } catch (error) {
            console.log('[HC]' + error);
        }
    } else if (interaction.isSelectMenu()) {
    }
};
