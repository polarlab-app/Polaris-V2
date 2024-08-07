const { ApplicationCommandOptionType, CommandInteractionOptionResolver } = require('discord.js');
const errorHandler = require('../../handlers/errorHandler');
const successEmbedBuilder = require('../../creators/embeds/successBuilder');

const getApplicationCommands = require('../../utilities/getApplicationCommands');
const getLocalCommands = require('../../utilities/getLocalCommands');
const getModuleCommands = require('../../utilities/getModuleCommands');
const areCommandsDifferent = require('../../utilities/areCommandsDifferent');

module.exports = {
    name: 'module',
    description: 'Module management for Polaris',
    options: [
        {
            name: 'action',
            description: 'The action to take',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'enable',
                    value: 'enable',
                },
                {
                    name: 'disable',
                    value: 'disable',
                },
                {
                    name: 'Reload',
                    value: 'reload',
                },
            ],
        },
        {
            name: 'module',
            description: 'The module to take action on',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'Core',
                    value: 'core',
                },
                {
                    name: 'Moderation',
                    value: 'moderation',
                },
                {
                    name: 'Economy',
                    value: 'economy',
                },
                {
                    name: 'Utilities',
                    value: 'utilities',
                },
                {
                    name: 'Information',
                    value: 'information',
                },
                {
                    name: 'Music',
                    value: 'music',
                },
                {
                    name: 'Leveling',
                    value: 'leveling',
                },
                {
                    name: 'Support',
                    value: 'support',
                },
            ],
        },
    ],
    module: 'enableddemo',

    botPermissions: [],
    permissionsRequired: [],

    callback: async (polaris, interaction) => {
        try {
            /*if (interaction.user.id != interaction.guild.ownerId) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'invalidPermissions',
                    commandName: module.exports.name,
                });
                return;
            }*/

            const action = await interaction.options.get('action').value;
            const commandModule = await interaction.options.get('module').value;

            const guildCommands = await getApplicationCommands(polaris, interaction.guild.id);
            const moduleCommands = await getModuleCommands(commandModule);

            for (const moduleCommand of moduleCommands) {
                const { name, description, options } = moduleCommand;
                const existingCommand = await guildCommands.cache.find((cmd) => cmd.name === name);

                if (existingCommand) {
                    if (action == 'disable') {
                        await guildCommands.delete(existingCommand.id);
                        continue;
                    } else if (action == 'reload') {
                        if (areCommandsDifferent(existingCommand, moduleCommand)) {
                            await guildCommands.edit(existingCommand.id, {
                                description,
                                options,
                            });
                        }
                    } else {
                        await errorHandler({
                            interaction: interaction,
                            errorType: 'invalidAction',
                            commandName: module.exports.name,
                        });
                    }
                } else {
                    if (action == 'enable') {
                        await guildCommands.create({
                            name,
                            description,
                            options,
                        });
                    } else if (action == 'reload') {
                        await guildCommands.create({
                            name,
                            description,
                            options,
                        });
                    } else {
                        await errorHandler({
                            interaction: interaction,
                            errorType: 'invalidAction',
                            commandName: module.exports.name,
                        });
                    }
                }
            }

            const localCommands = await getLocalCommands();
            for (const actualCommand of guildCommands.cache.values()) {
                let containsCommand = localCommands.some((command) => command.name == actualCommand.name);
                if (!containsCommand) {
                    await guildCommands.delete(actualCommand.id);
                }
            }

            const embed = await successEmbedBuilder(action, [commandModule]);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await errorHandler({
                interaction: interaction,
                errorType: 'generic',
                commandName: module.exports.name,
                error: error,
            });
        }
    },
};
