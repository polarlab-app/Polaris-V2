const { ApplicationCommandOptionType } = require('discord.js');

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
                    name: 'Enable',
                    value: 'enable',
                },
                {
                    name: 'Disable',
                    value: 'disable',
                },
                {
                    name: 'Reload',
                    value: 'reload',
                }
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
                    value: 'leveling'
                },
                {
                    name: 'Support',
                    value: 'support'
                }
            ],
        },
    ],
    module: 'enableddemo',

    botPermissions: [],
    permissionsRequired: [],

    callback: async (polaris, interaction) => {
        console.log('test');
    },
};
