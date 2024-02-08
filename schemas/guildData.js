const { Schema, model } = require('mongoose');

let guildData = new Schema(
    {
        id: String,
        name: String,
        icon: String,
        description: String,
        data: [
            {
                name: String,
                value: String,
            },
        ],
        config: {
            general: [
                {
                    name: String,
                    value: String,
                },
            ],
            logs: {
                channelLogs: [
                    {
                        name: String,
                        value: String,
                    },
                ],
                serverLogs: [
                    {
                        name: String,
                        value: String,
                    },
                ],
            },
            leveling: [
                {
                    name: String,
                    value: String,
                },
            ],
            music: [
                {
                    name: String,
                    value: String,
                },
            ],
        },
    },
    {
        collection: 'guildData',
    }
);

module.exports = model('guildData', guildData);
