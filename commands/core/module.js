const { ApplicationCommandOptionType } = require('discord.js');
const errorHandler = require('../../handlers/errorHandler');

const getGuildCommands = require('../../utilities/getGuildCommands');
const getModuleCommands = require('../../utilities/getModuleCommands');

module.exports = {
    name: 'module',
    description: 'Module management for the bot',
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
                    name: 'test',
                    value: 'ragey',
                },
            ],
        },
    ],
    module: 'enableddemo',

    botPermissions: [],
    permissionsRequired: [],

    callback: async (polaris, interaction) => {
        try {
            if (interaction.user.id != interaction.guild.ownerId) {
                await errorHandler({
                    interaction: interaction,
                    errorType: 'invalidPermissions',
                    commandName: module.exports.name,
                });
            }

            const action = await interaction.options.get('action').value;
            const commandModule = await interaction.options.get('module').value;

            const guildCommands = await getGuildCommands(polaris, interaction.guild.id);
            const moduleCommands = await getModuleCommands(commandModule);

            for (const moduleCommand of moduleCommands) {
                const { name, description, options } = moduleCommand;
                const existingCommand = await guildCommands.cache.find((cmd) => cmd.name === name);

                if (existingCommand) {
                    if (action == 'disable') {
                        await guildCommands.delete(existingCommand.id);
                        continue;
                    } else if (action == 'reload') {

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
                    } else {
                        await errorHandler({
                            interaction: interaction,
                            errorType: 'invalidAction',
                            commandName: module.exports.name,
                        });
                    }
                }
            }
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
