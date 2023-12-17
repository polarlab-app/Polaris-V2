require('dotenv').config();

const getLocalCommands = require('../../utilities/getLocalCommands');
const getLocalButtons = require('../../utilities/getLocalButtons');

const errorHandler = require('../../handlers/errorHandler');
const { modules } = require('../../config.json');

const dev = process.env.DEVELOPER_ID;

module.exports = async (polaris, interaction) => {
    await interaction.deferReply();
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
                        commandName: interaction.customId,
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
                            commandName: interaction.customId,
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
                            commandName: interaction.customId,
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
                        commandName: interaction.customId,
                    });
                    return;
                } catch (error) {
                    await errorHandler({
                        errorType: 'generic',
                        interaction: interaction,
                        commandName: interaction.customId,
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
                commandName: interaction.customId,
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
                    interaction.reply({
                        embeds: [dev_only],
                        ephemeral: true,
                    });
                    return;
                }
            }

            if (buttonObject.permissionsRequired?.length) {
                for (const permission of buttonObject.permissionsRequired) {
                    if (!interaction.member.permissions.has(permission)) {
                        interaction.reply({
                            embeds: [invalid_permissions],
                            ephemeral: true,
                        });
                        return;
                    }
                }
            }

            if (buttonObject.botPermissions?.length) {
                for (const permission of buttonObject.botPermissions) {
                    const bot = interaction.guild.members.me;

                    if (!bot.permissions.has(permission)) {
                        interaction.reply({
                            embeds: [invalid_bot_permissions],
                            ephemeral: true,
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
