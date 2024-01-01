const { ApplicationCommandOptionType } = require('discord.js');

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
                    name: 'core',
                    value: 'core',
                },
                {
                    name: 'utilities',
                    value: 'utilities',
                },
                {
                    name: 'information',
                    value: 'information',
                },
                {
                    name: 'music',
                    value: 'music',
                }
            ],
        },
    ],

    callback: async (polaris, interaction) => {
        console.log("test")
    }
};
